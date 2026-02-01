/**
 * API Endpoint: Lemon Squeezy Webhook Handler
 * URL: /api/webhook
 * Method: POST
 *
 * Handles payment confirmations from Lemon Squeezy
 * Triggers PDF generation and email sending
 */

import crypto from "crypto";
import { getAudit, markAuditAsPaid } from "./utils/kv.js";
import {
  ApiError,
  ErrorTypes,
  handleError,
  logRequest,
} from "./utils/errors.js";

const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get signature from headers
    const signature = req.headers["x-signature"];
    if (!signature) {
      throw new ApiError(
        "Missing webhook signature",
        ErrorTypes.WEBHOOK_VERIFICATION_FAILED.statusCode,
        ErrorTypes.WEBHOOK_VERIFICATION_FAILED.code,
      );
    }

    // Verify webhook signature
    const rawBody = JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      throw new ApiError(
        ErrorTypes.WEBHOOK_VERIFICATION_FAILED.message,
        ErrorTypes.WEBHOOK_VERIFICATION_FAILED.statusCode,
        ErrorTypes.WEBHOOK_VERIFICATION_FAILED.code,
      );
    }

    const event = req.body;
    const eventType = event.meta?.event_name;

    logRequest("webhook", { eventType, orderId: event.data?.id });

    // Handle different event types
    switch (eventType) {
      case "order_created":
      case "subscription_payment_success":
        await handlePaymentSuccess(event);
        break;

      case "subscription_payment_failed":
        await handlePaymentFailed(event);
        break;

      default:
        console.log("Unhandled webhook event:", eventType);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * Verify Lemon Squeezy webhook signature
 * @param {string} rawBody - Raw request body
 * @param {string} signature - Signature from header
 * @returns {boolean} True if valid
 */
function verifyWebhookSignature(rawBody, signature) {
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Handle successful payment
 * @param {Object} event - Webhook event data
 */
async function handlePaymentSuccess(event) {
  const orderData = event.data.attributes;
  const customData = orderData.first_order_item?.product_custom_data || {};
  const auditId = customData.audit_id;
  const userEmail = orderData.user_email;

  if (!auditId) {
    console.error("No audit ID in webhook data");
    return;
  }

  logRequest("payment-success", { auditId, userEmail });

  // Get the audit
  const audit = await getAudit(auditId);
  if (!audit) {
    console.error("Audit not found for payment:", auditId);
    return;
  }

  // Generate PDF
  const pdfUrl = await generatePDF(audit);

  // Mark audit as paid and save PDF URL
  await markAuditAsPaid(auditId, pdfUrl);

  // Send confirmation email with PDF
  await sendPaymentConfirmationEmail({
    email: userEmail,
    auditId,
    pdfUrl,
    audit,
  });

  logRequest("payment-processed", { auditId, pdfGenerated: true });
}

/**
 * Handle failed payment
 * @param {Object} event - Webhook event data
 */
async function handlePaymentFailed(event) {
  const orderData = event.data.attributes;
  const userEmail = orderData.user_email;
  [];
  logRequest("payment-failed", { userEmail });

  // Send payment failed email
  await sendPaymentFailedEmail(userEmail);
}

/**
 * Generate PDF for audit
 * @param {Object} audit - The audit data
 * @returns {Promise<string>} PDF URL
 */
async function generatePDF(audit) {
  try {
    // Call PDF generation endpoint
    const response = await fetch(`${process.env.VITE_API_URL}/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auditId: audit.id }),
    });

    const data = await response.json();
    return data.pdfUrl;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF");
  }
}

/**
 * Send payment confirmation email
 * @param {Object} params - Email parameters
 */
async function sendPaymentConfirmationEmail({ email, auditId, pdfUrl, audit }) {
  try {
    await fetch(`${process.env.VITE_API_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        template: "payment-confirmation",
        data: {
          auditId,
          pdfUrl,
          score: audit.auditData.overallScore,
          performanceLevel: audit.auditData.performanceLevel,
        },
      }),
    });

    console.log("Payment confirmation email sent:", email);
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
  }
}

/**
 * Send payment failed email
 * @param {string} email - User email
 */
async function sendPaymentFailedEmail(email) {
  try {
    await fetch(`${process.env.VITE_API_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        template: "payment-failed",
        data: {},
      }),
    });

    console.log("Payment failed email sent:", email);
  } catch (error) {
    console.error("Failed to send payment failed email:", error);
  }
}
