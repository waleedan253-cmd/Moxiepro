/**
 * API Endpoint: Create Full Audit (Scrape + Analyze)
 * URL: /api/create-audit
 * Method: POST
 * Body: { profileUrl: string, userEmail: string, referralCode?: string }
 *
 * This is the main endpoint the frontend will call to generate an audit.
 * It handles rate limiting, URL caching, scraping, and analysis.
 */

import dotenv from "dotenv";
dotenv.config();
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import puppeteerRegular from "puppeteer";
import { generateAudit } from "./utils/claude.js";
import {
  saveAudit,
  getAuditByUrl,
  getAudit,
  checkRateLimit,
  getOrCreateUser,
  updateUser,
  getUserByReferralCode,
  incrementReferral,
  getReferralCreditAmount,
} from "./utils/kv.js";
import {
  ApiError,
  ErrorTypes,
  handleError,
  validateRequired,
  isValidEmail,
  isValidPsychologyTodayUrl,
  getClientIp,
  logRequest,
} from "./utils/errors.js";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // 🔥 ADD THIS DEBUG BLOCK
  console.log("=== CREATE AUDIT DEBUG ===");
  console.log("Request body:", req.body);
  console.log("ENV Check:", {
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasRedisUrl: !!process.env.REDIS_URL,
    redisUrlPreview: process.env.REDIS_URL?.substring(0, 20) + "...",
  });
  console.log("========================");

  try {
    const { profileUrl, userEmail, referralCode } = req.body;

    // Log request
    logRequest("create-audit", {
      userEmail,
      profileUrl,
      hasReferralCode: !!referralCode,
    });

    // Validate required fields
    validateRequired(req.body, ["profileUrl", "userEmail"]);

    // Validate email format
    if (!isValidEmail(userEmail)) {
      throw new ApiError(
        ErrorTypes.INVALID_EMAIL.message,
        ErrorTypes.INVALID_EMAIL.statusCode,
        ErrorTypes.INVALID_EMAIL.code,
      );
    }

    // Validate URL format
    if (!isValidPsychologyTodayUrl(profileUrl)) {
      throw new ApiError(
        ErrorTypes.INVALID_URL.message,
        ErrorTypes.INVALID_URL.statusCode,
        ErrorTypes.INVALID_URL.code,
      );
    }

    // TODO: RE-ENABLE BEFORE LAUNCH! Rate limiting temporarily disabled for MVP testing
    // Check rate limit (3 audits per IP per day)
    // const clientIp = getClientIp(req);
    // const rateLimit = await checkRateLimit(clientIp);

    // Check rate limit (3 audits per IP per day)
    const clientIp = getClientIp(req);
    let rateLimit;
    try {
      rateLimit = await checkRateLimit(clientIp);

      // if (!rateLimit.allowed) {
      //   throw new ApiError(
      //     ErrorTypes.RATE_LIMIT_EXCEEDED.message,
      //     ErrorTypes.RATE_LIMIT_EXCEEDED.statusCode,
      //     ErrorTypes.RATE_LIMIT_EXCEEDED.code,
      //   );
      // }
    } catch (error) {
      // 🔥 BETTER ERROR LOGGING
      console.error("=== CREATE AUDIT ERROR ===");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error code:", error.code);
      console.error("========================");
      console.error("Rate limit check failed:", error);
      // Default to allowing if rate limit check fails
      rateLimit = { allowed: true, remaining: 3 };
    }

    // if (!rateLimit.allowed) {
    //   throw new ApiError(
    //     ErrorTypes.RATE_LIMIT_EXCEEDED.message,
    //     ErrorTypes.RATE_LIMIT_EXCEEDED.statusCode,
    //     ErrorTypes.RATE_LIMIT_EXCEEDED.code
    //   );
    // }

    // Check if this URL was already audited in the last 30 days
    const existingAuditId = await getAuditByUrl(profileUrl);
    if (existingAuditId) {
      const existingAudit = await getAudit(existingAuditId);
      if (existingAudit && Date.now() < existingAudit.expiresAt) {
        // Return cached audit
        return res.status(200).json({
          success: true,
          data: {
            auditId: existingAudit.id,
            cached: true,
            message:
              "This profile was recently audited. Returning cached results.",
            remainingAudits: rateLimit?.remaining || 0,
          },
        });
      }
    }

    // Get or create user
    const user = await getOrCreateUser(userEmail);

    // Handle referral code if provided
    if (referralCode && !user.referredBy) {
      const referrer = await getUserByReferralCode(referralCode);
      if (referrer && referrer.email !== userEmail) {
        // Valid referral - credit the referrer
        const creditAmount = getReferralCreditAmount(referrer.referralCount);
        await incrementReferral(referrer.email, creditAmount);

        // Mark this user as referred
        await updateUser(userEmail, { referredBy: referrer.email });

        logRequest("referral-credited", {
          referrer: referrer.email,
          newUser: userEmail,
          creditAmount,
        });
      }
    }

    // Step 1: Scrape the profile
    const profileData = await scrapeProfile(profileUrl);

    // DEBUG: Log what was actually scraped
    console.log("=== SCRAPED PROFILE DATA ===");
    console.log("Name:", profileData.name);
    console.log("About Me length:", profileData.aboutMe?.length || 0);
    console.log("Headline:", profileData.headline);
    console.log("=== CALLING CLAUDE API ===");
    console.log("API Key exists:", !!process.env.ANTHROPIC_API_KEY);
    console.log(
      "API Key preview:",
      process.env.ANTHROPIC_API_KEY?.substring(0, 20) + "...",
    );

    console.log("Specialties count:", profileData.specialties?.length || 0);
    console.log("Issues count:", profileData.issues?.length || 0);
    console.log(
      "Full data:",
      JSON.stringify(profileData, null, 2).substring(0, 1000),
    );

    console.log("===========================");

    // // ✅ ADD THIS VALIDATION

    if (
      !profileData.name ||
      (!profileData.aboutMe &&
        !profileData.headline &&
        !profileData.treatmentApproach &&
        profileData.specialties.length === 0)
    ) {
      throw new ApiError(
        "Unable to extract sufficient profile data. The profile may be incomplete, private, or blocked by Psychology Today.",
        400,
        "INSUFFICIENT_DATA",
      );
    }
    // if (
    //   !profileData.aboutMe &&
    //   !profileData.headline &&
    //   profileData.specialties.length === 0
    // ) {
    //   throw new ApiError(
    //     "Unable to extract sufficient profile data. The profile may be incomplete, private, or blocked by Psychology Today.",
    //     400,
    //     "INSUFFICIENT_DATA",
    //   );
    // }

    // Step 2: Generate audit using Claude
    const auditData = await generateAudit(profileData);
    console.log("✅ Claude API succeeded");

    try {
      const auditData = await generateAudit(profileData);
      console.log("✅ Claude API succeeded");
    } catch (error) {
      console.error("❌ Claude API failed:", error.message);
      console.error("Full error:", error);
      throw error;
    }

    // Step 3: Save audit to database
    const savedAudit = await saveAudit({
      profileUrl,
      userEmail,
      auditData,
    });
    // Step 4: Send email with audit results
    // Step 4: Send email with audit results
    try {
      console.log("📧 Attempting to send email to:", userEmail);
      console.log("📧 Audit ID:", savedAudit.id);
      console.log("📧 Has auditData?:", !!auditData);
      console.log("📧 Has overallScore?:", !!auditData?.overallScore);

      const { sendAuditEmail } = await import("./utils/email.js");
      const emailResult = await sendAuditEmail(
        userEmail,
        auditData,
        savedAudit.id,
      );

      if (emailResult?.success) {
        console.log(
          "✅ Email sent successfully! Message ID:",
          emailResult.messageId,
        );
      } else {
        console.error("❌ Email sending failed:", emailResult?.error);
      }
    } catch (emailError) {
      console.error("❌ Email exception:", emailError);
      console.error("Error details:", {
        name: emailError.name,
        message: emailError.message,
        stack: emailError.stack?.split("\n").slice(0, 3),
      });
      // Continue even if email fails - don't block the audit
    }
    // Return audit ID
    return res.status(200).json({
      success: true,
      data: {
        auditId: savedAudit.id,
        cached: false,
        remainingAudits: rateLimit?.remaining || 0,
        referralCode: user.referralCode,
      },
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

  try {
    // Launch headless browser (serverless-compatible)
    const isLocal = !process.env.VERCEL;
    if (isLocal) {
      // Local: use regular puppeteer
      browser = await puppeteerRegular.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      // Production: use serverless puppeteer
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }
    // browser = await puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath(),
    //   headless: chromium.headless,
    // });

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );
    // ✅ Better anti-detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3] });
      window.chrome = { runtime: {} };
    });

    // Navigate to profile
    // await page.goto(url, {
    //   waitUntil: "domcontentloaded",
    //   timeout: 60000,
    // });

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for content to load
    // await page.waitForSelector("body", { timeout: 10000 });

    // // Wait longer for JavaScript to fully render
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // // Try waiting for specific content
    // await page.waitForSelector("h1", { timeout: 10000 }).catch(() => {});
    // await page
    //   .waitForSelector("[data-test]", { timeout: 5000 })
    //   .catch(() => {});

    // Log page title for debugging hhh

    await page
      .waitForSelector('h1, [data-test="provider-name"]', { timeout: 8000 })
      .catch(() => {
        console.warn("Main content selector not found, proceeding anyway");
      });
    const pageTitle = await page.title();
    console.log("Page loaded:", pageTitle);

    // Enhanced debugging - see EVERYTHING on the page
    const pageStructure = await page.evaluate(() => {
      return {
        allIds: Array.from(document.querySelectorAll("[id]"))
          .slice(0, 20)
          .map((el) => ({
            id: el.id,
            tag: el.tagName,
            text: el.textContent?.substring(0, 50),
          })),

        allDataTests: Array.from(document.querySelectorAll("[data-test]"))
          .slice(0, 20)
          .map((el) => ({
            attr: el.getAttribute("data-test"),
            tag: el.tagName,
            text: el.textContent?.substring(0, 50),
          })),

        sections: Array.from(document.querySelectorAll("section")).map(
          (el) => ({ class: el.className, id: el.id }),
        ),

        paragraphs: Array.from(document.querySelectorAll("p"))
          .slice(0, 5)
          .map((el) => el.textContent?.substring(0, 100)),
      };
    });

    console.log("=== FULL PAGE STRUCTURE ===");
    console.log(JSON.stringify(pageStructure, null, 2));
    console.log("===========================");

    // Extract profile data
    const profileData = await page.evaluate(() => {
      const getText = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : "";
      };

      const getAll = (selector) => {
        return Array.from(document.querySelectorAll(selector))
          .map((el) => el.textContent.trim())
          .filter((text) => text.length > 0);
      };

      const getAttr = (selector, attr) => {
        const element = document.querySelector(selector);
        return element ? element.getAttribute(attr) : "";
      };

      // Try multiple selectors for each field
      const trySelectors = (selectors) => {
        for (const selector of selectors) {
          const text = getText(selector);
          if (text) return text;
        }
        return "";
      };

      const trySelectorsAll = (selectors) => {
        for (const selector of selectors) {
          const items = getAll(selector);
          if (items.length > 0) return items;
        }
        return [];
      };

      return {
        // Basic Info
        name: trySelectors([
          "h1",
          ".profile-name",
          '[data-test="provider-name"]',
          ".profile-heading h1",
        ]),

        credentials: trySelectors([
          ".profile-subtitle",
          '[data-test="provider-credentials"]',
          ".profile-credentials",
          "h2.profile-subtitle",
        ]),

        location: trySelectors([
          ".profile-location",
          '[data-test="provider-location"]',
          ".location-text",
        ]),

        // Headline - CRITICAL FIELD
        headline: trySelectors([
          '[data-test="provider-statement"]',
          ".statement-text",
          ".profile-statement",
          'h2[class*="statement"]',
          ".profile-tagline",
        ]),

        // About Me - MOST CRITICAL FIELD
        aboutMe: trySelectors([
          '[data-test="about-me-text"]',
          '[data-test="provider-bio"]',
          "#about-me-text",
          ".about-me-text",
          '[id*="bio"]',
          '[class*="bio-text"]',
          'section[class*="about"] p',
          ".profile-about",
        ]),

        // Photo
        photoUrl:
          getAttr('[data-test="provider-image"]', "src") ||
          getAttr(".profile-photo img", "src") ||
          getAttr('img[alt*="photo"]', "src"),

        // Specialties - CRITICAL FOR VALIDATION
        specialties: trySelectorsAll([
          '[data-test="specialty-item"]',
          '.attributes-list[data-test*="specialt"] li',
          ".profile-specialties li",
          'ul[class*="specialt"] li',
        ]),

        // Issues Treated
        issues: trySelectorsAll([
          '[data-test="issue-item"]',
          '.attributes-list[data-test*="issue"] li',
          ".profile-issues li",
          'ul[class*="issue"] li',
        ]),

        // Treatment Approach
        treatmentApproach: trySelectors([
          '[data-test="treatment-orientation"]',
          ".treatment-orientation",
          'div[class*="treatment"]',
        ]),

        treatmentMethods: trySelectorsAll([
          '[data-test="modality-item"]',
          '.attributes-list[data-test*="modalit"] li',
          ".profile-modalities li",
        ]),

        // Client Focus
        clientFocus: trySelectorsAll([
          '[data-test="client-focus-item"]',
          '.attributes-list[data-test*="demographic"] li',
          ".client-focus li",
        ]),

        ageGroups: trySelectorsAll([
          '[data-test="age-group-item"]',
          '.attributes-list[data-test*="age"] li',
          ".age-groups li",
        ]),

        // Session Info
        sessionType: trySelectorsAll([
          '[data-test="session-format-item"]',
          '.attributes-list[data-test*="session"] li',
          ".session-types li",
        ]),

        sessionFee: trySelectors([
          '[data-test="session-fee"]',
          ".session-fee",
          'div[class*="fee"]',
        ]),

        insurance: trySelectorsAll([
          '[data-test="insurance-item"]',
          '.attributes-list[data-test*="insurance"] li',
          ".insurance-list li",
        ]),

        // Experience
        yearsExperience: trySelectors([
          '[data-test="years-in-practice"]',
          ".years-practice",
          'div[class*="experience"]',
        ]),

        // License
        licenseNumber: trySelectors([
          '[data-test="license-number"]',
          ".license-info",
          'div[class*="license"]',
        ]),

        // Education
        education: trySelectorsAll([
          '[data-test="education-item"]',
          ".education-list li",
          'ul[class*="education"] li',
        ]),

        // Languages
        languages: trySelectorsAll([
          '[data-test="language-item"]',
          ".languages-list li",
          'ul[class*="language"] li',
        ]),

        website:
          getAttr('[data-test="website"]', "href") ||
          getAttr(".profile-website a", "href"),

        // Meta
        profileUrl: window.location.href,
        scrapedAt: new Date().toISOString(),
      };
    });

    // // Extract profile data
    // const profileData = await page.evaluate(() => {
    //   const getText = (selector) => {
    //     const element = document.querySelector(selector);
    //     return element ? element.textContent.trim() : "";
    //   };

    //   const getAll = (selector) => {
    //     return Array.from(document.querySelectorAll(selector))
    //       .map((el) => el.textContent.trim())
    //       .filter((text) => text.length > 0);
    //   };

    //   const getAttr = (selector, attr) => {
    //     const element = document.querySelector(selector);
    //     return element ? element.getAttribute(attr) : "";
    //   };

    //   // Try multiple selectors for each field (Psychology Today may update their HTML)
    //   const trySelectors = (selectors) => {
    //     for (const selector of selectors) {
    //       const text = getText(selector);
    //       if (text) return text;
    //     }
    //     return "";
    //   };

    //   const trySelectorsAll = (selectors) => {
    //     for (const selector of selectors) {
    //       const items = getAll(selector);
    //       if (items.length > 0) return items;
    //     }
    //     return [];
    //   };

    //   return {
    //     // Basic Info
    //     name: trySelectors([
    //       '[data-test-id="therapist-name"]',
    //       ".profile-name",
    //       "h1.profile-title",
    //       "h1",
    //     ]),

    //     credentials: trySelectors([
    //       '[data-test-id="credentials"]',
    //       ".profile-credentials",
    //       ".credentials",
    //     ]),

    //     location: trySelectors([
    //       '[data-test-id="location"]',
    //       ".profile-location",
    //       ".location",
    //     ]),

    //     // Headline
    //     headline: trySelectors([
    //       '[data-test-id="profile-statement"]',
    //       ".profile-statement",
    //       ".profile-tagline",
    //       "h2.statement",
    //     ]),

    //     // About Me
    //     aboutMe: trySelectors([
    //       '[data-test-id="about-me"]',
    //       "#profile-bio",
    //       ".profile-about",
    //       ".about-me",
    //     ]),

    //     // Photo
    //     photoUrl:
    //       getAttr('[data-test-id="profile-photo"]', "src") ||
    //       getAttr(".profile-photo img", "src") ||
    //       getAttr(".therapist-photo img", "src"),

    //     // Specialties
    //     specialties: trySelectorsAll([
    //       '[data-test-id="specialty-item"]',
    //       ".profile-specialties li",
    //       ".specialties-list li",
    //     ]),

    //     // Issues Treated
    //     issues: trySelectorsAll([
    //       '[data-test-id="issue-item"]',
    //       ".profile-issues li",
    //       ".issues-list li",
    //     ]),

    //     // Treatment Approach
    //     treatmentApproach: trySelectors([
    //       '[data-test-id="treatment-approach"]',
    //       ".profile-treatment",
    //       ".treatment-approach",
    //     ]),

    //     treatmentMethods: trySelectorsAll([
    //       '[data-test-id="modality-item"]',
    //       ".profile-modalities li",
    //       ".modalities-list li",
    //     ]),

    //     // Client Focus
    //     clientFocus: trySelectorsAll([
    //       '[data-test-id="demographic-item"]',
    //       ".profile-demographics li",
    //       ".client-focus li",
    //     ]),

    //     ageGroups: trySelectorsAll([
    //       '[data-test-id="age-group-item"]',
    //       ".profile-age-groups li",
    //       ".age-groups li",
    //     ]),

    //     // Session Info
    //     sessionType: trySelectorsAll([
    //       '[data-test-id="session-type"]',
    //       ".profile-session-types li",
    //       ".session-types li",
    //     ]),

    //     sessionFee: trySelectors([
    //       '[data-test-id="session-fee"]',
    //       ".profile-fee",
    //       ".session-fee",
    //     ]),

    //     insurance: trySelectorsAll([
    //       '[data-test-id="insurance-item"]',
    //       ".profile-insurance li",
    //       ".insurance-list li",
    //     ]),

    //     // Years of Experience
    //     yearsExperience: trySelectors([
    //       '[data-test-id="years-experience"]',
    //       ".profile-years-practice",
    //       ".years-experience",
    //     ]),

    //     // License Info
    //     licenseNumber: trySelectors([
    //       '[data-test-id="license"]',
    //       ".profile-license",
    //       ".license-info",
    //     ]),

    //     // Education
    //     education: trySelectorsAll([
    //       '[data-test-id="education-item"]',
    //       ".profile-education li",
    //       ".education-list li",
    //     ]),

    //     // Additional Info
    //     languages: trySelectorsAll([
    //       '[data-test-id="language-item"]',
    //       ".profile-languages li",
    //       ".languages-list li",
    //     ]),

    //     website:
    //       getAttr('a[data-test-id="website"]', "href") ||
    //       getAttr(".profile-website a", "href"),

    //     // Meta
    //     profileUrl: window.location.href,
    //     scrapedAt: new Date().toISOString(),
    //   };
    // });

    await browser.close();

    // Validate that we got meaningful data
    if (!profileData.name && !profileData.aboutMe && !profileData.headline) {
      throw new ApiError(
        "Failed to extract profile data. The profile may be private, deleted, or the page structure has changed.",
        500,
        "SCRAPING_FAILED",
      );
    }

    return profileData;
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
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
