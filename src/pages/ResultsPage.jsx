import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SCORING_SECTIONS, getPerformanceLevel, getSectionRating } from '../data/scoringSystem'

function ResultsPage() {
  const location = useLocation()
  const { profileData } = location.state || {}
  const [auditResults, setAuditResults] = useState(null)

  useEffect(() => {
    if (profileData) {
      // TODO: Replace with actual AI analysis
      // For now, generate sample results based on basic analysis
      const results = generateSampleAudit(profileData)
      setAuditResults(results)
    }
  }, [profileData])

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Profile Data</h2>
          <p className="text-gray-600 mb-6">Please submit a profile to get your audit.</p>
          <Link
            to="/audit"
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Start Audit
          </Link>
        </div>
      </div>
    )
  }

  if (!auditResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Analyzing your profile...</p>
        </div>
      </div>
    )
  }

  const performanceLevel = getPerformanceLevel(auditResults.overallScore)

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profileData.name} - MoxiePro Audit Results
          </h1>
          <p className="text-gray-600">{profileData.location}</p>

          {/* Overall Score */}
          <div className="mt-6 flex items-center gap-8">
            <div>
              <div className="text-6xl font-bold text-primary-600">
                {auditResults.overallScore}
                <span className="text-3xl text-gray-400">/100</span>
              </div>
            </div>
            <div>
              <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold bg-${performanceLevel.color}-100 text-${performanceLevel.color}-800`}>
                {performanceLevel.rating}
              </div>
              <p className="text-gray-600 mt-2">{performanceLevel.description}</p>
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Section-by-Section Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(auditResults.sectionScores).map(([key, score]) => {
              const section = SCORING_SECTIONS[key]
              const rating = getSectionRating(key, score)
              const percentage = (score / section.maxPoints) * 100

              return (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
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
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{rating?.rating}:</span> {rating?.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Issues */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Critical Issues</h2>
          <div className="space-y-6">
            {auditResults.topIssues.map((issue, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Issue #{index + 1}: {issue.title}
                </h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Problem:</span> {issue.problem}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Impact:</span> {issue.impact}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Opportunity:</span> {issue.opportunity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What's Working Well */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Working Well</h2>
          <ul className="space-y-2">
            {auditResults.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Wins */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Wins (Easy Fixes)</h2>
          <div className="space-y-4">
            {auditResults.quickWins.map((win, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{win.title}</h3>
                <p className="text-blue-800 mb-2">{win.description}</p>
                <p className="text-sm text-blue-600">
                  <span className="font-medium">Time:</span> {win.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-600 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your Profile?</h2>
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
  )
}

// Temporary function to generate sample audit results
// TODO: Replace with actual AI analysis
function generateSampleAudit(profileData) {
  // Simple analysis based on profile data
  const headlineScore = analyzeHeadline(profileData.headline)
  const aboutScore = analyzeAboutSection(profileData.aboutSection)
  const specialtyScore = analyzeSpecialties(profileData.specialties)

  const sectionScores = {
    HEADLINE: headlineScore,
    ABOUT_SECTION: aboutScore,
    SPECIALIZATION: specialtyScore,
    VISUAL_PRESENTATION: 10, // Placeholder
    PRICING_STRATEGY: profileData.pricing ? 12 : 8,
    CONVERSION_OPTIMIZATION: 7
  }

  const overallScore = Object.values(sectionScores).reduce((sum, score) => sum + score, 0)

  return {
    overallScore,
    sectionScores,
    topIssues: [
      {
        title: 'Headline lacks specialization',
        problem: 'Your headline only includes credentials without specialty or location',
        impact: 'Missing 40-50% of potential clients searching for specific services',
        opportunity: 'Adding location and specialty could increase profile views by 60%'
      },
      {
        title: 'About section is therapist-focused',
        problem: 'Heavy use of "I/my/me" instead of "you/your" language',
        impact: 'Clients don\'t see themselves in your description',
        opportunity: 'Client-focused language increases conversion by 35%'
      },
      {
        title: 'Too many specialties listed',
        problem: `${profileData.specialties.split('\n').length} specialties creates confusion`,
        impact: 'Appears as generalist, not specialist',
        opportunity: 'Narrowing to 5-7 increases credibility and conversions'
      }
    ],
    strengths: [
      'Professional credentials clearly stated',
      'Complete contact information provided',
      'Profile sections are filled out'
    ],
    quickWins: [
      {
        title: 'Add location to headline',
        description: `Include "${profileData.location}" in your headline for local SEO`,
        time: '5 minutes'
      },
      {
        title: 'Reduce specialties list',
        description: 'Focus on your top 5-7 core specialties',
        time: '10 minutes'
      },
      {
        title: 'Add outcome language',
        description: 'Include transformation promises in first paragraph',
        time: '15 minutes'
      }
    ]
  }
}

function analyzeHeadline(headline) {
  let score = 0
  if (headline.match(/\b[A-Z][a-z]+,?\s+[A-Z]{2}\b/)) score += 5 // Location
  if (headline.length > 20 && !headline.match(/^[\w\s]+,\s+[A-Z]+$/)) score += 5 // Specialty
  if (headline.match(/\b(LCSW|PhD|LMFT|PsyD|MA|MS|LPC)\b/)) score += 5 // Credentials
  return Math.min(score, 12)
}

function analyzeAboutSection(about) {
  const youCount = (about.match(/\b(you|your)\b/gi) || []).length
  const iCount = (about.match(/\b(I|my|me)\b/gi) || []).length
  const wordCount = about.split(/\s+/).length

  let score = 0
  if (youCount > iCount) score += 6
  else if (youCount > 0) score += 3

  if (wordCount >= 300 && wordCount <= 500) score += 4
  else if (wordCount >= 200) score += 2

  score += 8 // Base score for having content

  return Math.min(score, 20)
}

function analyzeSpecialties(specialties) {
  const count = specialties.split('\n').filter(s => s.trim()).length

  if (count >= 3 && count <= 7) return 12
  if (count >= 8 && count <= 10) return 9
  if (count >= 11 && count <= 15) return 6
  return 3
}

export default ResultsPage
