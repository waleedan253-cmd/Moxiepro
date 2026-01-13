# MOXIEPRO - HIRING PACKAGE
**Complete package for hiring and onboarding a developer**

---

## 1. LINKEDIN JOB POST

### Title
**Full-Stack React Developer Needed - SaaS Project (15-20 hrs, PKR 25-30k)**

### Post Content

```
🚀 Full-Stack Developer Needed for AI-Powered SaaS Project

I'm looking for an experienced React/Node.js developer to complete the final 30% of a SaaS application that helps therapists optimize their Psychology Today profiles using AI.

📋 PROJECT DETAILS:
• SaaS tool using Claude AI for profile analysis
• 65% complete - frontend & backend structure already built
• Clean, well-documented codebase
• All dependencies installed
• Clear task list with 21 remaining items

💻 TECH STACK:
• Frontend: React 18, Vite, TailwindCSS, React Router
• Backend: Vercel Serverless Functions, Node.js
• Database: Vercel KV (Redis)
• AI: Anthropic Claude API
• Scraping: Puppeteer + Chromium
• Payment: Lemon Squeezy
• Email: Resend
• PDF: @react-pdf/renderer

✅ WHAT YOU'LL DO:
• Test and debug existing Claude API integration
• Deploy to Vercel + set up KV database
• Update ResultsPage for lock/unlock payment flow
• Integrate Lemon Squeezy payment system
• Set up email templates (Resend)
• End-to-end testing (free & paid flows)
• Mobile responsive testing
• Bug fixes

⏱️ TIMELINE: 1-2 weeks
💰 BUDGET: PKR 25,000-30,000 (Fixed Price, Milestone-based)

🎯 REQUIRED SKILLS:
✓ React.js + React Router (2+ years)
✓ Node.js + API development
✓ Vercel deployment experience
✓ Payment integration (Stripe/Lemon Squeezy)
✓ Git/GitHub workflow
✓ English communication

⭐ BONUS SKILLS:
• AI API integration (OpenAI/Anthropic)
• Puppeteer/web scraping
• Redis/KV databases
• PDF generation
• Email APIs

📝 TO APPLY:
Send me:
1. Portfolio/GitHub link
2. Experience with Vercel deployments (Yes/No)
3. Experience with payment integrations (Yes/No)
4. Your hourly rate in PKR
5. Availability to start

💼 PAYMENT STRUCTURE:
• Milestone 1 (PKR 10,000): Backend testing + Vercel deployment
• Milestone 2 (PKR 10,000): Frontend updates + payment integration
• Milestone 3 (PKR 10,000): Testing complete + bugs fixed
• Bonus PKR 5,000 if delivered early & bug-free

🔒 CONFIDENTIALITY:
NDA required before code access. All project details remain confidential.

Serious inquiries only. Must be available to start this week.

Looking forward to working with you!

#ReactDeveloper #FullStackDeveloper #NodeJS #Vercel #Pakistan #FreelanceWork #SaaS #RemoteWork
```

---

## 2. SCREENING QUESTIONS (Copy-Paste for Messages)

### Quick Filter Message (Send to Prospects)

```
Hi [Name],

I came across your profile and noticed your experience with React and Vercel.

I'm looking for a React/Node.js developer for a 15-20 hour SaaS project.

Quick questions:

1. Have you worked with Vercel deployments? (Yes/No)
2. Experience with payment integrations like Stripe/Lemon Squeezy? (Yes/No)
3. Have you integrated AI APIs (OpenAI, Anthropic, etc.)? (Yes/No)
4. Available to start this week? (Yes/No)
5. Your hourly rate in PKR?
6. Portfolio/GitHub link?

Budget: PKR 25,000-30,000 (fixed price) for complete project.

If interested, I can share more details.

Thanks,
Abdul
```

### Technical Screening Call Questions (15 min)

**Question 1: React + API Integration**
"I have a React app that needs to call a Vercel API function. How would you structure that?"

✅ Good Answer: Mentions fetch/axios, error handling, environment variables, CORS, async/await

❌ Bad Answer: Vague or suggests jQuery, no mention of error handling


