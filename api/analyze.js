/**
 * API Endpoint: Analyze Profile and Generate Audit
 * URL: /api/analyze
 * Method: POST
 * Body: { profileData: Object, userEmail: string, profileUrl: string }
 */

import { generateAudit } from './utils/claude.js';
import { saveAudit, getAuditByUrl } from './utils/kv.js';
import { ApiError, ErrorTypes, handleError, validateRequired, isValidEmail, logRequest } from './utils/errors.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { profileData, userEmail, profileUrl } = req.body;

    // Log request
    logRequest('analyze', { userEmail, profileUrl });

    // Validate required fields
    validateRequired(req.body, ['profileData', 'userEmail', 'profileUrl']);

    // Validate email format
    if (!isValidEmail(userEmail)) {
      throw new ApiError(
        ErrorTypes.INVALID_EMAIL.message,
        ErrorTypes.INVALID_EMAIL.statusCode,
        ErrorTypes.INVALID_EMAIL.code
      );
    }

    // Check if this URL was already audited in the last 30 days
    const existingAuditId = await getAuditByUrl(profileUrl);
    if (existingAuditId) {
      const existingAudit = await getAudit(existingAuditId);
      if (existingAudit) {
        return res.status(200).json({
          success: true,
          data: {
            auditId: existingAudit.id,
            cached: true,
            message: 'This profile was recently audited. Returning cached results.'
          }
        });
      }
    }

    // Generate audit using Claude API
    const auditData = await generateAudit(profileData);

    // Save audit to database
    const savedAudit = await saveAudit({
      profileUrl,
      userEmail,
      auditData
    });

    return res.status(200).json({
      success: true,
      data: {
        auditId: savedAudit.id,
        cached: false
      }
    });

  } catch (error) {
    return handleError(res, error);
  }
}