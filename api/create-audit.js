/**
 * API Endpoint: Create Full Audit (Scrape + Analyze)
 * URL: /api/create-audit
 * Method: POST
 * Body: { profileUrl: string, userEmail: string, referralCode?: string }
 *
 * This is the main endpoint the frontend will call to generate an audit.
 * It handles rate limiting, URL caching, scraping, and analysis.
 */

import puppeteer from 'puppeteer';
import { generateAudit } from './utils/claude.js';
import {
  saveAudit,
  getAuditByUrl,
  getAudit,
  checkRateLimit,
  getOrCreateUser,
  getUserByReferralCode,
  incrementReferral,
  getReferralCreditAmount
} from './utils/kv.js';
import {
  ApiError,
  ErrorTypes,
  handleError,
  validateRequired,
  isValidEmail,
  isValidPsychologyTodayUrl,
  getClientIp,
  logRequest
} from './utils/errors.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { profileUrl, userEmail, referralCode } = req.body;

    // Log request
    logRequest('create-audit', { userEmail, profileUrl, hasReferralCode: !!referralCode });

    // Validate required fields
    validateRequired(req.body, ['profileUrl', 'userEmail']);

    // Validate email format
    if (!isValidEmail(userEmail)) {
      throw new ApiError(
        ErrorTypes.INVALID_EMAIL.message,
        ErrorTypes.INVALID_EMAIL.statusCode,
        ErrorTypes.INVALID_EMAIL.code
      );
    }

    // Validate URL format
    if (!isValidPsychologyTodayUrl(profileUrl)) {
      throw new ApiError(
        ErrorTypes.INVALID_URL.message,
        ErrorTypes.INVALID_URL.statusCode,
        ErrorTypes.INVALID_URL.code
      );
    }

    // Check rate limit (3 audits per IP per day)
    const clientIp = getClientIp(req);
    const rateLimit = await checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      throw new ApiError(
        ErrorTypes.RATE_LIMIT_EXCEEDED.message,
        ErrorTypes.RATE_LIMIT_EXCEEDED.statusCode,
        ErrorTypes.RATE_LIMIT_EXCEEDED.code
      );
    }

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
            message: 'This profile was recently audited. Returning cached results.',
            remainingAudits: rateLimit.remaining
          }
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

        logRequest('referral-credited', {
          referrer: referrer.email,
          newUser: userEmail,
          creditAmount
        });
      }
    }

    // Step 1: Scrape the profile
    const profileData = await scrapeProfile(profileUrl);

    // Step 2: Generate audit using Claude
    const auditData = await generateAudit(profileData);

    // Step 3: Save audit to database
    const savedAudit = await saveAudit({
      profileUrl,
      userEmail,
      auditData
    });

    // Return audit ID
    return res.status(200).json({
      success: true,
      data: {
        auditId: savedAudit.id,
        cached: false,
        remainingAudits: rateLimit.remaining,
        referralCode: user.referralCode
      }
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
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Navigate to profile
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for content to load
    await page.waitForSelector('body', { timeout: 10000 });

    // Extract profile data
    const profileData = await page.evaluate(() => {
      const getText = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : '';
      };

      const getAll = (selector) => {
        return Array.from(document.querySelectorAll(selector))
          .map(el => el.textContent.trim())
          .filter(text => text.length > 0);
      };

      const getAttr = (selector, attr) => {
        const element = document.querySelector(selector);
        return element ? element.getAttribute(attr) : '';
      };

      // Try multiple selectors for each field (Psychology Today may update their HTML)
      const trySelectors = (selectors) => {
        for (const selector of selectors) {
          const text = getText(selector);
          if (text) return text;
        }
        return '';
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
          '[data-test-id="therapist-name"]',
          '.profile-name',
          'h1.profile-title',
          'h1'
        ]),

        credentials: trySelectors([
          '[data-test-id="credentials"]',
          '.profile-credentials',
          '.credentials'
        ]),

        location: trySelectors([
          '[data-test-id="location"]',
          '.profile-location',
          '.location'
        ]),

        // Headline
        headline: trySelectors([
          '[data-test-id="profile-statement"]',
          '.profile-statement',
          '.profile-tagline',
          'h2.statement'
        ]),

        // About Me
        aboutMe: trySelectors([
          '[data-test-id="about-me"]',
          '#profile-bio',
          '.profile-about',
          '.about-me'
        ]),

        // Photo
        photoUrl: getAttr('[data-test-id="profile-photo"]', 'src') ||
                  getAttr('.profile-photo img', 'src') ||
                  getAttr('.therapist-photo img', 'src'),

        // Specialties
        specialties: trySelectorsAll([
          '[data-test-id="specialty-item"]',
          '.profile-specialties li',
          '.specialties-list li'
        ]),

        // Issues Treated
        issues: trySelectorsAll([
          '[data-test-id="issue-item"]',
          '.profile-issues li',
          '.issues-list li'
        ]),

        // Treatment Approach
        treatmentApproach: trySelectors([
          '[data-test-id="treatment-approach"]',
          '.profile-treatment',
          '.treatment-approach'
        ]),

        treatmentMethods: trySelectorsAll([
          '[data-test-id="modality-item"]',
          '.profile-modalities li',
          '.modalities-list li'
        ]),

        // Client Focus
        clientFocus: trySelectorsAll([
          '[data-test-id="demographic-item"]',
          '.profile-demographics li',
          '.client-focus li'
        ]),

        ageGroups: trySelectorsAll([
          '[data-test-id="age-group-item"]',
          '.profile-age-groups li',
          '.age-groups li'
        ]),

        // Session Info
        sessionType: trySelectorsAll([
          '[data-test-id="session-type"]',
          '.profile-session-types li',
          '.session-types li'
        ]),

        sessionFee: trySelectors([
          '[data-test-id="session-fee"]',
          '.profile-fee',
          '.session-fee'
        ]),

        insurance: trySelectorsAll([
          '[data-test-id="insurance-item"]',
          '.profile-insurance li',
          '.insurance-list li'
        ]),

        // Years of Experience
        yearsExperience: trySelectors([
          '[data-test-id="years-experience"]',
          '.profile-years-practice',
          '.years-experience'
        ]),

        // License Info
        licenseNumber: trySelectors([
          '[data-test-id="license"]',
          '.profile-license',
          '.license-info'
        ]),

        // Education
        education: trySelectorsAll([
          '[data-test-id="education-item"]',
          '.profile-education li',
          '.education-list li'
        ]),

        // Additional Info
        languages: trySelectorsAll([
          '[data-test-id="language-item"]',
          '.profile-languages li',
          '.languages-list li'
        ]),

        website: getAttr('a[data-test-id="website"]', 'href') ||
                 getAttr('.profile-website a', 'href'),

        // Meta
        profileUrl: window.location.href,
        scrapedAt: new Date().toISOString()
      };
    });

    await browser.close();

    // Validate that we got meaningful data
    if (!profileData.name && !profileData.aboutMe && !profileData.headline) {
      throw new ApiError(
        'Failed to extract profile data. The profile may be private, deleted, or the page structure has changed.',
        500,
        'SCRAPING_FAILED'
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

    console.error('Scraping error:', error);
    throw new ApiError(
      ErrorTypes.SCRAPING_FAILED.message,
      ErrorTypes.SCRAPING_FAILED.statusCode,
      ErrorTypes.SCRAPING_FAILED.code
    );
  }
}
