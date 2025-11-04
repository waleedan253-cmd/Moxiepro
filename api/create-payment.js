/**
 * API Endpoint: Create Payment Checkout
 * URL: /api/create-payment
 * Method: POST
 * Body: { auditId: string, userEmail: string }
 *
 * Creates a Lemon Squeezy checkout session for purchasing the full PDF audit
 */

import axios from 'axios';
import { getAudit } from './utils/kv.js';
import { ApiError, ErrorTypes, handleError, validateRequired, logRequest } from './utils/errors.js';

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
const LEMON_SQUEEZY_PRODUCT_ID = process.env.LEMON_SQUEEZY_PRODUCT_ID;
const APP_URL = process.env.VITE_APP_URL || 'http://localhost:5173';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { auditId, userEmail, referralCredits = 0 } = req.body;

    // Log request
    logRequest('create-payment', { auditId, userEmail, referralCredits });

    // Validate required fields
    validateRequired(req.body, ['auditId', 'userEmail']);

    // Get audit to verify it exists
    const audit = await getAudit(auditId);
    if (!audit) {
      throw new ApiError(
        ErrorTypes.AUDIT_NOT_FOUND.message,
        ErrorTypes.AUDIT_NOT_FOUND.statusCode,
        ErrorTypes.AUDIT_NOT_FOUND.code
      );
    }

    // Check if already paid
    if (audit.isPaid) {
      return res.status(200).json({
        success: true,
        message: 'This audit has already been paid for',
        pdfUrl: audit.pdfUrl
      });
    }

    // Calculate price with referral credits
    const basePrice = 1499; // $14.99 in cents
    const creditDiscount = Math.min(referralCredits * 100, basePrice); // Credits in cents, max = full price
    const finalPrice = Math.max(basePrice - creditDiscount, 0);

    // Create Lemon Squeezy checkout
    const checkoutUrl = await createLemonSqueezyCheckout({
      productId: LEMON_SQUEEZY_PRODUCT_ID,
      userEmail,
      auditId,
      price: finalPrice,
      discountAmount: creditDiscount
    });

    return res.status(200).json({
      success: true,
      checkoutUrl,
      finalPrice: finalPrice / 100,
      discount: creditDiscount / 100
    });

  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * Create a Lemon Squeezy checkout session
 * @param {Object} params - Checkout parameters
 * @returns {Promise<string>} Checkout URL
 */
async function createLemonSqueezyCheckout({ productId, userEmail, auditId, price, discountAmount }) {
  try {
    const response = await axios.post(
      'https://api.lemonsqueezy.com/v1/checkouts',
      {
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: {
                audit_id: auditId
              }
            },
            product_options: {
              name: 'Psychology Today Profile Audit - Full PDF',
              description: 'Comprehensive PDF audit with all 11 sections including competitor analysis, revenue projections, and implementation roadmap.',
              redirect_url: `${APP_URL}/results/${auditId}?payment=success`
            },
            checkout_options: {
              button_color: '#10b981'
            },
            expires_at: null,
            preview: process.env.NODE_ENV === 'development'
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMON_SQUEEZY_STORE_ID
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: productId
              }
            }
          }
        }
      },
      {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
        }
      }
    );

    const checkoutUrl = response.data.data.attributes.url;
    return checkoutUrl;

  } catch (error) {
    console.error('Lemon Squeezy API error:', error.response?.data || error.message);
    throw new ApiError(
      ErrorTypes.PAYMENT_FAILED.message,
      ErrorTypes.PAYMENT_FAILED.statusCode,
      ErrorTypes.PAYMENT_FAILED.code
    );
  }
}

/**
 * Apply referral credits to a checkout
 * This reduces the price based on available credits
 * @param {number} basePrice - Base price in cents
 * @param {number} availableCredits - Available credits in dollars
 * @returns {Object} Price breakdown
 */
function applyReferralCredits(basePrice, availableCredits) {
  const creditValue = availableCredits * 100; // Convert to cents
  const discount = Math.min(creditValue, basePrice); // Can't discount more than price
  const finalPrice = Math.max(basePrice - discount, 0); // Can't go below $0

  return {
    basePrice: basePrice / 100,
    discountAmount: discount / 100,
    finalPrice: finalPrice / 100,
    creditsUsed: discount / 100,
    creditsRemaining: availableCredits - (discount / 100)
  };
}
