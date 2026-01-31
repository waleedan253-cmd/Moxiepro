/**
 * API Endpoint: Generate PDF
 * URL: /api/generate-pdf
 * Method: POST
 * Body: { auditId: string }
 *
 * Generates a styled PDF report from audit data and uploads to Vercel Blob
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Link,
  Image,
} from "@react-pdf/renderer";
import { put } from "@vercel/blob";
import { getAudit } from "./utils/db.js";
import {
  ApiError,
  ErrorTypes,
  handleError,
  validateRequired,
  logRequest,
} from "./utils/errors.js";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { auditId } = req.body;

    // Log request
    logRequest("generate-pdf", { auditId });

    // Validate required fields
    validateRequired(req.body, ["auditId"]);

    // Get audit from database
    const audit = await getAudit(auditId);
    if (!audit) {
      throw new ApiError(
        ErrorTypes.AUDIT_NOT_FOUND.message,
        ErrorTypes.AUDIT_NOT_FOUND.statusCode,
        ErrorTypes.AUDIT_NOT_FOUND.code,
      );
    }

    // Generate PDF
    const pdfBuffer = await createPDF(audit);

    // Upload to Vercel Blob
    const filename = `audit-${auditId}-${Date.now()}.pdf`;
    const blob = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    });

    logRequest("pdf-generated", {
      auditId,
      size: pdfBuffer.length,
      url: blob.url,
    });

    return res.status(200).json({
      success: true,
      pdfUrl: blob.url,
      size: pdfBuffer.length,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

/**
 * Create PDF document from audit data
 * @param {Object} audit - The audit data
 * @returns {Promise<Buffer>} PDF buffer
 */
