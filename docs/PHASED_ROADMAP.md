# Furniture Ecosystem — Phased Implementation Roadmap

*Version 3.0 | February 2026*

---

## Overview

This roadmap extends the existing parametric table configurator MVP into a full furniture ecosystem. Each phase has clear deliverables, dependencies, and decision points.

**Philosophy:** Ship incrementally. Each phase delivers standalone value while building toward the full vision.

---

## Current State (MVP)

### What We Have

| Component | Status | Notes |
|-----------|--------|-------|
| Parametric table configurator | ✅ Working | 6 styles, all geometry complete |
| 3D preview with R3F | ✅ Working | Orbit, pan, zoom, explosion view |
| Complex geometry (splayed legs, compound angles) | ✅ Working | Key technical challenge solved |
| Trestle table assembly | ✅ Working | Foot/leg/head/stretcher |
| Mission style slats | ✅ Working | End panel slat geometry |
| Validation engine | ✅ Basic | Dimensions, structural rules |
| Export panel | ⚠️ Skeleton | UI exists, calculations incomplete |
| Deployed to Vercel | ✅ Live | GitHub integration |

### What's Missing for Phase 1

- No user accounts / authentication
- No design persistence (save/load)
- Validation messages are generic, not educational
- No knowledge-powered explanations
- Cut list calculations incomplete
- No high-quality texture rendering

---

## Phase 1: Foundation (8-10 weeks)

**Goal:** Add user accounts, design persistence, and initial knowledge integration. Make the configurator production-ready for individual users.

### 1.1 Authentication & User Accounts (Week 1-2)

**Deliverables:**
- [ ] Clerk integration for authentication
- [ ] OAuth (Google, Apple) + email/password
- [ ] User profile page (basic)
- [ ] Protected routes

**Technical:**
```
Frontend:
- Install @clerk/clerk-react
- Add ClerkProvider to App
- Create sign-in/sign-up pages
- Add user menu to header

Backend (new):
- Set up Fastify server (Railway)
- Clerk webhook handler for user sync
- PostgreSQL database schema (users table)
```

### 1.2 Backend Infrastructure (Week 1-2, parallel)

**Deliverables:**
- [ ] Node.js/Fastify API server
- [ ] PostgreSQL database
- [ ] tRPC for type-safe API
- [ ] Basic API structure

**Technical:**
```
/api
├── /users (CRUD)
├── /designs (save, load, list, delete)
└── /health
```

### 1.3 Design Persistence (Week 3-4)

**Deliverables:**
- [ ] Save design (parameters → database)
- [ ] Load design (restore full state)
- [ ] My Designs library page
- [ ] Auto-save (debounced)
- [ ] Design naming and metadata
- [ ] Thumbnail generation

**Data Model:**
```typescript
interface SavedDesign {
  id: string
  userId: string
  name: string
  params: TableParams
  thumbnail: string
  createdAt: Date
  updatedAt: Date
}
```

### 1.4 Knowledge Base Foundation (Week 3-6)

**Deliverables:**
- [ ] Knowledge domain structure (TypeScript interfaces)
- [ ] Structured data: wood species (50+)
- [ ] Structured data: joinery rules and formulas
- [ ] Structured data: style definitions (10+)
- [ ] Original technique explanations (20+)

**Directory Structure:**
```
src/knowledge/
├── domains/
│   ├── species/
│   │   ├── types.ts
│   │   └── data.ts        # 50+ species
│   ├── joinery/
│   │   ├── types.ts
│   │   └── rules.ts       # Formulas, when-to-use
│   ├── styles/
│   │   ├── types.ts
│   │   └── definitions.ts # Period characteristics
│   └── techniques/
│       └── explanations.ts
└── index.ts               # Unified access
```

### 1.5 Knowledge-Powered UI (Week 5-7)

**Deliverables:**
- [ ] Parameter tooltips with context
  - "Apron Height: Typical 3.5-4.5\" for dining. Affects knee clearance and tenon strength."
