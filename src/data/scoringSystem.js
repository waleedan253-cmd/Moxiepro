/**
 * MoxiePro 100-Point Scoring System
 * Based on the audit framework documentation
 */

export const SCORING_SECTIONS = {
  HEADLINE: {
    name: 'Headline Effectiveness',
    maxPoints: 20,
    weight: 0.20,
    criteria: [
      {
        id: 'location',
        label: 'Location/city mentioned (local SEO)',
        points: 5,
        description: 'Profile includes city or location for local search optimization'
      },
      {
        id: 'specialty',
        label: 'Specialty/niche visible (not generic)',
        points: 5,
        description: 'Clear specialization shown, not generic therapist description'
      },
      {
        id: 'outcome',
        label: 'Outcome or transformation promise',
        points: 5,
        description: 'Mentions results or transformation clients can expect'
      },
      {
        id: 'credentials',
        label: 'Professional credentials included',
        points: 5,
        description: 'Relevant credentials properly displayed'
      }
    ],
    scoreBreakdown: [
      { min: 18, max: 20, rating: 'Exceptional', description: 'Location + specialty + outcome + credentials' },
      { min: 15, max: 17, rating: 'Strong', description: 'Has 3 of 4 elements' },
      { min: 10, max: 14, rating: 'Average', description: 'Has 2 of 4 elements' },
      { min: 5, max: 9, rating: 'Below Average', description: 'Generic with credentials only' },
      { min: 0, max: 4, rating: 'Critical', description: 'Missing or severely problematic' }
    ]
  },

  ABOUT_SECTION: {
    name: 'About Section Impact',
    maxPoints: 25,
    weight: 0.25,
    criteria: [
      {
        id: 'clientFocus',
        label: 'Client-Focused Language',
        points: 6,
        description: 'You/your vs I/my/me ratio (ideal 2:1 or better)'
      },
      {
        id: 'painPoints',
        label: 'Pain Point Addressing',
        points: 5,
        description: 'Opens with client struggles, shows empathy'
      },
      {
        id: 'trustSignals',
        label: 'Trust Signals',
        points: 4,
        description: 'Experience, credentials, approach, testimonials'
      },
      {
        id: 'readability',
        label: 'Readability',
        points: 4,
        description: 'Appropriate length, clear structure, conversational tone'
      },
      {
        id: 'outcomeLanguage',
        label: 'Outcome Language',
        points: 3,
        description: 'Clear outcome promises and transformation vision'
      },
      {
        id: 'callToAction',
        label: 'Call to Action',
        points: 3,
        description: 'Clear next steps, removes barriers to contact'
      }
    ],
    scoreBreakdown: [
      { min: 22, max: 25, rating: 'Exceptional', description: 'Perfect balance, emotional connection' },
      { min: 18, max: 21, rating: 'Strong', description: 'Good client focus, minor improvements needed' },
      { min: 13, max: 17, rating: 'Average', description: 'Some issues with balance or focus' },
      { min: 8, max: 12, rating: 'Below Average', description: 'Major issues with focus or language' },
      { min: 0, max: 7, rating: 'Critical', description: 'Missing, too short, or therapist-focused' }
    ]
  },

  SPECIALIZATION: {
    name: 'Specialization Positioning',
    maxPoints: 15,
    weight: 0.15,
    criteria: [
      {
        id: 'focusClarity',
        label: 'Focus Clarity',
        points: 5,
        description: '3-5 core specialties = excellent, 21+ = poor'
      },
      {
        id: 'strategicAlignment',
        label: 'Strategic Alignment',
        points: 5,
        description: 'Specialties align with About section and support each other'
      },
      {
        id: 'marketPositioning',
        label: 'Market Positioning',
        points: 5,
        description: 'Specialist positioning with unique niche'
      }
    ],
    scoreBreakdown: [
      { min: 14, max: 15, rating: 'Exceptional', description: 'Clear focus, strategic specialties' },
      { min: 11, max: 13, rating: 'Strong', description: 'Good focus with minor scatter' },
      { min: 8, max: 10, rating: 'Average', description: 'Some focus but diluted' },
      { min: 5, max: 7, rating: 'Below Average', description: 'Unfocused, scattered' },
      { min: 0, max: 4, rating: 'Critical', description: 'Treats everything, no specialization' }
    ]
  },

  VISUAL_PRESENTATION: {
    name: 'Visual Presentation',
    maxPoints: 15,
    weight: 0.15,
    criteria: [
      {
        id: 'professionalPhoto',
        label: 'Professional Photo',
        points: 5,
        description: 'Professional headshot with warm, approachable expression'
      },
      {
        id: 'profileCompleteness',
        label: 'Profile Completeness',
        points: 5,
        description: 'All sections filled, verified, contact info complete'
      },
      {
        id: 'credibilitySignals',
        label: 'Credibility Signals',
        points: 5,
        description: 'Endorsements, experience, education, license verification'
      }
    ],
    scoreBreakdown: [
      { min: 14, max: 15, rating: 'Exceptional', description: 'Professional photo, complete profile' },
      { min: 11, max: 13, rating: 'Strong', description: 'Good photo, minor improvements' },
      { min: 8, max: 10, rating: 'Average', description: 'Adequate presentation' },
      { min: 5, max: 7, rating: 'Below Average', description: 'Missing elements' },
      { min: 0, max: 4, rating: 'Critical', description: 'No photo or major issues' }
    ]
  },

  PRICING_STRATEGY: {
    name: 'Pricing Strategy',
    maxPoints: 15,
    weight: 0.15,
    criteria: [
      {
        id: 'pricingTransparency',
        label: 'Pricing Transparency',
        points: 5,
        description: 'Session fee clear, rates for different services listed'
      },
      {
        id: 'insurancePositioning',
        label: 'Insurance Positioning',
        points: 5,
        description: 'Insurance accepted clearly listed and explained'
      },
      {
        id: 'valueCommunication',
        label: 'Value Communication',
        points: 5,
        description: 'Rate positioned appropriately, specialization justifies rate'
      }
    ],
    scoreBreakdown: [
      { min: 14, max: 15, rating: 'Exceptional', description: 'Clear, justified, accessible' },
      { min: 11, max: 13, rating: 'Strong', description: 'Clear with minor improvements' },
      { min: 8, max: 10, rating: 'Average', description: 'Present but could be clearer' },
      { min: 5, max: 7, rating: 'Below Average', description: 'Confusing or missing elements' },
      { min: 0, max: 4, rating: 'Critical', description: 'No pricing or major issues' }
    ]
  },

  CONVERSION_OPTIMIZATION: {
    name: 'Conversion Optimization',
    maxPoints: 10,
    weight: 0.10,
    criteria: [
      {
        id: 'contactOptions',
        label: 'Contact Options',
        points: 3,
        description: 'Phone, email, and multiple contact methods available'
      },
      {
        id: 'consultationOffer',
        label: 'Consultation Offer',
        points: 3,
        description: 'Free consultation offered with details explained'
      },
      {
        id: 'nextStepsClarity',
        label: 'Next Steps Clarity',
        points: 2,
        description: 'Clear what happens after contact, process explained'
      },
      {
        id: 'availability',
        label: 'Availability',
        points: 2,
        description: 'Schedule mentioned, accepting new clients status clear'
      }
    ],
    scoreBreakdown: [
      { min: 9, max: 10, rating: 'Exceptional', description: 'Clear, low-friction pathway' },
      { min: 7, max: 8, rating: 'Strong', description: 'Good pathway, minor improvements' },
      { min: 5, max: 6, rating: 'Average', description: 'Adequate but could improve' },
      { min: 3, max: 4, rating: 'Below Average', description: 'Friction or confusion' },
      { min: 0, max: 2, rating: 'Critical', description: 'Major barriers present' }
    ]
  }
}

export const PERFORMANCE_LEVELS = [
  { min: 90, max: 100, rating: 'EXCEPTIONAL', description: 'Best in class, minor tweaks only', color: 'green' },
  { min: 75, max: 89, rating: 'ABOVE AVERAGE', description: 'Strong foundation, optimization will maximize', color: 'blue' },
  { min: 60, max: 74, rating: 'AVERAGE', description: 'Solid base, needs strategic improvements', color: 'yellow' },
  { min: 45, max: 59, rating: 'BELOW AVERAGE', description: 'Multiple issues, significant opportunity', color: 'orange' },
  { min: 0, max: 44, rating: 'CRITICAL', description: 'Major problems, urgent attention needed', color: 'red' }
]

export const calculateOverallScore = (sectionScores) => {
  const total = Object.values(sectionScores).reduce((sum, score) => sum + score, 0)
  return Math.round(total)
}

export const getPerformanceLevel = (score) => {
  return PERFORMANCE_LEVELS.find(level => score >= level.min && score <= level.max)
}

export const getSectionRating = (sectionKey, score) => {
  const section = SCORING_SECTIONS[sectionKey]
  if (!section) return null
  return section.scoreBreakdown.find(breakdown => score >= breakdown.min && score <= breakdown.max)
}
