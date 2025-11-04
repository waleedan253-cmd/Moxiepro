# Moxie Pro

AI-powered Psychology Today profile optimization for therapists. Help therapists audit and optimize their PT profiles using a proven 100-point scoring system.

## Features

- **100-Point Scoring System**: Comprehensive evaluation across 6 critical categories
  - Headline Effectiveness (20 points)
  - About Section Impact (25 points)
  - Specialization Positioning (15 points)
  - Visual Presentation (15 points)
  - Pricing Strategy (15 points)
  - Conversion Optimization (10 points)

- **Performance Levels**: Five-tier rating system from Critical to Exceptional
- **Detailed Analysis**: Section-by-section breakdown with actionable recommendations
- **Quick Wins**: Easy-to-implement improvements with time estimates
- **Revenue Impact**: Analysis of optimization opportunities

## Tech Stack

- **Frontend**: React 18 with React Router
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/MoxiePro.git
cd MoxiePro/MoxiePro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Development

### Project Structure

```
MoxiePro/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── AuditPage.jsx
│   │   ├── ResultsPage.jsx
│   │   └── AboutPage.jsx
│   ├── data/           # Data models and constants
│   │   └── scoringSystem.js
│   ├── services/       # API and business logic
│   ├── utils/          # Utility functions
│   ├── styles/         # Additional styles
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # App entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages

## Deployment to GitHub Pages

### Initial Setup

1. Update `vite.config.js` with your repository name:
```javascript
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
  // ...
})
```

2. Update `src/main.jsx` with your repository name:
```javascript
<BrowserRouter basename="/YOUR_REPO_NAME">
```

### Deploy

#### Option 1: Manual Deployment

```bash
npm run build
npm run deploy
```

#### Option 2: Automatic Deployment with GitHub Actions

1. Create `.github/workflows/deploy.yml` (already included in this project)

2. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. Go to your repository Settings → Pages
4. Set Source to "GitHub Actions"
5. The site will automatically deploy on every push to main

Your site will be available at: `https://YOUR_USERNAME.github.io/MoxiePro/`

## Customization

### Branding

Update colors in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Your brand colors
  }
}
```

### Scoring System

Modify the scoring system in `src/data/scoringSystem.js` to adjust:
- Section weights
- Criteria and point values
- Performance level thresholds

## Roadmap

### Phase 1: MVP (Current)
- [x] Basic audit form
- [x] Scoring system implementation
- [x] Results display
- [ ] AI integration for analysis

### Phase 2: Enhanced Features
- [ ] OpenAI integration for intelligent analysis
- [ ] Save and share audit results
- [ ] PDF export of audit reports
- [ ] User accounts and history

### Phase 3: Full Platform
- [ ] Paid optimization service integration
- [ ] Payment processing
- [ ] Email automation
- [ ] Analytics dashboard
- [ ] Before/after tracking

## AI Integration (Coming Soon)

The current version includes a basic rule-based analysis. To integrate with OpenAI:

1. Create a `.env` file:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

2. Implement AI service in `src/services/aiAnalysis.js`

3. Update ResultsPage to use AI analysis instead of sample data

## Documentation

The project includes complete documentation from the original framework:
- PT Profile Audit Framework (F1.txt)
- Paid Optimization Delivery Framework (F2.txt)
- Example delivery structure (F3.txt)

These documents contain the complete MoxiePro methodology and should be referenced when implementing AI analysis.

## Contributing

This is a private project. For questions or collaboration, please contact Abdul at Clarity Design Co.

## License

Copyright (c) 2024 Clarity Design Co. All rights reserved.

## Support

For questions about MoxiePro or the Psychology Today optimization system, please contact:
- Website: [Your website]
- Email: [Your email]

---

Built with ❤️ for therapists who want to grow their practice
