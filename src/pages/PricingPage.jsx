import { useState } from 'react'
import { Link } from 'react-router-dom'

function PricingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'full-optimization',
    currentScore: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Integrate with email service or backend
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Profile Optimization Services
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Get more therapy clients with a professionally optimized Psychology Today profile
          </p>
        </div>
      </section>

      {/* Free vs Paid Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Path to Success
          </h2>
          <p className="text-lg text-gray-600">
            Start with a free audit, or get the complete optimization package
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Audit */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Audit</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <p className="text-gray-600">Perfect for DIY optimization</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Overall score out of 100</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Section-by-section breakdown</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Top 5 critical issues identified</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Quick wins and recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Revenue opportunity analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span className="text-gray-400">Optimized content (headlines, About section)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span className="text-gray-400">Implementation guide</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span className="text-gray-400">30 days of support</span>
              </li>
            </ul>

            <Link
              to="/audit"
              className="block w-full bg-gray-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Get Free Audit
            </Link>
          </div>

          {/* Full Optimization */}
          <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-primary-600 relative">
            <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
              MOST POPULAR
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Full Optimization</h3>
              <div className="text-4xl font-bold text-primary-600 mb-2">$497</div>
              <p className="text-gray-600">Complete, copy-paste ready content</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700"><strong>Everything in Free Audit, plus:</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">3 optimized headline options</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Complete About section rewrite (300-400 words)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Focused specialties list</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Optimized pricing and insurance language</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Step-by-step implementation guide</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">SEO & visibility strategy</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Marketing announcement templates</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">30 days of email support</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">7-10 day delivery</span>
              </li>
            </ul>

            <a
              href="#contact-form"
              className="block w-full bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </section>

      {/* What's Included - Detailed */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What's Included in Full Optimization
            </h2>
            <p className="text-lg text-gray-600">
              Complete, implementation-ready content delivered in 7-10 days
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '3 Optimized Headlines',
                description: 'Choose from 3 professionally crafted headlines that include location, specialty, outcome, and credentials',
                icon: '📝'
              },
              {
                title: 'Complete About Section',
                description: '300-400 word rewrite with 2:1 you/your ratio, client pain points, trust signals, and clear CTA',
                icon: '✍️'
              },
              {
                title: 'Focused Specialties',
                description: 'Strategic reduction to 5-7 core specialties that position you as a specialist, not generalist',
                icon: '🎯'
              },
              {
                title: 'Pricing & Insurance Copy',
                description: 'Optimized language that positions your rates appropriately and makes services accessible',
                icon: '💰'
              },
              {
                title: 'Implementation Guide',
                description: 'Week-by-week action plan with checklists to implement all changes quickly and correctly',
                icon: '📋'
              },
              {
                title: 'SEO Strategy',
                description: 'Keyword optimization, ranking targets, and monitoring guide to dominate local search',
                icon: '🔍'
              },
              {
                title: 'Marketing Templates',
                description: 'Ready-to-use social media posts, email announcements, and website updates',
                icon: '📢'
              },
              {
                title: 'Before & After Analysis',
                description: 'Clear comparison showing exactly how your profile transforms and why it works',
                icon: '📊'
              },
              {
                title: '30 Days Support',
                description: 'Email support for questions, implementation help, and minor tweaks within 24 hours',
                icon: '🤝'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expected Results Timeline */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expected Results Timeline
            </h2>
            <p className="text-lg text-gray-600">
              What to expect after implementing your optimized profile
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Week 1-2: Implementation</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Update headline, About section, and specialties</li>
                <li>• Optimize pricing and insurance information</li>
                <li>• Announce profile refresh on social media</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Week 3-4: Initial Results</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Increased profile views (typical: 40-60% increase)</li>
                <li>• Better quality inquiries from ideal-fit clients</li>
                <li>• Improved search rankings for key terms</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Month 2-3: Momentum Builds</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 3-5 additional monthly client inquiries</li>
                <li>• Page 1 rankings for target keywords</li>
                <li>• $2,400-$4,000 additional monthly revenue (typical)</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Long-Term Impact</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Consistent flow of ideal-fit client referrals</li>
                <li>• Established specialist positioning in your market</li>
                <li>• $30,000-$50,000+ annual revenue increase (typical)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple 4-step process from audit to optimized profile
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Submit Your Information',
                description: 'Fill out the form below with your current profile information and any specific goals or concerns'
              },
              {
                step: '2',
                title: 'We Analyze & Optimize',
                description: 'Our team conducts a thorough audit and creates your complete optimization package (7-10 business days)'
              },
              {
                step: '3',
                title: 'Receive Your Package',
                description: 'Get your comprehensive document with all optimized content, implementation guide, and marketing materials'
              },
              {
                step: '4',
                title: 'Implement & Grow',
                description: 'Follow the step-by-step guide to update your profile, with 30 days of support to ensure success'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Optimize Your Profile?
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            {isSubmitted && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                Thank you! We've received your request and will contact you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Interested In *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="full-optimization">Full Optimization ($497)</option>
                  <option value="consultation">Consultation First</option>
                  <option value="questions">I Have Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Audit Score (if known)
                </label>
                <input
                  type="text"
                  name="currentScore"
                  value={formData.currentScore}
                  onChange={handleChange}
                  placeholder="e.g., 62/100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your goals or challenges
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Not getting enough inquiries, wrong-fit clients, want to attract more anxiety clients, etc."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-6 py-4 rounded-md text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Request Full Optimization
              </button>

              <p className="text-center text-sm text-gray-500">
                We'll review your information and send you next steps within 24 hours
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'How long does it take to see results?',
                answer: 'Most therapists see increased profile views within 2-4 weeks and start receiving more ideal-fit inquiries within 4-8 weeks. SEO improvements typically show within 30-60 days.'
              },
              {
                question: 'Can I make changes to the optimized content?',
                answer: 'Yes! While we recommend using the content as-written for best results, you can make minor tweaks to match your voice. The structure and key elements should remain intact.'
              },
              {
                question: 'What if I\'m not satisfied with the optimization?',
                answer: 'We offer one round of revisions within the 30-day support period. Our goal is your success, and we\'ll work with you to ensure the content meets your needs.'
              },
              {
                question: 'Do I need technical skills to implement the changes?',
                answer: 'No! The implementation guide includes step-by-step screenshots and instructions. If you can log into Psychology Today and copy-paste text, you can do this. Plus, we\'re here to help during your 30-day support period.'
              },
              {
                question: 'Is this a one-time fee or subscription?',
                answer: 'One-time fee of $497. No recurring charges. You own all the content and can use it indefinitely.'
              },
              {
                question: 'What if I haven\'t done the free audit yet?',
                answer: 'We recommend starting with the free audit to see your current score and issues. However, if you\'re ready to move forward, we\'ll conduct the audit as part of the optimization process.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Invest in Your Practice Growth Today
          </h2>
          <p className="text-xl mb-2 text-primary-100">
            $497 one-time investment
          </p>
          <p className="text-lg mb-8 text-primary-100">
            Typical ROI: $30,000-$50,000+ in first year
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact-form"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Get Started Now
            </a>
            <Link
              to="/audit"
              className="bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-800 transition-colors inline-block border-2 border-white"
            >
              Start with Free Audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
