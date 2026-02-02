/**
 * Email Utilities using Resend
 * Modern, reliable email delivery
 */
import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send audit results email
 * @param {string} recipientEmail - User's email
 * @param {Object} auditData - The audit results
 * @param {string} auditId - The audit ID for viewing online
 * @returns {Promise<Object>}
 */
export async function sendAuditEmail(recipientEmail, auditData, auditId) {
  try {
    console.log("📧 Email Service - Starting");
    console.log("📧 Recipient:", recipientEmail);
    console.log("📧 Audit ID:", auditId);
    console.log("📧 API Key exists:", !!process.env.RESEND_API_KEY);
    console.log(
      "📧 API Key preview:",
      process.env.RESEND_API_KEY?.substring(0, 10) + "...",
    );

    // Validate inputs
    if (!recipientEmail || !auditData || !auditData.overallScore) {
      console.error("❌ Invalid email parameters:", {
        hasRecipient: !!recipientEmail,
        hasAuditData: !!auditData,
        hasScore: !!auditData?.overallScore,
      });
      return { success: false, error: "Invalid parameters" };
    }

    // Validate API key
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not set in environment variables");
      return { success: false, error: "Email service not configured" };
    }

    console.log("📧 Generating email HTML...");
    const emailHtml = generateAuditEmailHtml(auditData, auditId);
    console.log("📧 HTML generated, length:", emailHtml.length);

    console.log("📧 Calling Resend API...");
    const { data, error } = await resend.emails.send({
      from: "PT Profile Audit <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Your Psychology Today Profile Audit Results - Score: ${auditData.overallScore}/100`,
      html: emailHtml,
    });

    if (error) {
      console.error("❌ Resend API error:", error);
      return { success: false, error: error.message || JSON.stringify(error) };
    }

    console.log("✅ Email sent successfully!");
    console.log("✅ Message ID:", data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("❌ Email exception caught:", error);
    console.error("❌ Error type:", error.constructor.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack?.split("\n").slice(0, 3));
    return { success: false, error: error.message };
  }
}

/**
 * Generate HTML email template
 */
function generateAuditEmailHtml(auditData, auditId) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const resultsUrl = `${baseUrl}/results?id=${auditId}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Profile Audit Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px;" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🎯 Your Profile Audit Results</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Psychology Today Profile Analysis</p>
            </td>
          </tr>

          <!-- Overall Score -->
          <tr>
            <td style="background: #ffffff; padding: 40px 30px; text-align: center;">
              <div style="background-color: ${getScoreColor(auditData.overallScore)}; color: white; width: 120px; height: 120px; border-radius: 60px; margin: 0 auto; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="text-align: center;">
                  <div style="font-size: 48px; font-weight: 700; line-height: 1;">${auditData.overallScore}</div>
                  <div style="font-size: 14px; opacity: 0.9;">/100</div>
                </div>
              </div>
              <h2 style="color: #1f2937; margin: 24px 0 10px 0; font-size: 24px; font-weight: 700;">${auditData.performanceLevel}</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">${auditData.executiveSummary?.currentState || "Your profile has been analyzed"}</p>
            </td>
          </tr>

          <!-- Key Findings -->
          <tr>
            <td style="background: #ffffff; padding: 0 30px 30px 30px;">
              <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">🔍 Key Findings</h3>
              <ul style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.8;">
                ${(auditData.executiveSummary?.keyFindings || []).map((finding) => `<li style="margin-bottom: 8px;">${finding}</li>`).join("")}
              </ul>
              <div style="margin-top: 20px; padding: 16px; background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 4px;">
                <p style="color: #065f46; margin: 0; font-weight: 600;">💰 ${auditData.executiveSummary?.potentialImpact || "Significant improvement potential"}</p>
              </div>
            </td>
          </tr>

          <!-- Top 3 Critical Issues -->
          <tr>
            <td style="background: #fef2f2; padding: 30px;">
              <h3 style="color: #991b1b; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">⚠️ Top 3 Critical Issues</h3>
              ${(auditData.criticalIssues || [])
                .slice(0, 3)
                .map(
                  (issue, index) => `
                <div style="margin-bottom: 16px; padding: 16px; background-color: #ffffff; border-left: 4px solid ${getSeverityColor(issue.severity)}; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 700;">${index + 1}. ${issue.title}</h4>
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;"><strong style="color: #374151;">Impact:</strong> ${issue.impact}</p>
                  <p style="margin: 0; color: #059669; font-size: 14px; line-height: 1.6;"><strong style="color: #047857;">Fix:</strong> ${issue.recommendation}</p>
                </div>
              `,
                )
                .join("")}
            </td>
          </tr>

          <!-- Revenue Opportunity -->
          <tr>
            <td style="background: #ecfdf5; padding: 30px; border-top: 3px solid #10b981;">
              <h3 style="color: #065f46; margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">💰 Revenue Opportunity</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px; background: #ffffff; border-radius: 6px; margin-bottom: 8px; width: 48%;">
                    <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600;">MONTHLY POTENTIAL</p>
                    <p style="margin: 0; color: #047857; font-size: 20px; font-weight: 700;">${auditData.revenueOpportunity?.monthlyRevenuePotential || "See full report"}</p>
                  </td>
                  <td style="width: 4%;"></td>
                  <td style="padding: 12px; background: #ffffff; border-radius: 6px; width: 48%;">
                    <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600;">ANNUAL POTENTIAL</p>
                    <p style="margin: 0; color: #047857; font-size: 20px; font-weight: 700;">${auditData.revenueOpportunity?.annualRevenuePotential || "See full report"}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="background: #ffffff; padding: 40px 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <a href="${resultsUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: 700; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">View Full Audit Report</a>
              <p style="color: #6b7280; margin: 16px 0 0 0; font-size: 14px;">Click above to see your complete analysis with actionable recommendations</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} PT Profile Audit. This audit was generated on ${new Date().toLocaleDateString()}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Helper functions
function getScoreColor(score) {
  if (score >= 90) return "#10b981";
  if (score >= 75) return "#3b82f6";
  if (score >= 60) return "#f59e0b";
  if (score >= 45) return "#f97316";
  return "#ef4444";
}

function getSeverityColor(severity) {
  switch (severity) {
    case "Critical":
      return "#dc2626";
    case "High":
      return "#f97316";
    case "Medium":
      return "#f59e0b";
    default:
      return "#6b7280";
  }
}