**Question 2: JSON Parsing Issue**
"My API response is sometimes pure JSON, sometimes wrapped in markdown code blocks like ```json. How would you fix this?"

✅ Good Answer: String parsing, regex to strip markers (```json and ```), JSON.parse with try/catch, handle edge cases

❌ Bad Answer: "Just use JSON.parse" without handling the markdown


**Question 3: Payment Flow**
"I need to accept payments via Lemon Squeezy and unlock content after payment. What's your approach?"

✅ Good Answer: Webhook verification, signature validation, database flag update (isPaid: true), conditional rendering in frontend, security considerations

❌ Bad Answer: Just redirecting after payment, no webhook mention


**Question 4: Security**
"How would you securely store API keys in a Vercel project?"

✅ Good Answer: Environment variables, .env.local for local development, Vercel dashboard for production, never commit to git, .gitignore

❌ Bad Answer: Hard-coding in files, committing .env to repo


**Question 5: Deployment**
"Walk me through deploying a React + API project to Vercel."

✅ Good Answer: Install Vercel CLI, vercel login, vercel command, configure build settings (vite build), set env vars, vercel --prod, api folder for serverless functions

❌ Bad Answer: Just "upload files" or very vague

---

## 3. DEVELOPER ONBOARDING BRIEF

### MoxiePro - Development Brief
**Confidential - For Hired Developer Only**

---

#### PROJECT OVERVIEW

**What is MoxiePro?**
A SaaS tool that helps therapists audit and optimize their Psychology Today profiles using AI-powered analysis.

**Business Model:**
- Free: Basic audit with overall score + 3 vague issues
- $14.99: Full PDF audit with 11 detailed sections
- Future: $297 done-for-you optimization service

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

---

#### PAYMENT MILESTONES

**Milestone 1: PKR 10,000**
- Vercel deployment successful
- KV database created
- Backend APIs working
- Can create audit via API
- Payment: After I verify deployment

**Milestone 2: PKR 10,000**
- Frontend updated (ResultsPage lock/unlock)
- Payment integration working
- Email templates created
- Payment: After I verify payment flow

**Milestone 3: PKR 10,000**
- All testing complete
- All bugs fixed
- Mobile responsive
- Documentation updated
- Payment: After final approval

**Bonus: PKR 5,000**
- If delivered early (< 12 days)
- Zero critical bugs
- Clean code review

**Total: PKR 30,000 + PKR 5,000 bonus**

---

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
   - NOTES.md (full implementation plan)
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

#### SUPPORT & COMMUNICATION

**Preferred Communication:**
- WhatsApp: [Your Number]
- Email: [Your Email]
- GitHub: Comments on commits/PRs

**Response Time:**
- I'll respond within 12 hours
- You respond within 24 hours
- Daily progress updates expected

**Questions?**
Ask anytime! I want this to be smooth for both of us.

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

---

#### CONFIDENTIALITY

**Remember:**
- This project is confidential
- Don't share code, concept, or screenshots publicly
- Don't reuse code for other projects
- Don't discuss on social media
- Delete all files after completion
- NDA violation = PKR 500,000 penalty

**After Project:**
- You can list "SaaS Development" in portfolio (generic)
- Cannot mention MoxiePro or specifics
- Cannot compete with this product for 1 year

---

**Let's build something great! 🚀**

---

## 4. NDA / CONFIDENTIALITY AGREEMENT

### NON-DISCLOSURE AGREEMENT (NDA)
**For MoxiePro Development Project**

---

**This Agreement is entered into on:** _________________ (Date)

**Between:**

**Party 1 (Disclosing Party):**
- Name: Abdul
- Company: Clarity Design Co.
- Email: _____________________
- Address: _____________________

**Party 2 (Receiving Party / Developer):**
- Name: _____________________
- Email: _____________________
- Phone: _____________________
- CNIC/ID: _____________________
- Address: _____________________

---

#### 1. CONFIDENTIAL INFORMATION

The Receiving Party acknowledges that they will have access to confidential and proprietary information including but not limited to:

- Source code and software architecture
- Business model and revenue strategy
- AI prompts and algorithms
- Customer data and user information
- API keys and credentials
- Marketing strategies
- Product roadmap and features
- Any other information related to MoxiePro