async function createPDF(audit) {
  const { auditData } = audit;

  // Create PDF document
  const doc = (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.coverTitle}>Psychology Today</Text>
          <Text style={styles.coverTitle}>Profile Audit Report</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{auditData.overallScore}</Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
          </View>
          <Text style={styles.performanceLevel}>
            {auditData.performanceLevel}
          </Text>
          <Text style={styles.coverDate}>
            Generated{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.section}>
          <Text style={styles.subheading}>Current State</Text>
          <Text style={styles.paragraph}>
            {auditData.executiveSummary.currentState}
          </Text>

          <Text style={styles.subheading}>Key Findings</Text>
          {auditData.executiveSummary.keyFindings.map((finding, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {finding}
            </Text>
          ))}

          <Text style={styles.subheading}>Potential Impact</Text>
          <Text style={styles.paragraph}>
            {auditData.executiveSummary.potentialImpact}
          </Text>
        </View>
      </Page>

      {/* Critical Issues */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Critical Issues</Text>
        {auditData.criticalIssues.map((issue, index) => (
          <View key={index} style={styles.issueCard}>
            <View style={styles.issueHeader}>
              <Text style={styles.issueTitle}>
                {index + 1}. {issue.title}
              </Text>
              <Text
                style={[styles.severityBadge, getSeverityStyle(issue.severity)]}
              >
                {issue.severity}
              </Text>
            </View>
            <Text style={styles.issueLabel}>Impact:</Text>
            <Text style={styles.issueText}>{issue.impact}</Text>
            <Text style={styles.issueLabel}>Current Example:</Text>
            <Text style={styles.issueExample}>{issue.currentExample}</Text>
            <Text style={styles.issueLabel}>Recommendation:</Text>
            <Text style={styles.issueText}>{issue.recommendation}</Text>
            <Text style={styles.issueLabel}>Expected Outcome:</Text>
            <Text style={styles.issueText}>{issue.expectedOutcome}</Text>
          </View>
        ))}
      </Page>

      {/* Section Scores */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Section-by-Section Scores</Text>
        <View style={styles.section}>
          {Object.entries(auditData.sectionScores).map(([key, section]) => (
            <View key={key} style={styles.scoreRow}>
              <Text style={styles.scoreName}>{formatSectionName(key)}</Text>
              <View style={styles.scoreBar}>
                <View
                  style={[styles.scoreBarFill, { width: `${section.score}%` }]}
                />
                <Text style={styles.scoreBarText}>{section.score}/100</Text>
              </View>
              <Text
                style={[styles.statusBadge, getStatusStyle(section.status)]}
              >
                {section.status}
              </Text>
              <Text style={styles.priorityText}>
                {section.priority} Priority
              </Text>
            </View>
          ))}
        </View>
      </Page>

      {/* Quick Wins */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Quick Wins</Text>
        <Text style={styles.subtitle}>
          Easy improvements you can make today
        </Text>
        {auditData.quickWins.map((win, index) => (
          <View key={index} style={styles.quickWinCard}>
            <View style={styles.quickWinHeader}>
              <Text style={styles.quickWinNumber}>{index + 1}</Text>
              <Text style={styles.quickWinAction}>{win.action}</Text>
            </View>
            <View style={styles.quickWinMeta}>
              <Text style={styles.quickWinTime}>⏱ {win.timeRequired}</Text>
              <Text style={styles.quickWinImpact}>
                Impact: {win.expectedImpact}
              </Text>
            </View>
            <Text style={styles.quickWinInstructions}>{win.instructions}</Text>
          </View>
        ))}
      </Page>

      {/* Revenue Opportunity */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Revenue Opportunity</Text>
        <View style={styles.section}>
          <View style={styles.revenueGrid}>
            <View style={styles.revenueBox}>
              <Text style={styles.revenueLabel}>Current Estimate</Text>
              <Text style={styles.revenueValue}>
                {auditData.revenueOpportunity.currentEstimate}
              </Text>
            </View>
            <View style={styles.revenueBox}>
              <Text style={styles.revenueLabel}>Optimized Estimate</Text>
              <Text style={styles.revenueValue}>
                {auditData.revenueOpportunity.optimizedEstimate}
              </Text>
            </View>
            <View style={styles.revenueBox}>
              <Text style={styles.revenueLabel}>Monthly Potential</Text>
              <Text style={styles.revenueValueHighlight}>
                {auditData.revenueOpportunity.monthlyRevenuePotential}
              </Text>
            </View>
            <View style={styles.revenueBox}>
              <Text style={styles.revenueLabel}>Annual Potential</Text>
              <Text style={styles.revenueValueHighlight}>
                {auditData.revenueOpportunity.annualRevenuePotential}
              </Text>
            </View>
          </View>
          <Text style={styles.paragraph}>
            {auditData.revenueOpportunity.breakdown}
          </Text>
        </View>
      </Page>

      {/* Market Analysis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Market Analysis</Text>
        <View style={styles.section}>
          <View style={styles.marketRow}>
            <Text style={styles.marketLabel}>Location:</Text>
            <Text style={styles.marketValue}>
              {auditData.marketAnalysis.location}
            </Text>
          </View>
          <View style={styles.marketRow}>
            <Text style={styles.marketLabel}>Local Competition:</Text>
            <Text style={styles.marketValue}>
              {auditData.marketAnalysis.localCompetition}
            </Text>
          </View>
          <View style={styles.marketRow}>
            <Text style={styles.marketLabel}>Average Session Rate:</Text>
            <Text style={styles.marketValue}>
              {auditData.marketAnalysis.averageSessionRate}
            </Text>
          </View>

          <Text style={styles.subheading}>Demand Indicators</Text>
          {auditData.marketAnalysis.demandIndicators.map((indicator, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {indicator}
            </Text>
          ))}

          <Text style={styles.subheading}>Opportunities</Text>
          {auditData.marketAnalysis.opportunities.map((opportunity, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {opportunity}
            </Text>
          ))}
        </View>
      </Page>

      {/* Competitor Analysis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Competitor Analysis</Text>
        {auditData.competitorAnalysis.topCompetitors.map(
          (competitor, index) => (
            <View key={index} style={styles.competitorCard}>
              <Text style={styles.competitorTitle}>Competitor {index + 1}</Text>
              <Link src={competitor.profileUrl} style={styles.competitorUrl}>
                {competitor.profileUrl}
              </Link>
              <Text style={styles.competitorSubtitle}>Strengths:</Text>
              {competitor.strengths.map((strength, i) => (
                <Text key={i} style={styles.bulletPoint}>
                  • {strength}
                </Text>
              ))}
              <Text style={styles.competitorSubtitle}>Weaknesses:</Text>
              {competitor.weaknesses.map((weakness, i) => (
                <Text key={i} style={styles.bulletPoint}>
                  • {weakness}
                </Text>
              ))}
              <Text style={styles.competitorSubtitle}>Key Takeaways:</Text>
              <Text style={styles.paragraph}>{competitor.keyTakeaways}</Text>
            </View>
          ),
        )}

        <Text style={styles.subheading}>Your Competitive Advantages</Text>
        {auditData.competitorAnalysis.competitiveAdvantages.map(
          (advantage, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {advantage}
            </Text>
          ),
        )}

        <Text style={styles.subheading}>Gaps to Fill</Text>
        {auditData.competitorAnalysis.gapsToFill.map((gap, index) => (
          <Text key={index} style={styles.bulletPoint}>
            • {gap}
          </Text>
        ))}
      </Page>

      {/* Optimization Preview */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Optimization Preview</Text>

        <View style={styles.section}>
          <Text style={styles.subheading}>Headline Optimization</Text>
          <View style={styles.beforeAfterBox}>
            <Text style={styles.beforeLabel}>BEFORE:</Text>
            <Text style={styles.beforeText}>
              {auditData.optimizationPreview.headline.before}
            </Text>
          </View>
          <View style={styles.beforeAfterBox}>
            <Text style={styles.afterLabel}>AFTER:</Text>
            <Text style={styles.afterText}>
              {auditData.optimizationPreview.headline.after}
            </Text>
          </View>
          <Text style={styles.reasoning}>
            {auditData.optimizationPreview.headline.reasoning}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>About Me Opening</Text>
          <View style={styles.beforeAfterBox}>
            <Text style={styles.beforeLabel}>BEFORE:</Text>
            <Text style={styles.beforeText}>
              {auditData.optimizationPreview.aboutMeOpening.before}
            </Text>
          </View>
          <View style={styles.beforeAfterBox}>
            <Text style={styles.afterLabel}>AFTER:</Text>
            <Text style={styles.afterText}>
              {auditData.optimizationPreview.aboutMeOpening.after}
            </Text>
          </View>
          <Text style={styles.reasoning}>
            {auditData.optimizationPreview.aboutMeOpening.reasoning}
          </Text>
        </View>
      </Page>

      {/* Implementation Roadmap */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>30-Day Implementation Roadmap</Text>
        {Object.entries(auditData.implementationRoadmap).map(([week, data]) => (
          <View key={week} style={styles.roadmapWeek}>
            <Text style={styles.weekTitle}>
              {formatWeekName(week)} - {data.focus}
            </Text>
            <Text style={styles.weekTime}>
              Estimated Time: {data.estimatedTime}
            </Text>
            {data.tasks.map((task, index) => (
              <Text key={index} style={styles.taskItem}>
                □ {task}
              </Text>
            ))}
          </View>
        ))}
      </Page>

      {/* Call to Action */}
      <Page size="A4" style={styles.page}>
        <View style={styles.ctaPage}>
          <Text style={styles.ctaTitle}>Ready to Optimize Your Profile?</Text>
          <Text style={styles.ctaParagraph}>
            This audit shows you exactly what needs to be fixed and how to do
            it. But we understand that implementing these changes takes time you
            might not have.
          </Text>
          <Text style={styles.ctaSubtitle}>
            Done-For-You Optimization Service
          </Text>
          <Text style={styles.ctaParagraph}>
            Let our team of Psychology Today experts handle everything for you:
          </Text>
          <Text style={styles.ctaBullet}>
            ✓ Complete profile rewrite using proven frameworks
          </Text>
          <Text style={styles.ctaBullet}>
            ✓ Professional photo guidance and optimization
          </Text>
          <Text style={styles.ctaBullet}>
            ✓ SEO optimization for maximum visibility
          </Text>
          <Text style={styles.ctaBullet}>
            ✓ Conversion-focused headline and specialties
          </Text>
          <Text style={styles.ctaBullet}>
            ✓ Before/after tracking and analytics
          </Text>
          <Text style={styles.ctaBullet}>✓ 30-day support and revisions</Text>
          <Text style={styles.ctaPrice}>Investment: $297</Text>
          <Text style={styles.ctaGuarantee}>
            30-Day Money-Back Guarantee - No questions asked
          </Text>
          <Link src="https://moxiepro.com/optimize" style={styles.ctaButton}>
            <Text>Get Started Today →</Text>
          </Link>
        </View>
      </Page>
    </Document>
  );

  // Generate PDF buffer
  const pdfBuffer = await pdf(doc).toBuffer();
  return pdfBuffer;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
  },
  coverPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
  },
  scoreLabel: {
    fontSize: 16,
    color: "#ffffff",
  },
  performanceLevel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 20,
  },
  coverDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
    borderBottom: "2pt solid #10b981",
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 10,
    lineHeight: 1.6,
  },
  bulletPoint: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 5,
    marginLeft: 15,
  },
  issueCard: {
    backgroundColor: "#f9fafb",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    border: "1pt solid #e5e7eb",
  },
  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  issueTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  severityBadge: {
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: "bold",
  },
  issueLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6b7280",
    marginTop: 8,
    marginBottom: 3,
  },
  issueText: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 5,
  },
  issueExample: {
    fontSize: 10,
    color: "#6b7280",
    fontStyle: "italic",
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 4,
    marginBottom: 5,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  scoreName: {
    fontSize: 11,
    color: "#374151",
    width: 120,
  },
  scoreBar: {
    flex: 1,
    height: 24,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    position: "relative",
  },
  scoreBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  scoreBarText: {
    position: "absolute",
    top: 5,
    right: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  statusBadge: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 9,
    color: "#6b7280",
    width: 70,
  },
  quickWinCard: {
    backgroundColor: "#f0fdf4",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1pt solid #86efac",
  },
  quickWinHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quickWinNumber: {
    width: 24,
    height: 24,
    backgroundColor: "#10b981",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  quickWinAction: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#065f46",
    flex: 1,
  },
  quickWinMeta: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 8,
  },
  quickWinTime: {
    fontSize: 9,
    color: "#047857",
  },
  quickWinImpact: {
    fontSize: 9,
    color: "#047857",
  },
  quickWinInstructions: {
    fontSize: 10,
    color: "#065f46",
    lineHeight: 1.5,
  },
  revenueGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  revenueBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 8,
    border: "1pt solid #e5e7eb",
  },
  revenueLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 5,
  },
  revenueValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  revenueValueHighlight: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
  marketRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  marketLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6b7280",
    width: 150,
  },
  marketValue: {
    fontSize: 11,
    color: "#374151",
    flex: 1,
  },
  competitorCard: {
    backgroundColor: "#f9fafb",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    border: "1pt solid #e5e7eb",
  },
  competitorTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  competitorUrl: {
    fontSize: 9,
    color: "#10b981",
    marginBottom: 10,
  },
  competitorSubtitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 8,
    marginBottom: 5,
  },
  beforeAfterBox: {
    backgroundColor: "#f9fafb",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    border: "1pt solid #e5e7eb",
  },
  beforeLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ef4444",
    marginBottom: 5,
  },
  beforeText: {
    fontSize: 10,
    color: "#6b7280",
    fontStyle: "italic",
  },
  afterLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 5,
  },
  afterText: {
    fontSize: 10,
    color: "#065f46",
  },
  reasoning: {
    fontSize: 10,
    color: "#4b5563",
    marginTop: 8,
    fontStyle: "italic",
  },
  roadmapWeek: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "1pt solid #e5e7eb",
  },
  weekTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 3,
  },
  weekTime: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 8,
  },
  taskItem: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 5,
    marginLeft: 10,
  },
  ctaPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f9fafb",
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  ctaParagraph: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 15,
    textAlign: "center",
    maxWidth: 400,
  },
  ctaBullet: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 8,
  },
  ctaPrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 20,
    marginBottom: 10,
  },
  ctaGuarantee: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 20,
    fontStyle: "italic",
  },
  ctaButton: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    textDecoration: "none",
  },
});

// Helper functions
function getSeverityStyle(severity) {
  const styles = {
    Critical: { backgroundColor: "#fee2e2", color: "#991b1b" },
    High: { backgroundColor: "#fef3c7", color: "#92400e" },
    Medium: { backgroundColor: "#dbeafe", color: "#1e40af" },
  };
  return styles[severity] || styles.Medium;
}

function getStatusStyle(status) {
  const styles = {
    Excellent: { backgroundColor: "#d1fae5", color: "#065f46" },
    Good: { backgroundColor: "#dbeafe", color: "#1e40af" },
    "Needs Work": { backgroundColor: "#fef3c7", color: "#92400e" },
    Critical: { backgroundColor: "#fee2e2", color: "#991b1b" },
  };
  return styles[status] || styles["Needs Work"];
}

function formatSectionName(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatWeekName(week) {
  return week.replace(/week(\d)/, "Week $1");
}