- [ ] Enhanced validation messages
  - "2\" legs on 36\" table may appear thin. Shaker proportions suggest 2.5\"+"
- [ ] Style preset explanations
  - "Shaker: Clean lines, tapered inside faces only (visual stability), minimal ornamentation."
- [ ] Wood species info panel
  - Properties, workability, typical uses

### 1.6 RAG Pipeline (Week 6-8)

**Deliverables:**
- [ ] Vector database setup (Pinecone)
- [ ] Embedding pipeline for content
- [ ] Semantic search API
- [ ] Basic Q&A endpoint

**API:**
```
POST /knowledge/ask
{
  "question": "Why does Shaker furniture taper legs on inside faces only?",
  "context": { /* current design state */ }
}
→
{
  "answer": "Traditional Shaker furniture tapers legs on the two inside faces only. This maintains a square appearance from the front while reducing visual weight...",
  "sources": [...]
}
```

### 1.7 Chat Assistant (Week 7-9)

**Deliverables:**
- [ ] Chat panel in configurator sidebar
- [ ] Context-aware responses (knows current design)
- [ ] Source citations
- [ ] Suggested questions

### 1.8 Testing & Polish (Week 9-10)

**Deliverables:**
- [ ] Knowledge accuracy review
- [ ] User flow testing
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Documentation update

### Phase 1 Success Metrics

- Users can sign up, save, and load designs
- Knowledge tooltips available for all parameters
- Chat assistant answers 80%+ of common woodworking questions
- RAG retrieval relevance > 85%
- Page load < 2s, interaction response < 100ms

### Phase 1 Dependencies

None (foundational phase)

### Phase 1 Decisions Needed

| Decision | Options | Impact |
|----------|---------|--------|
| Vector DB | Pinecone vs Weaviate | Cost, features |
| Backend hosting | Railway vs Render | Cost, DX |
| State management | Keep Context vs migrate to Zustand | Code complexity |

### Phase 1 Risks

| Risk | Probability | Mitigation |
|------|-------------|------------|
| RAG quality insufficient | Medium | Iterative improvement, hybrid retrieval |
| Clerk integration issues | Low | Well-documented, good support |
| Knowledge content creation bottleneck | Medium | Prioritize P0 content, parallelize |

---

## Phase 2: Plan Builder (6-8 weeks)

**Goal:** Generate professional, buildable construction documents from any design.

### 2.1 Cut List Engine (Week 1-3)

**Deliverables:**
- [ ] Accurate dimension calculations for all parts
- [ ] Board feet calculations
- [ ] Species-specific annotations
  - "Quartersawn preferred for stability"
  - "Allow 1/16\" for seasonal movement"
- [ ] Grain direction recommendations
- [ ] Rough lumber sizing (adds milling allowance)

### 2.2 Joinery Documentation (Week 2-4)

**Deliverables:**
- [ ] Dimensioned joint drawings (2D)
- [ ] Mortise/tenon calculations from knowledge base
- [ ] Step-by-step cutting instructions
- [ ] Tool requirements per joint
- [ ] Common mistakes to avoid

**Example Output:**
```
MORTISE & TENON: Leg-to-Apron Joint
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tenon: 1/4" × 3" × 2-5/8"
Mortise: 1/4" × 3-1/8" × 2-11/16" (1/16" clearance)

CUTTING SEQUENCE:
1. Mark mortise locations on all four legs
2. Rough out mortises with drill press or router
...
```

### 2.3 Assembly Instructions (Week 3-5)

**Deliverables:**
- [ ] Sequenced assembly steps (from knowledge base)
- [ ] Glue-up strategy and timing
- [ ] Clamping diagram
- [ ] Dry-fit checkpoints
- [ ] Finishing recommendations

### 2.4 2D Shop Drawings (Week 4-6)

**Deliverables:**
- [ ] Orthographic views (front, side, top)
- [ ] Dimensioned drawings
- [ ] Exploded view diagram
- [ ] Detail callouts for joinery

