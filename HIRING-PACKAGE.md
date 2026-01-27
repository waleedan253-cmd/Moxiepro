#### PROJECT OVERVIEW

**What is MoxiePro?**
A SaaS tool that helps therapists audit and optimize their Psychology Today profiles using AI-powered analysis.


**Current Status:** 65% complete
- Frontend: 90% done
- Backend: 70% done
- All dependencies installed
- Code structure in place

---

#### YOUR TASKS (21 Items)

**Backend - 30% Remaining:**
1. ✅ Claude API integration exists (needs testing)
2. ❌ Set up environment variables (.env)
3. ❌ Deploy to Vercel
4. ❌ Create Vercel KV database
5. ❌ Test scraper + Claude flow end-to-end
6. ❌ Fix any bugs from testing

**Frontend - 10% Remaining:**
7. ❌ Update ResultsPage.jsx for lock/unlock UI
8. ❌ Add payment button integration
9. ❌ Add loading states with educational tips
10. ❌ Connect frontend to backend API

**Payments:**
11. ❌ Set up Lemon Squeezy account (I'll provide credentials)
12. ❌ Create product ($14.99)
13. ❌ Configure webhook
14. ❌ Test payment flow (test mode)

**Email:**
15. ❌ Set up Resend account (I'll provide API key)
16. ❌ Create email templates (audit complete, payment receipt)
17. ❌ Test email sending

**Final Testing:**
18. ❌ End-to-end testing (free user flow)
19. ❌ End-to-end testing (paid user flow)
20. ❌ Mobile responsive testing
21. ❌ Fix all bugs

**Estimated Time:** 15-20 hours

---

#### TECH STACK

**Frontend:**
- React 18
- Vite (build tool)
- TailwindCSS
- React Router v6

**Backend:**
- Vercel Serverless Functions
- Node.js

**Database:**
- Vercel KV (Redis)

**Integrations:**
- AI: Anthropic Claude API
- Scraping: Puppeteer + @sparticuz/chromium
- Payment: Lemon Squeezy
- Email: Resend
- PDF: @react-pdf/renderer
- Storage: Vercel Blob (for PDFs)

**Already Installed:**
All dependencies are in package.json and installed.

---

#### PROJECT STRUCTURE

```
MoxiePro/
├── api/                          # Vercel serverless functions
│   ├── create-audit.js          # Main endpoint (scrape + analyze)
│   ├── scrape.js                # PT profile scraper
│   ├── analyze.js               # Claude AI integration
│   ├── get-audit.js             # Retrieve audit by ID
│   ├── create-payment.js        # Lemon Squeezy checkout
│   ├── generate-pdf.js          # PDF generation
│   ├── webhook.js               # Payment webhook handler
│   └── utils/
│       ├── claude.js            # Claude API helpers
│       ├── kv.js                # Database functions
│       └── errors.js            # Error handling
│
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── AuditPage.jsx        # URL input form
│   │   ├── ResultsPage.jsx      # Audit display (NEEDS WORK)
│   │   ├── AboutPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── CaseStudiesPage.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

#### FILES YOU'LL WORK ON

**Priority Files:**
1. `api/utils/claude.js` - Test Claude integration, fix JSON parsing
2. `api/create-audit.js` - Test scraper + Claude flow
3. `src/pages/ResultsPage.jsx` - Add lock/unlock UI for free vs paid
4. `api/create-payment.js` - Lemon Squeezy integration
5. `api/webhook.js` - Payment webhook handler
6. `.env` - Environment variables (I'll provide test keys)

**Known Issues:**
- Claude API sometimes returns JSON wrapped in markdown code blocks
- Need to strip ```json and ``` from responses
- Rate limiting is currently disabled (line 69-80 in create-audit.js)
- ResultsPage shows mock data, needs real API connection

---

#### DEVELOPMENT WORKFLOW

**Branch Strategy:**
- You work on: `developer-work` branch
- Main branch: `main` (protected)
- I review and merge your PRs

**Daily Updates:**
- Commit regularly with clear messages
- Push to `developer-work` daily
- Update me via WhatsApp/Discord on progress

**Code Standards:**
- Follow existing code style
- Add comments for complex logic
- Handle errors gracefully
- Test before committing

---

#### TIMELINE & MILESTONES

**Week 1 (Days 1-5):**
- Set up local environment
- Test Claude API + scraper
- Deploy to Vercel
- Create Vercel KV database

**Week 2 (Days 6-10):**
- Update ResultsPage UI
- Integrate Lemon Squeezy payments
- Set up email templates
- Connect frontend to backend

**Week 3 (Days 11-14):**
- End-to-end testing
- Mobile testing
- Bug fixes
- Final review

#### ACCESS & CREDENTIALS

**What I'll Provide:**

1. **GitHub Access:**
   - Collaborator access (not admin)
   - Work on `developer-work` branch

2. **API Keys (Test Only):**
   - Anthropic Claude API (spending limit: $5)
   - Vercel account (developer role)
   - Lemon Squeezy (test mode)
   - Resend (test API key)

3. **Documentation:**
   - README.md
   - SETUP.md (setup instructions)

**What You'll Create:**
- Test accounts for services I don't have yet
- Development environment on your machine
- Test data for audits

**Security Rules:**
- Never commit API keys to git
- Use .env.local for local development
- All production keys stay with me
- Delete all files after project completion

---

#### DELIVERABLES

**Code:**
- All 21 tasks completed
- Clean, commented code
- No console errors
- Working on Vercel production

**Documentation:**
- Update README if you change anything
- Document any new environment variables
- List any new dependencies added

**Testing:**
- Screenshots of successful flows
- List of tested devices/browsers
- Any known limitations

**Handoff:**
- 30-minute walkthrough call
- Answer questions for 1 week post-launch
- Fix critical bugs (if any) within 7 days

---

#### SUCCESS CRITERIA

**The project is complete when:**
1. ✅ User can enter PT profile URL + email
2. ✅ Scraper extracts profile data
3. ✅ Claude generates audit (JSON formatted)
4. ✅ User sees free preview (score + 3 vague issues)
5. ✅ User can pay $14.99 via Lemon Squeezy
6. ✅ After payment, full audit unlocks
7. ✅ User receives email with PDF download
8. ✅ PDF contains all 11 sections
9. ✅ Works on mobile + desktop
10. ✅ No critical bugs



## 5. GITHUB SETUP INSTRUCTIONS

### Creating Developer Branch

**I'll create the branch now. Here's what will be set up:**

```bash
# Branch name: developer-work
# Branch protection: You review all merges
# Developer access: Collaborator (not admin)
```
Good luck! 🚀
