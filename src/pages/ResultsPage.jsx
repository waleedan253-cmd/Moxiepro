import { useLocation, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  SCORING_SECTIONS,
  getPerformanceLevel,
  getSectionRating,
} from "../data/scoringSystem";

function ResultsPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const auditId = searchParams.get("id");
  const { profileData } = location.state || {};
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we have an auditId from URL, fetch the audit data from API
    if (auditId) {
      fetchAuditData(auditId);
    }
    // Otherwise, use legacy profileData if available
    else if (profileData) {
      const results = generateSampleAudit(profileData);
      setAuditData(results);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [auditId, profileData]);

  const fetchAuditData = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/get-audit?id=${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch audit");
      }

      if (data.success && data.data) {
        // The API returns the full audit object with auditData nested inside
        setAuditData(data.data.auditData);
      } else {
        throw new Error("Invalid audit data received");
      }
    } catch (err) {
      console.error("Error fetching audit:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Audit
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/audit"
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors inline-block"
          >
            Start New Audit
          </Link>
        </div>
      </div>
    );
  }

  // No data state
  if (!loading && !auditData && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Audit Data
          </h2>
          <p className="text-gray-600 mb-6">
            Please submit a profile to get your audit.
          </p>
          <Link
            to="/audit"
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Start Audit
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your audit results...</p>
        </div>
      </div>
    );
  }

  const performanceLevel = getPerformanceLevel(auditData.overallScore);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MoxiePro Audit Results
          </h1>

          {/* Overall Score */}
          <div className="mt-6 flex items-center gap-8">
            <div>
              <div className="text-6xl font-bold text-primary-600">
                {auditData.overallScore}
                <span className="text-3xl text-gray-400">/100</span>
              </div>
            </div>
            <div>
              <div
                className={`inline-block px-4 py-2 rounded-full text-lg font-semibold bg-${performanceLevel.color}-100 text-${performanceLevel.color}-800`}
              >
                {performanceLevel.rating}
              </div>
              <p className="text-gray-600 mt-2">
                {performanceLevel.description}
              </p>
            </div>
          </div>

          {/* Executive Summary */}
          {auditData.executiveSummary && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Current State
              </h3>
              <p className="text-gray-700">
                {auditData.executiveSummary.currentState}
              </p>

              {auditData.executiveSummary.keyFindings && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Key Findings:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {auditData.executiveSummary.keyFindings.map(
                      (finding, idx) => (
                        <li key={idx} className="text-gray-700">
                          {finding}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Scores */}
        {auditData.sectionScores && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Section-by-Section Breakdown
            </h2>
            <div className="space-y-4">
              {Object.entries(auditData.sectionScores).map(
                ([key, sectionData]) => {
                  const section = SCORING_SECTIONS[key];
                  if (!section) return null;

                  const score = sectionData.score || sectionData;
                  const percentage = (score / section.maxPoints) * 100;
                  const rating = getSectionRating(key, score);

                  return (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {section.name}
                        </h3>
                        <span className="text-xl font-bold text-primary-600">
                          {score}/{section.maxPoints}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {rating && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{rating.rating}:</span>{" "}
                          {rating.description}
                        </p>
                      )}
                      {sectionData.issues && sectionData.issues.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                          {sectionData.issues.map((issue, idx) => (
                            <li key={idx}>• {issue}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}

        {/* Critical Issues */}
        {auditData.criticalIssues && auditData.criticalIssues.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Critical Issues
            </h2>
            <div className="space-y-6">
              {auditData.criticalIssues.map((issue, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Issue #{index + 1}: {issue.title}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Problem:</span>{" "}
                    {issue.problem}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Impact:</span> {issue.impact}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Opportunity:</span>{" "}
                    {issue.opportunity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Wins */}
        {auditData.quickWins && auditData.quickWins.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Wins (Easy Fixes)
            </h2>
            <div className="space-y-4">
              {auditData.quickWins.map((win, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {win.title}
                  </h3>
                  <p className="text-blue-800 mb-2">{win.action}</p>
                  {win.expectedImpact && (
                    <p className="text-sm text-blue-600">
                      <span className="font-medium">Impact:</span>{" "}
                      {win.expectedImpact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Opportunity */}
        {auditData.revenueOpportunity && (
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-green-900 mb-4">
              Revenue Opportunity
            </h2>
            <p className="text-lg text-green-800 mb-2">
              {auditData.revenueOpportunity.summary}
            </p>
            {auditData.revenueOpportunity.monthlyPotential && (
              <p className="text-2xl font-bold text-green-900">
                Estimated Monthly Increase:{" "}
                {auditData.revenueOpportunity.monthlyPotential}
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary-600 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Optimize Your Profile?
          </h2>
          <p className="text-lg mb-6 text-primary-100">
            Get a complete optimization package with copy-paste ready content
          </p>
          <Link
            to="/"
            className="bg-white text-primary-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Learn About Full Optimization
          </Link>
        </div>
      </div>
    </div>
  );
}

// Temporary function to generate sample audit results (kept for legacy support)
function generateSampleAudit(profileData) {
  const headlineScore = analyzeHeadline(profileData.headline);
  const aboutScore = analyzeAboutSection(profileData.aboutSection);
  const specialtyScore = analyzeSpecialties(profileData.specialties);

  const sectionScores = {
    HEADLINE: headlineScore,
    ABOUT_SECTION: aboutScore,
    SPECIALIZATION: specialtyScore,
    VISUAL_PRESENTATION: 10,
    PRICING_STRATEGY: profileData.pricing ? 12 : 8,
    CONVERSION_OPTIMIZATION: 7,
  };

  const overallScore = Object.values(sectionScores).reduce(
    (sum, score) => sum + score,
    0,
  );

  return {
    overallScore,
    sectionScores,
    topIssues: [
      {
        title: "Headline lacks specialization",
        problem:
          "Your headline only includes credentials without specialty or location",
        impact:
          "Missing 40-50% of potential clients searching for specific services",
        opportunity:
          "Adding location and specialty could increase profile views by 60%",
      },
    ],
    strengths: [
      "Professional credentials clearly stated",
      "Complete contact information provided",
    ],
    quickWins: [
      {
        title: "Add location to headline",
        action: `Include "${profileData.location}" in your headline for local SEO`,
        expectedImpact: "5 minutes",
      },
    ],
  };
}

function analyzeHeadline(headline) {
  let score = 0;
  if (headline.match(/\b[A-Z][a-z]+,?\s+[A-Z]{2}\b/)) score += 5;
  if (headline.length > 20 && !headline.match(/^[\w\s]+,\s+[A-Z]+$/))
    score += 5;
  if (headline.match(/\b(LCSW|PhD|LMFT|PsyD|MA|MS|LPC)\b/)) score += 5;
  return Math.min(score, 12);
}

function analyzeAboutSection(about) {
  const youCount = (about.match(/\b(you|your)\b/gi) || []).length;
  const iCount = (about.match(/\b(I|my|me)\b/gi) || []).length;
  const wordCount = about.split(/\s+/).length;

  let score = 0;
  if (youCount > iCount) score += 6;
  else if (youCount > 0) score += 3;

  if (wordCount >= 300 && wordCount <= 500) score += 4;
  else if (wordCount >= 200) score += 2;

  score += 8;

  return Math.min(score, 20);
}

function analyzeSpecialties(specialties) {
  const count = specialties.split("\n").filter((s) => s.trim()).length;

  if (count >= 3 && count <= 7) return 12;
  if (count >= 8 && count <= 10) return 9;
  if (count >= 11 && count <= 15) return 6;
  return 3;
}

export default ResultsPage;
// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";

// function ResultsPage() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const auditId = searchParams.get("id");

//   const [audit, setAudit] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [expandedSection, setExpandedSection] = useState(null);

//   useEffect(() => {
//     if (!auditId) {
//       navigate("/");
//       return;
//     }

//     fetchAudit();
//   }, [auditId]);

//   const fetchAudit = async () => {
//     try {
//       const response = await fetch(`/api/get-audit?id=${auditId}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to load audit");
//       }

//       setAudit(data.data.auditData);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching audit:", err);
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading your audit results...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Error Loading Audit
//           </h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => navigate("/")}
//             className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
//           >
//             Go Back Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!audit) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
//           <div className="text-center">
//             <div
//               className={`inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full text-white text-4xl sm:text-5xl font-bold mb-4 ${getScoreColorClass(audit.overallScore)}`}
//             >
//               {audit.overallScore}
//               <span className="text-xl sm:text-2xl ml-1">/100</span>
//             </div>
//             <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
//               {audit.performanceLevel}
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               {audit.executiveSummary.currentState}
//             </p>
//           </div>
//         </div>

//         {/* Executive Summary */}
//         <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
//             <span className="mr-2">🔍</span> Key Findings
//           </h2>
//           <ul className="space-y-3">
//             {audit.executiveSummary.keyFindings.map((finding, index) => (
//               <li key={index} className="flex items-start">
//                 <span className="text-green-500 mr-3 mt-1 flex-shrink-0">
//                   ✓
//                 </span>
//                 <span className="text-gray-700">{finding}</span>
//               </li>
//             ))}
//           </ul>
//           <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
//             <p className="text-green-800 font-medium">
//               💰 {audit.executiveSummary.potentialImpact}
//             </p>
//           </div>
//         </div>

//         {/* Critical Issues */}
//         <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
//             <span className="mr-2">⚠️</span> Critical Issues
//           </h2>
//           <div className="space-y-4">
//             {audit.criticalIssues.map((issue, index) => (
//               <div
//                 key={index}
//                 className={`border-l-4 ${getSeverityBorderClass(issue.severity)} bg-gray-50 p-4 sm:p-6 rounded-r-lg hover:shadow-md transition-shadow`}
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
//                   <h3 className="text-lg font-bold text-gray-900 mb-2 sm:mb-0">
//                     {index + 1}. {issue.title}
//                   </h3>
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadgeClass(issue.severity)} self-start sm:self-auto`}
//                   >
//                     {issue.severity}
//                   </span>
//                 </div>
//                 <p className="text-gray-700 mb-3">
//                   <strong className="text-gray-900">Impact:</strong>{" "}
//                   {issue.impact}
//                 </p>
//                 <p className="text-gray-700 mb-3">
//                   <strong className="text-gray-900">Current:</strong>{" "}
//                   {issue.currentExample}
//                 </p>
//                 <p className="text-green-700">
//                   <strong className="text-green-900">Fix:</strong>{" "}
//                   {issue.recommendation}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Section Scores */}
//         <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//             <span className="mr-2">📊</span> Section Breakdown
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {Object.entries(audit.sectionScores).map(([section, data]) => (
//               <div
//                 key={section}
//                 className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200"
//                 onClick={() =>
//                   setExpandedSection(
//                     expandedSection === section ? null : section,
//                   )
//                 }
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="font-semibold text-gray-900 capitalize text-sm sm:text-base">
//                     {section.replace(/([A-Z])/g, " $1").trim()}
//                   </h3>
//                   <span
//                     className={`text-2xl font-bold ${getScoreTextColorClass(data.score)}`}
//                   >
//                     {data.score}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span
//                     className={`text-xs font-semibold px-2 py-1 rounded ${getStatusBadgeClass(data.status)}`}
//                   >
//                     {data.status}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     Priority: {data.priority}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Wins */}
//         <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
//             <span className="mr-2">⚡</span> Quick Wins
//           </h2>
//           <div className="space-y-4">
//             {audit.quickWins.map((win, index) => (
//               <div
//                 key={index}
//                 className="bg-blue-50 p-4 sm:p-5 rounded-lg border-l-4 border-blue-500"
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
//                   <h3 className="font-bold text-gray-900 mb-2 sm:mb-0">
//                     {win.action}
//                   </h3>
//                   <div className="flex gap-2 flex-wrap">
//                     <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
//                       ⏱️ {win.timeRequired}
//                     </span>
//                     <span
//                       className={`text-xs px-2 py-1 rounded ${getImpactBadgeClass(win.expectedImpact)}`}
//                     >
//                       Impact: {win.expectedImpact}
//                     </span>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 text-sm">{win.instructions}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Revenue Opportunity */}
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 sm:p-8 mb-6 border border-green-200">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
//             <span className="mr-2">💰</span> Revenue Opportunity
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <div className="bg-white p-4 rounded-lg shadow">
//               <p className="text-sm text-gray-600 mb-1">Current Estimate</p>
//               <p className="text-xl font-bold text-gray-900">
//                 {audit.revenueOpportunity.currentEstimate}
//               </p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <p className="text-sm text-gray-600 mb-1">Optimized Estimate</p>
//               <p className="text-xl font-bold text-green-600">
//                 {audit.revenueOpportunity.optimizedEstimate}
//               </p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <p className="text-sm text-gray-600 mb-1">Monthly Potential</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {audit.revenueOpportunity.monthlyRevenuePotential}
//               </p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <p className="text-sm text-gray-600 mb-1">Annual Potential</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {audit.revenueOpportunity.annualRevenuePotential}
//               </p>
//             </div>
//           </div>
//           <p className="text-gray-700 bg-white p-4 rounded-lg">
//             {audit.revenueOpportunity.breakdown}
//           </p>
//         </div>

//         {/* Optimization Preview */}
//         {audit.optimizationPreview && (
//           <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//               <span className="mr-2">✨</span> Optimization Preview
//             </h2>

//             {/* Headline */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                 Headline
//               </h3>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//                   <p className="text-xs font-semibold text-red-600 mb-2">
//                     BEFORE
//                   </p>
//                   <p className="text-gray-700">
//                     {audit.optimizationPreview.headline.before}
//                   </p>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                   <p className="text-xs font-semibold text-green-600 mb-2">
//                     AFTER
//                   </p>
//                   <p className="text-gray-700">
//                     {audit.optimizationPreview.headline.after}
//                   </p>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded">
//                 <strong>Why this works:</strong>{" "}
//                 {audit.optimizationPreview.headline.reasoning}
//               </p>
//             </div>

//             {/* About Me Opening */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                 About Me Opening
//               </h3>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//                   <p className="text-xs font-semibold text-red-600 mb-2">
//                     BEFORE
//                   </p>
//                   <p className="text-gray-700 text-sm">
//                     {audit.optimizationPreview.aboutMeOpening.before}
//                   </p>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                   <p className="text-xs font-semibold text-green-600 mb-2">
//                     AFTER
//                   </p>
//                   <p className="text-gray-700 text-sm">
//                     {audit.optimizationPreview.aboutMeOpening.after}
//                   </p>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded">
//                 <strong>Why this works:</strong>{" "}
//                 {audit.optimizationPreview.aboutMeOpening.reasoning}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Implementation Roadmap */}
//         {audit.implementationRoadmap && (
//           <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//               <span className="mr-2">🗺️</span> 30-Day Implementation Roadmap
//             </h2>
//             <div className="space-y-4">
//               {Object.entries(audit.implementationRoadmap).map(
//                 ([week, data]) => (
//                   <div
//                     key={week}
//                     className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-5 rounded-lg border border-purple-200"
//                   >
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
//                       <h3 className="font-bold text-gray-900 capitalize mb-2 sm:mb-0">
//                         {week.replace(/([A-Z])/g, " $1").trim()}: {data.focus}
//                       </h3>
//                       <span className="text-sm text-purple-600 font-semibold self-start sm:self-auto">
//                         {data.estimatedTime}
//                       </span>
//                     </div>
//                     <ul className="space-y-1 ml-4">
//                       {data.tasks.map((task, idx) => (
//                         <li
//                           key={idx}
//                           className="text-gray-700 text-sm flex items-start"
//                         >
//                           <span className="text-purple-500 mr-2">▸</span>
//                           <span>{task}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ),
//               )}
//             </div>
//           </div>
//         )}

//         {/* CTA Section */}
//         <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
//           <h2 className="text-2xl sm:text-3xl font-bold mb-4">
//             Ready to Transform Your Profile?
//           </h2>
//           <p className="text-lg mb-6 opacity-90">
//             Get our done-for-you optimization service and start attracting more
//             clients
//           </p>
//           <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
//             Get Professional Optimization - $297
//           </button>
//           <p className="text-sm mt-4 opacity-75">
//             Limited spots available • 7-day turnaround guaranteed
//           </p>
//         </div>

//         {/* Print/Export Buttons */}
//         <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
//           <button
//             onClick={() => window.print()}
//             className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
//           >
//             <span className="mr-2">🖨️</span> Print Report
//           </button>
//           <button
//             onClick={() => navigate("/")}
//             className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
//           >
//             Analyze Another Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper functions for styling
// function getScoreColorClass(score) {
//   if (score >= 90) return "bg-green-500";
//   if (score >= 75) return "bg-blue-500";
//   if (score >= 60) return "bg-yellow-500";
//   if (score >= 45) return "bg-orange-500";
//   return "bg-red-500";
// }

// function getScoreTextColorClass(score) {
//   if (score >= 90) return "text-green-600";
//   if (score >= 75) return "text-blue-600";
//   if (score >= 60) return "text-yellow-600";
//   if (score >= 45) return "text-orange-600";
//   return "text-red-600";
// }

// function getSeverityBorderClass(severity) {
//   switch (severity) {
//     case "Critical":
//       return "border-red-500";
//     case "High":
//       return "border-orange-500";
//     case "Medium":
//       return "border-yellow-500";
//     default:
//       return "border-gray-500";
//   }
// }

// function getSeverityBadgeClass(severity) {
//   switch (severity) {
//     case "Critical":
//       return "bg-red-100 text-red-800";
//     case "High":
//       return "bg-orange-100 text-orange-800";
//     case "Medium":
//       return "bg-yellow-100 text-yellow-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// }

// function getStatusBadgeClass(status) {
//   switch (status) {
//     case "Excellent":
//       return "bg-green-100 text-green-800";
//     case "Good":
//       return "bg-blue-100 text-blue-800";
//     case "Needs Work":
//       return "bg-yellow-100 text-yellow-800";
//     case "Critical":
//       return "bg-red-100 text-red-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// }

// function getImpactBadgeClass(impact) {
//   switch (impact) {
//     case "High":
//       return "bg-green-200 text-green-800";
//     case "Medium":
//       return "bg-yellow-200 text-yellow-800";
//     case "Low":
//       return "bg-gray-200 text-gray-800";
//     default:
//       return "bg-gray-200 text-gray-800";
//   }
// }

// export default ResultsPage;