**Technical:** Use SVG generation or Canvas-based drawing

### 2.5 CNC Export (Week 5-7)

**Deliverables:**
- [ ] DXF export for flat parts
- [ ] SVG export alternative
- [ ] Nested layout for sheet goods (if applicable)
- [ ] Toolpath notes

### 2.6 PDF Generation (Week 6-8)

**Deliverables:**
- [ ] Multi-page professional document
- [ ] Cover with 3D render
- [ ] Table of contents
- [ ] All sections integrated
- [ ] Download as single PDF or ZIP

**Technical:**
- Use jsPDF + jspdf-autotable for tables
- React-PDF for complex layouts
- Server-side generation for consistency

### Phase 2 Success Metrics

- Generated plans rated "buildable" by woodworkers > 90%
- Joinery dimensions accurate to 1/64"
- Assembly instructions follow logical sequence
- PDF generates in < 10 seconds

### Phase 2 Dependencies

- Phase 1 complete (auth, knowledge base)

### Phase 2 Decisions Needed

| Decision | Options | Impact |
|----------|---------|--------|
| PDF library | jsPDF vs React-PDF vs Puppeteer | Quality, complexity |
| 2D drawing approach | SVG vs Canvas vs PDF direct | Flexibility |
| CNC format priority | DXF vs SVG vs both | User needs |

---

## Phase 3: Marketplace Foundation (8-10 weeks)

**Goal:** Enable design sales and plan purchases.

### 3.1 Design Publishing (Week 1-2)

**Deliverables:**
- [ ] Public/private toggle for designs
- [ ] Design detail page (public view)
- [ ] For-sale toggle and pricing
- [ ] License terms selection

### 3.2 Design Store (Week 2-4)

**Deliverables:**
- [ ] Browse marketplace page
- [ ] Search and filters (style, type, price, complexity)
- [ ] Design preview (limited without purchase)
- [ ] Featured designs curation

### 3.3 Payments Integration (Week 3-5)

**Deliverables:**
- [ ] Stripe Checkout integration
- [ ] Plan package purchase flow
- [ ] Digital delivery (download link)
- [ ] Purchase history
- [ ] Receipts and invoices

### 3.4 Designer Payouts (Week 5-7)

**Deliverables:**
- [ ] Stripe Connect for designers
- [ ] Revenue split configuration (platform fee)
- [ ] Payout dashboard
- [ ] Tax document handling (1099)

### 3.5 Designer Profiles (Week 6-8)

**Deliverables:**
- [ ] Designer public profile page
- [ ] Portfolio showcase
- [ ] Bio and links
- [ ] Sales statistics (private)

### 3.6 Discovery & Recommendations (Week 7-9)

**Deliverables:**
- [ ] Knowledge-powered recommendations
  - "Based on your Shaker table, you might like..."
- [ ] Style similarity matching
- [ ] Trending designs
- [ ] New arrivals

### Phase 3 Success Metrics

- Designers can list and sell designs
- Consumers can purchase and download plans
- Payment flow completes successfully > 99%
- Average time to first purchase < 5 minutes

### Phase 3 Dependencies

- Phase 2 complete (plan generation)
- Stripe account with Connect capability

### Phase 3 Decisions Needed

| Decision | Options | Impact |
|----------|---------|--------|
| Platform fee | 10% vs 15% vs 20% | Designer economics |
| Plan pricing | Fixed vs designer-set vs tiered | Market dynamics |
| License types | Personal vs commercial | Legal complexity |

---

## Phase 4: Maker Network (8-10 weeks)

**Goal:** Connect consumers with makers who can build their designs.

### 4.1 Maker Onboarding (Week 1-3)

**Deliverables:**
- [ ] Maker signup flow
- [ ] Profile creation (shop, location, skills, tools)
- [ ] Portfolio upload
- [ ] Verification process (basic)

### 4.2 Maker Directory (Week 2-4)

