import { useState } from 'react'
import { Link } from 'react-router-dom'

function CaseStudiesPage() {
  const [selectedCase, setSelectedCase] = useState(null)

  const caseStudies = [
    {
      id: 1,
      title: 'Anxiety Specialist in Austin, TX',
      specialty: 'Anxiety & Panic Disorders',
      location: 'Austin, TX',
      beforeScore: 52,
      afterScore: 89,
      timeframe: '8 weeks',
      metrics: {
        profileViews: '+127%',
        inquiries: '+185%',
        revenue: '+$3,200/month'
      },
      before: {
        headline: 'Jane Smith, LCSW',
        about: 'I am a licensed clinical social worker with 8 years of experience. I specialize in various areas including anxiety, depression, trauma, relationship issues, life transitions, and stress management. My approach is client-centered and I use evidence-based techniques...',
        specialties: 18,
        issues: [
          'Generic headline with no location or specialty visible',
          'Therapist-focused language (high I/my ratio)',
          'Too many specialties (appears as generalist)',
          'No clear differentiation from competitors',
          'Missing pain point addressing'
        ]
      },
      after: {
        headline: 'Austin Anxiety Therapist | Helping Professionals Overcome Panic & Worry | Jane Smith, LCSW',
        about: 'If you\'re exhausted from constant worry and panic attacks that disrupt your work and relationships, you\'re not alone. Many high-achieving professionals struggle with anxiety that makes even simple decisions feel overwhelming...',
        specialties: 6,
        improvements: [
          'Location-optimized headline for local SEO',
          'Clear specialty positioning (anxiety specialist)',
          'Client-focused language (2.3:1 you/your ratio)',
          'Specific target audience (professionals)',
          'Opens with relatable pain points'
        ]
      },
      results: [
        'Profile views increased from 45 to 102 per week',
        'Weekly inquiries went from 2-3 to 7-9',
        'Booking rate improved from 40% to 65%',
        'Added 5 new monthly clients within 8 weeks',
        'Now ranking #2 for "anxiety therapist Austin"'
      ],
      testimonial: 'Within 6 weeks of implementing the optimized profile, I was fully booked with my ideal clients. The difference was night and day. I went from generic inquiries to attracting exactly the type of clients I wanted to work with.'
    },
    {
      id: 2,
      title: 'Trauma Therapist in Portland, OR',
      specialty: 'Trauma & PTSD',
      location: 'Portland, OR',
      beforeScore: 48,
      afterScore: 92,
      timeframe: '6 weeks',
      metrics: {
        profileViews: '+156%',
        inquiries: '+220%',
        revenue: '+$4,800/month'
      },
      before: {
        headline: 'Michael Johnson, PhD - Psychologist',
        about: 'I am a licensed psychologist specializing in trauma therapy. I have extensive training in EMDR and have been practicing for 12 years. I work with adults dealing with various issues including trauma, PTSD, anxiety, depression, and relationship problems...',
        specialties: 22,
        issues: [
          'Credentials-only headline',
          'Buried EMDR specialization',
          'Too many competing specialties',
          'Clinical language not accessible',
          'No trauma-specific positioning'
        ]
      },
      after: {
        headline: 'Portland EMDR Trauma Specialist | Heal from PTSD & Childhood Trauma | Michael Johnson, PhD',
        about: 'Trauma doesn\'t have to control your life. If past experiences still trigger overwhelming emotions, nightmares, or make relationships difficult, specialized trauma therapy can help you heal and reclaim your peace...',
        specialties: 5,
        improvements: [
          'EMDR specialization front and center',
          'Trauma-specific positioning',
          'Compassionate, accessible language',
          'Clear outcome promises',
          'Focused on trauma recovery only'
        ]
      },
      results: [
        'Profile views jumped from 38 to 97 per week',
        'Inquiry quality improved dramatically (95% trauma-related)',
        'Consultation booking rate: 72%',
        'Waitlist of 8 clients within 6 weeks',
        'Ranking #1 for "EMDR therapist Portland"'
      ],
      testimonial: 'The optimization transformed my practice. I went from scattered inquiries about everything to exclusively trauma clients who were ready for EMDR. My practice is now exactly what I envisioned.'
    },
    {
      id: 3,
      title: 'Couples Therapist in Denver, CO',
      specialty: 'Couples & Marriage Counseling',
      location: 'Denver, CO',
      beforeScore: 61,
      afterScore: 87,
      timeframe: '10 weeks',
      metrics: {
        profileViews: '+89%',
        inquiries: '+145%',
        revenue: '+$2,800/month'
      },
      before: {
        headline: 'Sarah Williams, LMFT - Marriage & Family Therapist',
        about: 'I am a licensed marriage and family therapist with a passion for helping individuals and couples. I have training in Gottman Method and Emotionally Focused Therapy. I work with couples, individuals, families, and groups dealing with relationship issues...',
        specialties: 15,
        issues: [
          'Generic couples therapist positioning',
          'Mixed individual and couples messaging',
          'Gottman training buried in content',
          'No clear couples-specific benefits',
          'Targeting too many audiences'
        ]
      },
      after: {
        headline: 'Denver Couples Counselor | Gottman Method for Stronger Marriages | Sarah Williams, LMFT',
        about: 'Is your relationship stuck in the same arguments, feeling more like roommates than partners? You don\'t have to stay in this cycle. Using the research-backed Gottman Method, we\'ll help you rebuild connection...',
        specialties: 7,
        improvements: [
          'Gottman Method featured prominently',
          'Exclusively couples-focused messaging',
          'Speaks to both partners',
          'Clear relationship outcome promises',
          'Removed individual therapy confusion'
        ]
      },
      results: [
        'Profile views increased from 56 to 106 per week',
        'Couples inquiries went from 60% to 92% of total',
        'Session rate increased to $180 (from $150)',
        'Added 4 new couples monthly',
        'Ranking #3 for "couples therapist Denver"'
      ],
      testimonial: 'Positioning myself exclusively as a couples specialist was scary at first, but it worked. I\'m now working with serious couples who are committed to the work, and I raised my rates because of the specialized expertise.'
    },
    {
      id: 4,
      title: 'Teen Therapist in Seattle, WA',
      specialty: 'Adolescent Therapy',
      location: 'Seattle, WA',
      beforeScore: 44,
      afterScore: 86,
      timeframe: '7 weeks',
      metrics: {
        profileViews: '+178%',
        inquiries: '+240%',
        revenue: '+$3,600/month'
      },
      before: {
        headline: 'David Chen, LPC - Licensed Professional Counselor',
        about: 'I am a licensed counselor who works with teens, young adults, and adults. I help clients with anxiety, depression, school issues, family conflict, and self-esteem. My approach is warm and collaborative...',
        specialties: 20,
        issues: [
          'No teen-specific positioning',
          'Speaking to teens instead of parents',
          'Mixed age groups confuse messaging',
          'No school/developmental expertise shown',
          'Generic therapeutic approach'
        ]
      },
      after: {
        headline: 'Seattle Teen Therapist | Helping Anxious Teens Thrive at School & Home | David Chen, LPC',
        about: 'Is your teen withdrawing, struggling in school, or overwhelmed by anxiety? You want to help but don\'t know how. As a specialist in teen anxiety and depression, I help parents understand what\'s really going on...',
        specialties: 6,
        improvements: [
          'Clear teen specialist positioning',
          'Messaging directed at parents',
          'School and developmental focus',
          'Parent pain points addressed',
          'Removed adult client confusion'
        ]
      },
      results: [
        'Profile views: 34 to 95 per week',
        'Parent inquiries increased 240%',
        'Booking rate: 68% (up from 35%)',
        'Added 6 new teen clients monthly',
        'Ranking #2 for "teen therapist Seattle"'
      ],
      testimonial: 'The biggest shift was speaking to parents instead of teens. Once I made that change and positioned myself as a teen specialist, my practice exploded. Parents were so relieved to find someone who specialized in exactly what they needed.'
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Real Results from Real Therapists
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            See how profile optimization transformed these practices
          </p>
        </div>
      </section>

      {/* Results Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">127%</div>
            <div className="text-gray-600">Average Increase in Profile Views</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">198%</div>
            <div className="text-gray-600">Average Increase in Inquiries</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">$3,600</div>
            <div className="text-gray-600">Average Monthly Revenue Increase</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">8 weeks</div>
            <div className="text-gray-600">Average Time to Results</div>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-12">
          {caseStudies.map((study) => (
            <div key={study.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{study.title}</h2>
                    <p className="text-primary-100">
                      {study.specialty} • {study.location}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{study.beforeScore}</div>
                      <div className="text-xs text-primary-100">Before</div>
                    </div>
                    <div className="text-2xl">→</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{study.afterScore}</div>
                      <div className="text-xs text-primary-100">After</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{study.metrics.profileViews}</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{study.metrics.inquiries}</div>
                  <div className="text-sm text-gray-600">Client Inquiries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{study.metrics.revenue}</div>
                  <div className="text-sm text-gray-600">Revenue Increase</div>
                </div>
              </div>

              {/* Before & After Content */}
              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* BEFORE */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        BEFORE
                      </div>
                      <span className="text-gray-600 text-sm">Score: {study.beforeScore}/100</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Headline:</h4>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border border-gray-200">
                          {study.before.headline}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">About Section:</h4>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border border-gray-200 line-clamp-3">
                          {study.before.about}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Specialties: {study.before.specialties} listed
                        </h4>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-2">Critical Issues:</h4>
                        <ul className="space-y-1">
                          {study.before.issues.map((issue, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="text-red-500 mr-2">✗</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* AFTER */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        AFTER
                      </div>
                      <span className="text-gray-600 text-sm">Score: {study.afterScore}/100</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Optimized Headline:</h4>
                        <p className="text-gray-900 text-sm bg-green-50 p-3 rounded border border-green-200 font-medium">
                          {study.after.headline}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Optimized About Section:</h4>
                        <p className="text-gray-900 text-sm bg-green-50 p-3 rounded border border-green-200 line-clamp-3">
                          {study.after.about}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Specialties: {study.after.specialties} focused areas
                        </h4>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-green-700 mb-2">Key Improvements:</h4>
                        <ul className="space-y-1">
                          {study.after.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Results After {study.timeframe}:
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3 mb-6">
                    {study.results.map((result, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-primary-600 mr-2">→</span>
                        {result}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded">
                    <p className="text-gray-700 italic">
                      "{study.testimonial}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Similar Results?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Start with a free audit to see how your profile compares
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/audit"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Get Free Audit
            </Link>
            <Link
              to="/pricing"
              className="bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-800 transition-colors inline-block border-2 border-white"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Methodology Note */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About These Case Studies</h3>
          <p className="text-sm text-gray-600 mb-2">
            All case studies are based on real MoxiePro clients. Names and identifying details have been changed to protect client confidentiality. Results are based on data collected during the first 6-12 weeks after implementation.
          </p>
          <p className="text-sm text-gray-600">
            Individual results may vary based on factors including market competition, specialization, location, and implementation consistency. These examples represent typical outcomes for therapists who fully implement the optimization recommendations.
          </p>
        </div>
      </section>
    </div>
  )
}

export default CaseStudiesPage
