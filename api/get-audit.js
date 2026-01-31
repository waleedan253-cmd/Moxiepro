/**
 * API Endpoint: Get Audit by ID
 * URL: /api/get-audit?id={auditId}
 * Method: GET
 */

import { getAudit } from "./utils/db.js";
import {
  ApiError,
  ErrorTypes,
  handleError,
  logRequest,
} from "./utils/errors.js";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    // Log request
    logRequest("get-audit", { auditId: id });

    // Validate audit ID
    if (!id) {
      throw new ApiError(
        "Audit ID is required",
        ErrorTypes.MISSING_PARAMETER.statusCode,
        ErrorTypes.MISSING_PARAMETER.code,
      );
    }

    // Get audit from database
    const audit = await getAudit(id);

    if (!audit) {
      throw new ApiError(
        ErrorTypes.AUDIT_NOT_FOUND.message,
        ErrorTypes.AUDIT_NOT_FOUND.statusCode,
        ErrorTypes.AUDIT_NOT_FOUND.code,
      );
    }

    // Check if audit has expired
    if (Date.now() > audit.expiresAt) {
      throw new ApiError(
        ErrorTypes.AUDIT_EXPIRED.message,
        ErrorTypes.AUDIT_EXPIRED.statusCode,
        ErrorTypes.AUDIT_EXPIRED.code,
      );
    }

    // Check if PDF has expired (if paid)
    if (audit.isPaid && audit.pdfExpiresAt && Date.now() > audit.pdfExpiresAt) {
      // PDF expired, but audit is still valid
      return res.status(200).json({
        success: true,
        data: {
          ...audit,
          pdfExpired: true,
          pdfUrl: null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: audit,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