**Deliverables:**
- [ ] Public maker directory
- [ ] Search by location, skills, style specialty
- [ ] Maker profile pages
- [ ] Contact/inquiry form

### 4.3 Project Posting (Week 4-6)

**Deliverables:**
- [ ] Consumer posts project from saved design
- [ ] Project requirements (deadline, location, notes)
- [ ] Knowledge-derived complexity assessment
- [ ] Project visibility to makers

### 4.4 Bidding System (Week 5-7)

**Deliverables:**
- [ ] Maker receives project notification
- [ ] Submit bid (price, timeline, message)
- [ ] Consumer reviews bids
- [ ] Accept bid / request revision
- [ ] Bid comparison tools

### 4.5 Project Management (Week 7-9)

**Deliverables:**
- [ ] Milestone creation and tracking
- [ ] Progress updates (text + photos)
- [ ] Messaging between consumer and maker
- [ ] Project status workflow

### 4.6 Payments & Escrow (Week 8-10)

**Deliverables:**
- [ ] Escrow for project payments
- [ ] Milestone-based release
- [ ] Dispute handling (basic)
- [ ] Completion and final payment

### Phase 4 Success Metrics

- Makers can create profiles and bid on projects
- Consumers can post projects and receive bids
- Projects complete successfully > 90%
- Average time from post to accepted bid < 7 days

### Phase 4 Dependencies

- Phase 3 complete (payments infrastructure)

### Phase 4 Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low initial maker supply | High | Marketplace empty | Targeted outreach, early maker incentives |
| Geographic mismatch | Medium | No local makers | Start in woodworking-dense regions |
| Quality disputes | Medium | Trust erosion | Clear terms, escrow, review system |

---

## Phase 5: Community & Reviews (6-8 weeks)

**Goal:** Build trust and engagement through reviews, ratings, and community features.

### 5.1 Review System (Week 1-3)

**Deliverables:**
- [ ] Rate completed projects (1-5 stars)
- [ ] Written reviews
- [ ] Photo uploads
- [ ] Review moderation

### 5.2 Reputation Scores (Week 2-4)

**Deliverables:**
- [ ] Maker rating algorithm
- [ ] Designer rating (based on plan quality feedback)
- [ ] Badges and achievements
- [ ] Trust indicators

### 5.3 Community Q&A (Week 4-6)

**Deliverables:**
- [ ] Question forum by topic
- [ ] Knowledge-moderated answers
- [ ] Upvoting/best answers
- [ ] Expert tagging

### 5.4 Notifications & Engagement (Week 5-7)

**Deliverables:**
- [ ] Email notifications (configurable)
- [ ] In-app notification center
- [ ] Activity feed
- [ ] Weekly digest

### 5.5 Social Features (Week 6-8)

**Deliverables:**
- [ ] Follow designers/makers
- [ ] Like/save designs
- [ ] Share to social media
- [ ] Design collections

### Phase 5 Success Metrics

- Review completion rate > 60%
- Community Q&A engagement growing month-over-month
- User return rate > 40% monthly

---

## Phase 6: Expansion & Polish (Ongoing)

**Goal:** Expand furniture types, enhance AI capabilities, optimize platform.

### 6.1 Additional Furniture Types

**Candidates (in priority order):**
1. Desks (similar to tables)
2. Benches (simpler geometry)
3. Chairs (complex, high value)
4. Cabinets (case construction)
5. Beds (frame construction)
6. Shelving (modular systems)

**Each requires:**
- Geometry components
- Style variations
- Knowledge content
- Plan generation logic

### 6.2 Enhanced AI Features

**Candidates:**
- [ ] Natural language design adjustments ("make it more rustic")
- [ ] Design critique and suggestions
- [ ] Voice interface for shop use
- [ ] AR assembly guidance (mobile)

### 6.3 Fine-Tuning Evaluation

