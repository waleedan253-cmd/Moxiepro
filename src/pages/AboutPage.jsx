function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About MoxiePro
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered Psychology Today profile optimization for therapists
          </p>
        </div>

        {/* What is MoxiePro */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is MoxiePro?</h2>
          <p className="text-gray-700 mb-4">
            MoxiePro is a specialized SaaS tool that helps therapists audit and optimize their
            Psychology Today profiles using AI and a proven 100-point scoring system.
          </p>
          <p className="text-gray-700 mb-4">
            Our system evaluates your profile across 6 critical categories:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Headline Effectiveness (20 points):</strong> Location, specialty, outcome, and credentials</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>About Section Impact (25 points):</strong> Client focus, pain points, trust signals</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Specialization Positioning (15 points):</strong> Focus clarity and market positioning</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Visual Presentation (15 points):</strong> Photo quality and profile completeness</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Pricing Strategy (15 points):</strong> Transparency and value communication</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Conversion Optimization (10 points):</strong> Contact options and next steps clarity</span>
            </li>
          </ul>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Submit Your Profile</h3>
              <p className="text-gray-700">
                Simply paste your Psychology Today profile information into our audit form.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
              <p className="text-gray-700">
                Our AI evaluates your profile using the MoxiePro 100-point scoring system,
                analyzing headline effectiveness, content quality, specialization focus, and more.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Get Detailed Results</h3>
              <p className="text-gray-700">
                Receive a comprehensive audit with your overall score, section-by-section breakdown,
                top critical issues, strengths, and actionable quick wins.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Optimize Your Profile</h3>
              <p className="text-gray-700">
                Use our recommendations to improve your profile, or upgrade to our full optimization
                service for copy-paste ready content.
              </p>
            </div>
          </div>
        </div>

        {/* The MoxiePro System */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The 3-Stage Audit System</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary-600 mb-2">
                Stage 1: Initial Quick Audit
              </h3>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• Quick assessment to identify major issues</li>
                <li>• 300-500 word conversational format</li>
                <li>• Overall score + top 5 issues</li>
                <li>• 10-15 minute delivery</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-600 mb-2">
                Stage 2: Complete Audit Report
              </h3>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• Comprehensive 4-tab analysis document</li>
                <li>• 3,000-5,000 word detailed report</li>
                <li>• Section-by-section breakdown</li>
                <li>• Opportunity analysis and revenue impact</li>
                <li>• 45-60 minute professional delivery</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-600 mb-2">
                Stage 3: Full Optimization (Paid Service)
              </h3>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• Complete optimized content (copy-paste ready)</li>
                <li>• 3 headline options to choose from</li>
                <li>• Full About section rewrite (300-400 words)</li>
                <li>• Focused specialties list</li>
                <li>• Step-by-step implementation guide</li>
                <li>• 30 days of support included</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Levels */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Levels</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mr-4 whitespace-nowrap">
                90-100
              </div>
              <div>
                <strong className="text-gray-900">EXCEPTIONAL:</strong>
                <span className="text-gray-700"> Best in class, minor tweaks only</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mr-4 whitespace-nowrap">
                75-89
              </div>
              <div>
                <strong className="text-gray-900">ABOVE AVERAGE:</strong>
                <span className="text-gray-700"> Strong foundation, optimization will maximize</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mr-4 whitespace-nowrap">
                60-74
              </div>
              <div>
                <strong className="text-gray-900">AVERAGE:</strong>
                <span className="text-gray-700"> Solid base, needs strategic improvements</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold mr-4 whitespace-nowrap">
                45-59
              </div>
              <div>
                <strong className="text-gray-900">BELOW AVERAGE:</strong>
                <span className="text-gray-700"> Multiple issues, significant opportunity</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold mr-4 whitespace-nowrap">
                0-44
              </div>
              <div>
                <strong className="text-gray-900">CRITICAL:</strong>
                <span className="text-gray-700"> Major problems, urgent attention needed</span>
              </div>
            </div>
          </div>
        </div>

        {/* About the Creator */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Creator</h2>
          <p className="text-gray-700 mb-4">
            MoxiePro was created by <strong>Abdul at Clarity Design Co.</strong>, a specialist
            in helping therapists optimize their online presence to attract more ideal clients.
          </p>
          <p className="text-gray-700">
            The MoxiePro system is based on extensive research, real-world testing with hundreds
            of therapist profiles, and proven optimization strategies that consistently deliver
            measurable results.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