---

#### 2. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party agrees to:

**2.1 Confidentiality**
- Keep all confidential information strictly confidential
- Not disclose to any third party without written permission
- Not discuss project details on social media or public forums
- Not share screenshots, code snippets, or documentation publicly

**2.2 Limited Use**
- Use confidential information ONLY for completing assigned development tasks
- Not use for personal projects or other clients
- Not reverse engineer or copy the business model
- Not create competing products or services

**2.3 Security**
- Store all project files securely
- Use password-protected devices
- Not use public computers or networks for development
- Immediately report any security breaches

**2.4 File Deletion**
- Delete ALL project files from all devices after project completion
- Confirm deletion in writing
- Not retain any copies (code, docs, screenshots, backups)

---

#### 3. NON-COMPETE CLAUSE

The Receiving Party agrees NOT to:

- Create, develop, or participate in any competing product for **1 year** after project completion
- Work on similar Psychology Today profile optimization tools
- Use the business model or concepts for other projects
- Consult for competitors in this space

**Competing products include:**
- Psychology Today profile auditing tools
- Therapist profile optimization services
- Similar AI-powered profile analysis platforms

---

#### 4. INTELLECTUAL PROPERTY

**4.1 Ownership**
- ALL code, designs, and work product belong to the Disclosing Party (Abdul/Clarity Design Co.)
- Receiving Party has NO ownership rights
- All intellectual property rights remain with Disclosing Party

**4.2 Work for Hire**
- This is a "work for hire" agreement
- All deliverables are the exclusive property of Disclosing Party
- Receiving Party cannot claim authorship or use work in portfolio (beyond generic description)

---

#### 5. PERMITTED PORTFOLIO USE

**Receiving Party MAY:**
- List "SaaS Development using React, Node.js, Claude AI" in portfolio (generic)
- Mention "Developed AI-powered web application" without specifics

**Receiving Party MAY NOT:**
- Mention "MoxiePro" or "Psychology Today" by name
- Show screenshots or code samples
- Describe specific features or business model
- Link to the live application

---

#### 6. RETURN OF MATERIALS

Upon project completion or termination, Receiving Party must:

- Delete all project files from all devices (laptop, phone, cloud storage)
- Confirm deletion via email within 24 hours
- Not retain any copies, backups, or derivatives
- Return any physical materials (if applicable)

---

#### 7. BREACH & PENALTIES

**7.1 Breach**
A breach occurs if Receiving Party:
- Discloses confidential information
- Creates competing product
- Shares code or screenshots publicly
- Fails to delete files after completion
- Violates any term of this agreement

**7.2 Penalties**
In case of breach, Receiving Party agrees to pay:

- **PKR 500,000** as liquidated damages
- Plus actual damages suffered by Disclosing Party
- Plus legal fees and court costs
- Immediate termination without payment for remaining work

**7.3 Legal Action**
- Disputes resolved under Pakistani law
- Jurisdiction: Courts of [Your City], Pakistan
- Disclosing Party may seek injunctive relief

---

#### 8. DURATION

This agreement remains in effect:

- During development period
- For **2 years** after project completion for confidentiality
- For **1 year** after project completion for non-compete
- Indefinitely for intellectual property ownership

---

#### 9. INDEPENDENT CONTRACTOR

- Receiving Party is an independent contractor, not an employee
- No employment relationship exists
- Receiving Party responsible for own taxes
- No benefits provided

---

#### 10. ENTIRE AGREEMENT

- This agreement constitutes the entire understanding
- Supersedes all prior discussions or agreements
- Can only be modified in writing signed by both parties
- If any provision is invalid, others remain in effect

---

#### 11. PAYMENT TERMS

Payment is contingent upon:
- Compliance with this NDA
- Satisfactory completion of work
- No breaches of confidentiality
- Proper file deletion after completion

Breach of this NDA may result in:
- Withholding of payment
- Termination without cause
- Legal action for damages

---

### SIGNATURES

**By signing below, both parties agree to all terms and conditions of this Non-Disclosure Agreement.**

---

**DISCLOSING PARTY (Abdul / Clarity Design Co.):**