After collecting production data:
- [ ] Analyze RAG failure cases
- [ ] Build evaluation dataset
- [ ] Assess fine-tuning ROI
- [ ] If warranted: train domain-specific model

### 6.4 Platform Optimization

- [ ] Performance optimization
- [ ] Mobile experience improvements
- [ ] Accessibility audit
- [ ] Internationalization (i18n)

---

## Timeline Summary

| Phase | Duration | Key Outcome |
|-------|----------|-------------|
| **Phase 1** | 8-10 weeks | Auth, persistence, knowledge integration |
| **Phase 2** | 6-8 weeks | Professional plan generation |
| **Phase 3** | 8-10 weeks | Design marketplace |
| **Phase 4** | 8-10 weeks | Maker network and bidding |
| **Phase 5** | 6-8 weeks | Reviews and community |
| **Phase 6** | Ongoing | Expansion and optimization |

**To knowledge-enhanced MVP with plans:** ~14-18 weeks (Phase 1-2)
**To marketplace:** ~30-38 weeks (Phase 1-4)
**To full platform:** ~10-12 months

---

## Parallel Work Streams

When resources allow, these can run in parallel:

```
Stream A: Backend & Infrastructure
├── Phase 1: Backend setup, auth
├── Phase 3: Payments integration
└── Phase 4: Escrow, notifications

Stream B: Knowledge & AI
├── Phase 1: Content curation, RAG
├── Phase 2: Plan knowledge integration
└── Phase 6: Fine-tuning evaluation

Stream C: Frontend & UX
├── Phase 1: Auth UI, design library
├── Phase 2: Plan viewer, PDF export
└── Phase 3-4: Marketplace UI

Stream D: Plan Generation
├── Phase 2: Cut lists, drawings, PDF
└── Phase 3: CNC export polish
```

---

## Decision Points Summary

### Before Phase 1

- [ ] Confirm vector DB choice (Pinecone recommended)
- [ ] Confirm backend hosting (Railway recommended)
- [ ] Content licensing strategy (start with original)

### Before Phase 3

- [ ] Platform fee structure
- [ ] License types for plans
- [ ] Pricing model (fixed vs flexible)

### Before Phase 4

- [ ] Maker verification requirements
- [ ] Geographic launch regions
- [ ] Dispute resolution process

### Before Phase 6 Fine-Tuning

- [ ] Review RAG performance data
- [ ] Calculate fine-tuning ROI
- [ ] Assess training data availability

---

## Risk Register

| Risk | Phase | Probability | Impact | Mitigation |
|------|-------|-------------|--------|------------|
| RAG quality insufficient | 1 | Medium | High | Iterative improvement, hybrid retrieval |
| Content creation bottleneck | 1 | Medium | Medium | Prioritize P0, parallelize writing |
| Plan accuracy issues | 2 | Medium | High | Woodworker review, user feedback loop |
| Low marketplace supply (designs) | 3 | Medium | High | Seed with quality designs |
| Low maker supply | 4 | High | High | Targeted outreach, incentives |
| Payment/escrow disputes | 4 | Medium | Medium | Clear terms, mediation process |
| LLM costs at scale | All | Medium | Medium | Caching, smaller models for simple queries |

---

## Immediate Next Steps

After roadmap approval:

### Week 1
- [ ] Set up Railway backend project
- [ ] Configure PostgreSQL database
- [ ] Integrate Clerk authentication
- [ ] Create knowledge domain folder structure

### Week 2
- [ ] Implement user sync (Clerk → database)
- [ ] Begin wood species database (top 30)
- [ ] Begin joinery rules documentation
- [ ] Set up Pinecone account

### Week 3
- [ ] Complete auth flow in frontend
- [ ] Implement design save/load API
- [ ] Complete species database (50+)
- [ ] Begin style definitions

### Week 4
- [ ] My Designs library UI
- [ ] Auto-save implementation
- [ ] Complete joinery rules
- [ ] Begin RAG pipeline

---

*This roadmap should be reviewed and updated at the start of each phase.*
