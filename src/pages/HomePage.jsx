import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get More Therapy Clients from
            <span className="text-primary-600"> Psychology Today</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            MoxiePro uses AI to audit and optimize your Psychology Today profile
            using a proven 100-point scoring system. Find out what's costing you clients.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/audit"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
            >
              Get Free Audit Now
            </Link>
            <Link
              to="/about"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-primary-600"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The MoxiePro 100-Point Scoring System
          </h2>
          <p className="text-lg text-gray-600">
            We evaluate your profile across 6 critical categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Headline Effectiveness',
              points: '20 points',
              description: 'Location, specialty, outcome, and credentials optimization'
            },
            {
              title: 'About Section Impact',
              points: '25 points',
              description: 'Client-focused language, pain points, trust signals, and readability'
            },
            {
              title: 'Specialization Positioning',
              points: '15 points',
              description: 'Focus clarity, strategic alignment, and market positioning'
            },
            {
              title: 'Visual Presentation',
              points: '15 points',
              description: 'Professional photo, profile completeness, credibility signals'
            },
            {
              title: 'Pricing Strategy',
              points: '15 points',
              description: 'Transparency, insurance positioning, value communication'
            },
            {
              title: 'Conversion Optimization',
              points: '10 points',
              description: 'Contact options, consultation offer, next steps clarity'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {feature.points}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your profile audit in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Submit Your Profile',
                description: 'Paste your Psychology Today profile URL or text'
              },
              {
                step: '2',
                title: 'AI Analysis',
                description: 'Our AI evaluates your profile using the 100-point MoxiePro system'
              },
              {
                step: '3',
                title: 'Get Your Results',
                description: 'Receive detailed scores, top issues, and actionable recommendations'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/audit"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
            >
              Start Your Free Audit
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your Psychology Today Profile?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join therapists who are attracting more ideal clients with optimized profiles
          </p>
          <Link
            to="/audit"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
