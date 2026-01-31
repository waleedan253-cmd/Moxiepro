/**
 * Claude API Utilities
 * Handles AI audit generation with prompt caching
 */

import Anthropic from "@anthropic-ai/sdk";
import { ApiError, ErrorTypes } from "./errors.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate audit using Claude API with prompt caching
 * @param {Object} profileData - The scraped profile data
 * @returns {Promise<Object>} The audit results
 */

// export async function generateAudit(profileData) {
//   try {
//     if (!process.env.ANTHROPIC_API_KEY) {
//       throw new ApiError(
//         "Anthropic API key is missing",
//         500,
//         "ANTHROPIC_KEY_MISSING",
//       );
//     }

//     const response = await client.messages.create({
//       model: "claude-sonnet-4-5-20250929", // SAFE + STABLE
//       max_tokens: 1200,
//       temperature: 0.7,
//       messages: [
//         {
//           role: "user",
//           content: `
// You are an expert profile auditor.

// Analyze the following therapist profile data and generate a detailed audit.

// PROFILE DATA:
// ${JSON.stringify(profileData, null, 2)}
//           `,
//         },
//       ],
//     });

//     if (!response?.content?.[0]?.text) {
//       throw new ApiError(
//         "Claude returned empty response",
//         500,
//         "CLAUDE_EMPTY_RESPONSE",
//       );
//     }

//     return response.content[0].text;
//   } catch (error) {
//     // 🔥 THIS IS THE FIX
//     console.error("🔥 Claude API Error:", {
//       message: error.message,
//       status: error.status,
//       code: error.code,
//       response: error.response?.data,
//     });

//     if (error instanceof ApiError) {
//       throw error;
//     }

//     throw new ApiError(
//       "Failed to generate audit using AI",
//       500,
//       "CLAUDE_GENERATION_FAILED",
//     );
//   }
// }