Signature: _________________________

Name: Abdul

Date: _________________________

Email: _________________________

---

**RECEIVING PARTY (Developer):**

Signature: _________________________

Printed Name: _________________________

Date: _________________________

Email: _________________________

Phone: _________________________

CNIC/ID Number: _________________________

---

**WITNESS (Optional but Recommended):**

Signature: _________________________

Name: _________________________

Date: _________________________

---

### ACKNOWLEDGMENT

I, _________________________ (Developer Name), acknowledge that:

1. I have read and understood this entire agreement
2. I agree to all terms and conditions
3. I understand the penalties for breach
4. I will maintain strict confidentiality
5. I will delete all files after completion
6. I will not compete for 1 year
7. I sign this voluntarily

Developer Signature: _________________________

Date: _________________________

---

**INSTRUCTIONS FOR USE:**

1. Print 2 copies of this NDA
2. Fill in all blanks
3. Both parties sign both copies
4. Each party keeps one signed copy
5. Optional: Have it notarized for extra legal weight
6. Scan and email copy to developer before sharing code

**OR use digital signature:**
1. Send PDF via DocuSign, HelloSign, or email
2. Developer signs electronically
3. Keep signed PDF copy safe
4. Valid as legal contract in Pakistan

---

**⚠️ IMPORTANT:** Have developer sign this BEFORE giving GitHub access or sharing any code!

---

## 5. GITHUB SETUP INSTRUCTIONS

### Creating Developer Branch

**I'll create the branch now. Here's what will be set up:**

```bash
# Branch name: developer-work
# Branch protection: You review all merges
# Developer access: Collaborator (not admin)
```

**After hiring, you'll:**
1. Go to GitHub repo settings
2. Add developer's GitHub username as Collaborator
3. Set role to "Write" (not Admin)
4. Developer clones repo and works on `developer-work` branch

---

## 6. PRE-HIRING CHECKLIST

**Before reaching out to developers:**

- [ ] Read through this entire document
- [ ] Prepare LinkedIn post (copy from Section 1)
- [ ] Prepare screening questions (Section 2)
- [ ] Have NDA ready to send (Section 4)
- [ ] Create test API accounts:
  - [ ] Anthropic Claude API ($5 credit limit)
  - [ ] Vercel account (developer role)
  - [ ] Lemon Squeezy (test mode)
  - [ ] Resend (test API key)
- [ ] Decide final budget (PKR 25k-30k recommended)
- [ ] GitHub branch created (will do next)
- [ ] Prepared to respond to candidates quickly

**After finding candidates:**

- [ ] Send screening questions
- [ ] Schedule 15-min call with top 3
- [ ] Ask technical questions
- [ ] Check portfolio/GitHub
- [ ] Send NDA to finalist
- [ ] Get signed NDA back
- [ ] Add to GitHub as collaborator
- [ ] Share developer brief (Section 3)
- [ ] Provide test API keys
- [ ] Kickoff call to align on tasks

---

## 7. QUICK REFERENCE

### What to Post
- LinkedIn job post (Section 1)
- Pakistan developer Facebook groups
- Rozee.pk
- Mustakbil.com

### How to Screen
1. Send screening questions (Section 2)
2. Review portfolio/GitHub
3. 15-min technical call
4. Optional: Paid test task (PKR 2,000)

### What to Share
- **Before NDA:** README.md, task list only
- **After NDA:** GitHub access, .env.example, brief
- **Never share:** Production keys, passwords, personal accounts

### Payment Schedule
- Milestone 1: PKR 10,000 (Backend + deployment)
- Milestone 2: PKR 10,000 (Frontend + payment)
- Milestone 3: PKR 10,000 (Testing + bugs)
- Bonus: PKR 5,000 (Early + bug-free)

### Red Flags
- No portfolio
- Asks for 100% upfront
- Wants admin access
- Can't answer technical questions
- Too cheap (PKR 500/hr)

---

**You're ready to hire! 🎯**

**Estimated timeline:**
- Finding developer: 2-3 days
- Development: 7-14 days
- Testing: 2-3 days
- **Total: ~2-3 weeks to launch**

Good luck! 🚀
