/**
 * Upstash Redis Database Utilities
 * Handles all database operations for audits, users, and caching
 */
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Wrapper to maintain KV-like interface
const kv = {
  get: async (key) => {
    try {
      const value = await redis.get(key);
      return value; // Upstash auto-parses JSON
    } catch (error) {
      console.error(`KV GET Error for key ${key}:`, error);
      return null;
    }
  },
  set: async (key, value, options) => {
    try {
      if (options?.ex) {
        return await redis.set(key, value, { ex: options.ex });
      }
      return await redis.set(key, value);
    } catch (error) {
      console.error(`KV SET Error for key ${key}:`, error);
      throw error;
    }
  },
};

// ============================================
// AUDIT OPERATIONS
// ============================================

/**
 * Save a new audit to the database
 * @param {Object} auditData - The audit data to save
 * @returns {Promise<Object>} The saved audit with ID
 */
export async function saveAudit(auditData) {
  const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60; // in seconds for ex option

  const audit = {
    id: auditId,
    profileUrl: auditData.profileUrl,
    userEmail: auditData.userEmail,
    isPaid: false,
    auditData: auditData.auditData,
    createdAt: now,
    expiresAt: now + thirtyDays * 1000,
    pdfGeneratedAt: null,
    pdfUrl: null,
    pdfExpiresAt: null,
  };

  // Save audit with 30-day expiration
  await kv.set(auditId, audit, { ex: thirtyDays });

  // Cache by URL (prevents duplicate audits for same profile)
  const urlKey = `url:${normalizeUrl(auditData.profileUrl)}`;
  await kv.set(urlKey, auditId, { ex: thirtyDays });

  // Add to user's audit list
  await addAuditToUser(auditData.userEmail, auditId);

  return audit;
}

/**
 * Get an audit by ID
 * @param {string} auditId - The audit ID
 * @returns {Promise<Object|null>} The audit object or null
 */
export async function getAudit(auditId) {
  const audit = await kv.get(auditId);
  return audit;
}

/**
 * Update an existing audit
 * @param {string} auditId - The audit ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated audit
 */
export async function updateAudit(auditId, updates) {
  const audit = await getAudit(auditId);
  if (!audit) {
    throw new Error("Audit not found");
  }

  const updatedAudit = { ...audit, ...updates };

  // Calculate remaining TTL in seconds
  const remainingTtl = Math.floor((audit.expiresAt - Date.now()) / 1000);
  if (remainingTtl > 0) {
    await kv.set(auditId, updatedAudit, { ex: remainingTtl });
  }

  return updatedAudit;
}

/**
 * Check if a URL has been audited recently (within 30 days)
 * @param {string} profileUrl - The Psychology Today profile URL
 * @returns {Promise<string|null>} The audit ID if exists, null otherwise
 */
export async function getAuditByUrl(profileUrl) {
  const urlKey = `url:${normalizeUrl(profileUrl)}`;
  const auditId = await kv.get(urlKey);
  return auditId;
}

/**
 * Mark an audit as paid and generate PDF
 * @param {string} auditId - The audit ID
 * @param {string} pdfUrl - The URL to the generated PDF
 * @returns {Promise<Object>} The updated audit
 */
export async function markAuditAsPaid(auditId, pdfUrl) {
  const now = Date.now();
  const sixtyDays = 60 * 24 * 60 * 60 * 1000;

  return await updateAudit(auditId, {
    isPaid: true,
    pdfGeneratedAt: now,
    pdfUrl: pdfUrl,
    pdfExpiresAt: now + sixtyDays,
  });
}

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Get or create a user by email
 * @param {string} email - The user's email
 * @returns {Promise<Object>} The user object
 */
export async function getOrCreateUser(email) {
  const userKey = `user:${email.toLowerCase()}`;
  let user = await kv.get(userKey);

  if (!user) {
    user = {
      email: email.toLowerCase(),
      audits: [],
      referralCode: generateReferralCode(email),
      referralCredits: 0,
      referralCount: 0,
      referredBy: null,
      createdAt: Date.now(),
    };
    await kv.set(userKey, user);

    // Also index by referral code for lookups
    const codeKey = `referral:${user.referralCode}`;
    await kv.set(codeKey, user.email);
  }

  return user;
}

/**
 * Update user data
 * @param {string} email - The user's email
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated user
 */
export async function updateUser(email, updates) {
  const userKey = `user:${email.toLowerCase()}`;
  const user = await kv.get(userKey);

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = { ...user, ...updates };
  await kv.set(userKey, updatedUser);

  return updatedUser;
}

/**
 * Add an audit to a user's audit list
 * @param {string} email - The user's email
 * @param {string} auditId - The audit ID to add
 */
async function addAuditToUser(email, auditId) {
  const user = await getOrCreateUser(email);
  if (!user.audits.includes(auditId)) {
    user.audits.push(auditId);
    await updateUser(email, { audits: user.audits });
  }
}

/**
 * Get user by referral code
 * @param {string} referralCode - The referral code
 * @returns {Promise<Object|null>} The user object or null
 */
export async function getUserByReferralCode(referralCode) {
  const codeKey = `referral:${referralCode.toUpperCase()}`;
  const email = await kv.get(codeKey);

  if (!email) return null;

  return await getOrCreateUser(email);
}

/**
 * Increment referral count and credits for a user
 * @param {string} email - The referrer's email
 * @param {number} creditAmount - The credit amount to add
 */
export async function incrementReferral(email, creditAmount) {
  const user = await getOrCreateUser(email);
  const newCount = user.referralCount + 1;
  const newCredits = user.referralCredits + creditAmount;

  await updateUser(email, {
    referralCount: newCount,
    referralCredits: newCredits,
  });
}

// ============================================
// RATE LIMITING
// ============================================

/**
 * Check and update rate limit for an IP address
 * @param {string} ipAddress - The user's IP address
 * @returns {Promise<Object>} { allowed: boolean, remaining: number }
 */
export async function checkRateLimit(ipAddress) {
  const rateLimitKey = `ratelimit:${ipAddress}`;
  const MAX_AUDITS_PER_DAY = 3;

  const countValue = await kv.get(rateLimitKey);
  const count = countValue
    ? typeof countValue === "number"
      ? countValue
      : parseInt(countValue)
    : 0;

  if (count >= MAX_AUDITS_PER_DAY) {
    return { allowed: false, remaining: 0 };
  }

  // Increment counter with 24-hour expiration
  const newCount = count + 1;
  await kv.set(rateLimitKey, newCount, { ex: 24 * 60 * 60 });

  return { allowed: true, remaining: MAX_AUDITS_PER_DAY - newCount };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Normalize a Psychology Today URL for consistent caching
 * @param {string} url - The profile URL
 * @returns {string} Normalized URL
 */
function normalizeUrl(url) {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")
    .split("?")[0];
}

/**
 * Generate a unique referral code from email
 * @param {string} email - The user's email
 * @returns {string} Referral code (e.g., "WALEEDANCODING-X7K")
 */
function generateReferralCode(email) {
  const name = email
    .split("@")[0]
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `${name}-${random}`;
}

/**
 * Get referral credit amount based on tier
 * @param {number} referralCount - Current referral count
 * @returns {number} Credit amount in dollars
 */
export function getReferralCreditAmount(referralCount) {
  if (referralCount < 5) return 3;
  if (referralCount < 15) return 5;
  return 8;
}