export async function generateAudit(profileData) {
  try {
    // Load the audit framework template (from F4 file)
    const auditFramework = getAuditFramework();

    const message = await client.messages.create({
      // model: "claude-haiku-4-5-20251001", ver slow response
      model: "claude-sonnet-4-20250514",

      max_tokens: 8192,
      temperature: 0.3,
      system: [
        {
          type: "text",
          text: "You are a JSON-only API that audits Psychology Today profiles. You MUST return ONLY valid JSON. No explanations. No markdown. No code blocks. Start with { and end with }.",
          cache_control: { type: "ephemeral" },
        },
        {
          type: "text",
          text: auditFramework,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Analyze this Psychology Today therapist profile and generate a comprehensive audit following the exact framework provided in the system prompt.

**Profile Data:**
${JSON.stringify(profileData, null, 2)}

Generate the audit in JSON format with this exact structure:
{
  "overallScore": <number 0-100>,
  "performanceLevel": "<Excellent|Above Average|Average|Below Average|Poor>",
  "executiveSummary": {
    "currentState": "<2-3 sentences>",
    "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"],
    "potentialImpact": "<1-2 sentences about revenue opportunity>"
  },
  "criticalIssues": [
    {
      "title": "<issue title>",
      "severity": "<Critical|High|Medium>",
      "impact": "<description>",
      "currentExample": "<what they have now>",
      "recommendation": "<what to do>",
      "expectedOutcome": "<results>"
    }
  ],
  "sectionScores": {
    "headline": {"score": <0-100>, "status": "<Excellent|Good|Needs Work|Critical>", "priority": "<High|Medium|Low>"},
    "aboutMe": {"score": <0-100>, "status": "<status>", "priority": "<priority>"},
    "specialties": {"score": <0-100>, "status": "<status>", "priority": "<priority>"},
    "clientFocus": {"score": <0-100>, "status": "<status>", "priority": "<priority>"},
    "treatmentApproach": {"score": <0-100>, "status": "<status>", "priority": "<priority>"},
    "credentials": {"score": <0-100>, "status": "<status>", "priority": "<priority>"},
    "photo": {"score": <0-100>, "status": "<status>", "priority": "<priority>"}
  },
  "quickWins": [
    {
      "action": "<specific action>",
      "timeRequired": "<5 min|15 min|30 min|1 hour>",
      "expectedImpact": "<High|Medium|Low>",
      "instructions": "<step-by-step>"
    }
  ],
  "revenueOpportunity": {
    "currentEstimate": "<e.g., 2-4 inquiries/month>",
    "optimizedEstimate": "<e.g., 8-12 inquiries/month>",
    "monthlyRevenuePotential": "<e.g., $4,800-7,200>",
    "annualRevenuePotential": "<e.g., $57,600-86,400>",
    "breakdown": "<explanation>"
  },
  "marketAnalysis": {
    "location": "<city, state>",
    "localCompetition": "<Low|Medium|High>",
    "averageSessionRate": "<$XXX-$XXX>",
    "demandIndicators": ["<indicator 1>", "<indicator 2>"],
    "opportunities": ["<opportunity 1>", "<opportunity 2>"]
  },
  "competitorAnalysis": {
    "topCompetitors": [
      {
        "profileUrl": "<URL>",
        "strengths": ["<strength 1>", "<strength 2>"],
        "weaknesses": ["<weakness 1>", "<weakness 2>"],
        "keyTakeaways": "<what to learn from them>"
      }
    ],
    "competitiveAdvantages": ["<advantage 1>", "<advantage 2>"],
    "gapsToFill": ["<gap 1>", "<gap 2>"]
  },
  "optimizationPreview": {
    "headline": {
      "before": "<current headline>",
      "after": "<optimized headline>",
      "reasoning": "<why this works>"
    },
    "aboutMeOpening": {
      "before": "<current first paragraph>",
      "after": "<optimized first paragraph>",
      "reasoning": "<why this works>"
    }
  },
  "implementationRoadmap": {
    "week1": {
      "focus": "<focus area>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"],
      "estimatedTime": "<X hours>"
    },
    "week2": {
      "focus": "<focus area>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"],
      "estimatedTime": "<X hours>"
    },
    "week3": {
      "focus": "<focus area>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"],
      "estimatedTime": "<X hours>"
    },
    "week4": {
      "focus": "<focus area>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"],
      "estimatedTime": "<X hours>"
    }
  }
}

IMPORTANT: Return ONLY valid JSON. Ensure all strings are properly escaped:
- Use double quotes for strings
- Escape special characters (quotes, newlines, etc.)
- No trailing commas
- No comments
- Return the raw JSON without markdown code blocks`,
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.content[0].text;
    const auditData = parseAuditResponse(responseText);
    console.log("✅ Claude API succeeded");

    // 🔥 DEBUG: Check auditData structure
    console.log("=== AUDIT DATA STRUCTURE ===");
    console.log("Type:", typeof auditData);
    console.log("Keys:", Object.keys(auditData || {}));
    console.log("Has overallScore?:", !!auditData?.overallScore);
    console.log("overallScore value:", auditData?.overallScore);
    console.log("Sample data:", JSON.stringify(auditData).substring(0, 500));
    console.log("===========================");

    return auditData;
  } catch (error) {
    console.error("Claude API error:", error);
    throw new ApiError(
      ErrorTypes.CLAUDE_API_ERROR.message,
      ErrorTypes.CLAUDE_API_ERROR.statusCode,
      ErrorTypes.CLAUDE_API_ERROR.code,
    );
  }
}

/**
 * Parse Claude's response and extract JSON
 * @param {string} responseText - The raw response text
 * @returns {Object} Parsed audit data
 */
function parseAuditResponse(responseText) {
  try {
    // Remove markdown code blocks if present (```json ... ```)
    let cleanedText = responseText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Find the first { and last }
    const firstBrace = cleanedText.indexOf("{");
    const lastBrace = cleanedText.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      console.error("No JSON braces found in response");
      throw new Error("No JSON found in response");
    }

    let jsonStr = cleanedText.substring(firstBrace, lastBrace + 1);

    // Clean up common JSON issues (but be careful with string content)
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas

    const auditData = JSON.parse(jsonStr);

    // Validate required fields
    if (!auditData.overallScore || !auditData.performanceLevel) {
      console.error("Missing required fields in audit data");
      throw new Error("Invalid audit data structure");
    }

    return auditData;
  } catch (error) {
    console.error("Failed to parse audit response:", error);
    console.error("Response preview:", responseText.substring(0, 500));
    throw new ApiError("Failed to parse audit results", 500, "PARSE_ERROR");
  }
}

/**
 * Get the audit framework template
 * This should match the content from the F4 file
 * @returns {string} The audit framework
 */
function getAuditFramework() {
  return `# Psychology Today Profile Audit Framework

You are analyzing Psychology Today therapist profiles to help them optimize for maximum client conversion. Your audit must be:
- **Data-driven**: Base all recommendations on the actual profile content
- **Specific**: Provide concrete examples and actionable steps
- **Revenue-focused**: Quantify the business impact
- **Empathetic**: Remember you're helping therapists grow their practice

## Audit Structure (11 Sections)

### 1. Executive Summary
- Overall score (0-100) based on profile effectiveness
- Performance level: Excellent (90-100), Above Average (75-89), Average (60-74), Below Average (45-59), Poor (0-44)
- 2-3 sentence summary of current state
- 3 key findings
- Potential impact statement

### 2. Critical Issues (Top 5)
Identify the 5 most important problems hurting conversion:
- **Title**: Clear, specific issue name
- **Severity**: Critical/High/Medium
- **Impact**: How this hurts their practice
- **Current Example**: What they have now
- **Recommendation**: Specific fix
- **Expected Outcome**: What improvement to expect

### 3. Section-by-Section Scores
Score each section 0-100 with status and priority:
- **Headline** (Critical - first impression)
- **About Me** (Critical - main content)
- **Specialties** (High - searchability)
- **Client Focus** (High - targeting)
- **Treatment Approach** (Medium - credibility)
- **Credentials** (Medium - trust)
- **Photo** (High - personal connection)

### 4. Quick Wins (5-7 items)
Easy improvements they can make today:
- Action item (specific)
- Time required (5 min, 15 min, 30 min, 1 hour)
- Expected impact (High/Medium/Low)
- Step-by-step instructions

### 5. Revenue Opportunity Analysis
Quantify the business impact:
- Current estimated inquiries/month
- Optimized estimated inquiries/month
- Monthly revenue potential
- Annual revenue potential
- Breakdown explaining the math

### 6. Market Analysis
Local market context:
- Location and competition level
- Average session rates in their area
- Demand indicators (population, demographics)
- Opportunities based on market gaps

### 7. Competitor Analysis
Analyze top 2-3 local competitors:
- Their profile URLs
- What they do well
- Their weaknesses
- Key takeaways
- Competitive advantages to emphasize
- Gaps in the market to fill

### 8. Optimization Preview
Show before/after for 2 key sections:
- **Headline**: Current vs. optimized with reasoning
- **About Me Opening**: Current first paragraph vs. optimized with reasoning

### 9. Implementation Roadmap (30 Days)
Week-by-week action plan:
- **Week 1**: Quick wins and headline optimization
- **Week 2**: About Me section rewrite
- **Week 3**: Specialties, client focus, treatment approach
- **Week 4**: Photo, credentials, final polish

### 10. Before/After Comparison
Side-by-side comparison showing:
- Current profile state
- Optimized profile state
- Expected results

### 11. Next Steps
Clear call-to-action:
- Summary of what they learned
- Immediate action items
- Offer for $297 done-for-you optimization service

## Scoring Criteria

**Overall Score Calculation:**
- Headline: 20%
- About Me: 30%
- Specialties: 15%
- Client Focus: 10%
- Treatment Approach: 10%
- Credentials: 5%
- Photo: 10%

**Performance Levels:**
- **Excellent (90-100)**: Profile is highly optimized, minor tweaks only
- **Above Average (75-89)**: Strong profile, some improvements possible
- **Average (60-74)**: Decent profile, significant improvement potential
- **Below Average (45-59)**: Weak profile, major issues to fix
- **Poor (0-44)**: Critical problems, complete overhaul needed

## Important Guidelines

1. **Be Specific**: Don't say "improve your headline" - show exactly what to write
2. **Use Data**: Reference specific parts of their profile
3. **Quantify Impact**: Use numbers for revenue projections
4. **Stay Professional**: Constructive, not harsh
5. **Focus on ROI**: Always tie recommendations to business growth
6. **Be Actionable**: Every recommendation should have clear next steps

Remember: Your goal is to help therapists understand exactly what's wrong, why it matters, and how to fix it - while demonstrating enough value that they want the $297 done-for-you service.`;
}

