/**
 * API Endpoint: Scrape Psychology Today Profile
 * URL: /api/scrape
 * Method: POST
 * Body: { profileUrl: string }
 */

import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import {
  ApiError,
  ErrorTypes,
  handleError,
  validateRequired,
  isValidPsychologyTodayUrl,
  logRequest,
} from "./utils/errors.js";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { profileUrl } = req.body;

    // Log request
    logRequest("scrape", { profileUrl });

    // Validate required fields
    validateRequired(req.body, ["profileUrl"]);

    // Validate URL format
    if (!isValidPsychologyTodayUrl(profileUrl)) {
      throw new ApiError(
        ErrorTypes.INVALID_URL.message,
        ErrorTypes.INVALID_URL.statusCode,
        ErrorTypes.INVALID_URL.code,
      );
    }

    // Scrape the profile
    const profileData = await scrapeProfile(profileUrl);

    return res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * Scrape a Psychology Today profile using Puppeteer
 * @param {string} url - The profile URL
 * @returns {Promise<Object>} Scraped profile data
 */
async function scrapeProfile(url) {
  let browser = null;
  // 🔥 DEBUG: Check environment
  console.log("=== PUPPETEER DEBUG ===");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("VERCEL:", process.env.VERCEL);
  console.log("isLocal will be:", !process.env.VERCEL);
  console.log("=======================");
  try {
    // Launch headless browser (local vs serverless)
    // const isLocal = process.env.NODE_ENV !== "production";
    const isLocal = !process.env.VERCEL;

    console.log("🔥 Using isLocal =", isLocal);
    if (isLocal) {
      console.log("🔥 Attempting to launch LOCAL puppeteer...");
      // Local development - use puppeteer with bundled Chrome
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      console.log("✅ LOCAL puppeteer launched successfully");
    } else {
      console.log("🔥 Attempting to launch SERVERLESS puppeteer...");
      // Production - use puppeteer-core with @sparticuz/chromium for Vercel
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
      console.log("✅ SERVERLESS puppeteer launched successfully");
    }
    // try {
    //   // Launch headless browser (serverless-compatible)
    //   const isLocal = process.env.NODE_ENV !== "production";

    //   browser = await puppeteer.launch({
    //     args: isLocal ? [] : chromium.args,
    //     executablePath: isLocal ? undefined : await chromium.executablePath(),
    //     headless: true,
    //   });

    //   browser = await puppeteer.launch({
    //     args: chromium.args,
    //     defaultViewport: chromium.defaultViewport,
    //     executablePath: await chromium.executablePath(),
    //     headless: chromium.headless,
    //   });

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3] });
      window.chrome = { runtime: {} };
    });

    // Navigate to profile
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    // ADD THIS
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Wait for content to load
    await page
      .waitForSelector(".profile-content", { timeout: 10000 })
      .catch(() => {});

    // Extract profile data
    const profileData = await page.evaluate(() => {
      const getText = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : "";
      };

      const getAll = (selector) => {
        return Array.from(document.querySelectorAll(selector)).map((el) =>
          el.textContent.trim(),
        );
      };

      const getAttr = (selector, attr) => {
        const element = document.querySelector(selector);
        return element ? element.getAttribute(attr) : "";
      };

      return {
        // Basic Info
        name: getText(
          '.profile-name, h1.profile-title, [data-test-id="therapist-name"]',
        ),
        credentials: getText(
          '.profile-credentials, .credentials, [data-test-id="credentials"]',
        ),
        location: getText(
          '.profile-location, .location, [data-test-id="location"]',
        ),

        // Headline
        headline: getText(
          '.profile-statement, .profile-tagline, h2.statement, [data-test-id="profile-statement"]',
        ),

        // About Me
        aboutMe: getText(
          '.profile-about, .about-me, [data-test-id="about-me"], #profile-bio',
        ),

        // Photo
        photoUrl: getAttr(
          '.profile-photo img, .therapist-photo img, [data-test-id="profile-photo"]',
          "src",
        ),

        // Specialties
        specialties: getAll(
          '.profile-specialties li, .specialties-list li, [data-test-id="specialty-item"]',
        ),

        // Issues Treated
        issues: getAll(
          '.profile-issues li, .issues-list li, [data-test-id="issue-item"]',
        ),

        // Treatment Approach
        treatmentApproach: getText(
          '.profile-treatment, .treatment-approach, [data-test-id="treatment-approach"]',
        ),
        treatmentMethods: getAll(
          '.profile-modalities li, .modalities-list li, [data-test-id="modality-item"]',
        ),

        // Client Focus
        clientFocus: getAll(
          '.profile-demographics li, .client-focus li, [data-test-id="demographic-item"]',
        ),
        ageGroups: getAll(
          '.profile-age-groups li, .age-groups li, [data-test-id="age-group-item"]',
        ),

        // Session Info
        sessionType: getAll(
          '.profile-session-types li, .session-types li, [data-test-id="session-type"]',
        ),
        sessionFee: getText(
          '.profile-fee, .session-fee, [data-test-id="session-fee"]',
        ),
        insurance: getAll(
          '.profile-insurance li, .insurance-list li, [data-test-id="insurance-item"]',
        ),

        // Years of Experience
        yearsExperience: getText(
          '.profile-years-practice, .years-experience, [data-test-id="years-experience"]',
        ),

        // License Info
        licenseNumber: getText(
          '.profile-license, .license-info, [data-test-id="license"]',
        ),

        // Education
        education: getAll(
          '.profile-education li, .education-list li, [data-test-id="education-item"]',
        ),

        // Additional Info
        languages: getAll(
          '.profile-languages li, .languages-list li, [data-test-id="language-item"]',
        ),
        website: getAttr(
          '.profile-website a, a[data-test-id="website"]',
          "href",
        ),

        // Meta
        profileUrl: window.location.href,
        scrapedAt: new Date().toISOString(),
      };
    });

    await browser.close();

    // Validate that we got meaningful data
    if (!profileData.name || !profileData.aboutMe) {
      throw new ApiError(
        "Failed to extract profile data. The profile may be private or the page structure has changed.",
        500,
        "SCRAPING_FAILED",
      );
    }

    return profileData;
  } catch (error) {
    if (browser) {
      await browser.close();
    }

    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Scraping error:", error);
    throw new ApiError(
      ErrorTypes.SCRAPING_FAILED.message,
      ErrorTypes.SCRAPING_FAILED.statusCode,
      ErrorTypes.SCRAPING_FAILED.code,
    );
  }
}

/**
 * Clean and normalize scraped text
 * @param {string} text - Raw text
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  return text.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();
}