/**
 * Estimate tokens for cost tracking
 * @param {string} text - The text to estimate
 * @returns {number} Estimated token count
 */
export function estimateTokens(text) {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Calculate cost for an audit
 * @param {number} inputTokens - Input tokens used
 * @param {number} outputTokens - Output tokens used
 * @param {number} cacheReadTokens - Cached tokens read
 * @returns {Object} Cost breakdown
 */
export function calculateCost(inputTokens, outputTokens, cacheReadTokens = 0) {
  // Claude 3.5 Sonnet pricing (as of Oct 2024)
  const INPUT_PRICE = 3.0 / 1_000_000; // $3 per million tokens
  const OUTPUT_PRICE = 15.0 / 1_000_000; // $15 per million tokens
  const CACHE_READ_PRICE = 0.3 / 1_000_000; // $0.30 per million cached tokens

  const inputCost = inputTokens * INPUT_PRICE;
  const outputCost = outputTokens * OUTPUT_PRICE;
  const cacheCost = cacheReadTokens * CACHE_READ_PRICE;

  return {
    inputCost,
    outputCost,
    cacheCost,
    totalCost: inputCost + outputCost + cacheCost,
    breakdown: {
      inputTokens,
      outputTokens,
      cacheReadTokens,
      totalTokens: inputTokens + outputTokens,
    },
  };
}
