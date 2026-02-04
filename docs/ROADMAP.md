# Furniture Ecosystem — Phased Roadmap

## Overview

This roadmap prioritizes the **Knowledge Base as the foundation** — building deep woodworking intelligence first, then connecting it to every platform feature. The existing MVP configurator becomes the first integration point for this knowledge.

---

## Philosophy: Knowledge-First Development

**Traditional approach:** Build features → Add AI later
**Our approach:** Build intelligence → Features emerge from knowledge

This means:
- Phase 1 focuses on curating and structuring woodworking expertise
- Every subsequent feature is informed by this knowledge
- The platform becomes a woodworking expert, not just a geometry generator

---

## Current State (MVP)

**What We Have:**
- Parametric table configurator (React + TypeScript + Vite)
- 6 furniture styles with hardcoded presets
- Real-time 3D preview
- Basic validation (dimensions, structural rules)
- Basic cut list generation
- Deployed to Vercel

**What's Missing:**
- No explanation of *why* defaults are what they are
- Validation errors are generic ("too thin") not educational
- No connection to woodworking best practices
- No way to ask questions or get guidance

---

## Phase 1: Knowledge Base Foundation (6-8 weeks)

**Goal:** Build the woodworking intelligence layer that will power everything.

### 1.1 Domain Ontology & Data Models

**Deliverables:**
- [ ] Define knowledge domain structure (joinery, wood science, design, etc.)
- [ ] Create TypeScript interfaces for knowledge entities
- [ ] Design metadata schema for retrieval filtering
- [ ] Map relationships between concepts

**Key Data Structures:**
```typescript
// Define what we need to know
domains/
├── joinery/
│   ├── joints.ts          // Joint types, rules, formulas
│   ├── techniques.ts      // How-to knowledge
│   └── selection.ts       // When to use each joint
├── wood-science/
│   ├── species.ts         // Properties, workability
│   ├── movement.ts        // Expansion/contraction rules
│   └── selection.ts       // Species selection guidance
├── design/
│   ├── styles.ts          // Period styles, characteristics
│   ├── proportions.ts     // Golden ratio, visual balance
│   └── principles.ts      // Design fundamentals
├── construction/
│   ├── sequences.ts       // Assembly order
│   ├── techniques.ts      // Methods and approaches
│   └── troubleshooting.ts // Common problems, solutions
└── finishing/
    ├── types.ts           // Finish options
    ├── application.ts     // How to apply
    └── selection.ts       // When to use each
```

### 1.2 Content Curation (Foundational)

**Deliverables:**
- [ ] Audit available content sources
- [ ] Create initial structured data:
  - [ ] Wood species database (50+ species with full properties)
  - [ ] Joinery rules and formulas (all major joint types)
  - [ ] Style definitions (period characteristics, proportions)
  - [ ] Construction sequences (by furniture type)
- [ ] Write original technique explanations for core concepts
- [ ] Gather public domain / CC-licensed reference material

**Priority Content Areas:**

| Area | Priority | Content Type |
|------|----------|--------------|
| Joinery formulas | P0 | Structured rules (tenon sizing, mortise depth) |
| Wood movement | P0 | Calculations, species-specific data |
| Style characteristics | P0 | Period definitions, typical proportions |
| Species properties | P0 | Janka, movement, workability ratings |
| Technique explanations | P1 | How-to for common operations |
| Historical context | P2 | Period origins, influences |
| Troubleshooting | P2 | Common mistakes, solutions |

### 1.3 RAG Pipeline Setup

**Deliverables:**
- [ ] Set up vector database (Pinecone/Weaviate)
- [ ] Implement ingestion pipeline:
  - [ ] Text chunking with domain awareness
  - [ ] Metadata extraction (entities, topics)
  - [ ] Embedding generation
  - [ ] Index management
- [ ] Build retrieval system:
  - [ ] Semantic search
  - [ ] Metadata filtering
  - [ ] Hybrid search (vector + keyword)
  - [ ] Re-ranking for relevance
- [ ] Create knowledge API endpoints

**Technical Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│                     RAG PIPELINE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Content Input                                                   │
│  ├── Markdown files (curated content)                           │
│  ├── JSON (structured data like species, joints)                │
│  └── Future: PDF, web scraping                                  │
│                                                                  │
│  Processing                                                      │
│  ├── Chunking (preserve context, ~500 tokens)                   │
│  ├── Entity extraction (joints, species, tools)                 │
│  ├── Metadata tagging (domain, difficulty, source)              │
│  └── Embedding (text-embedding-3-large)                         │
│                                                                  │
│  Storage                                                         │
│  ├── Vector DB (embeddings + metadata)                          │
│  ├── PostgreSQL (structured knowledge tables)                   │
│  └── S3 (source documents)                                      │
│                                                                  │
│  Retrieval API                                                   │
│  ├── GET /knowledge/search?q=...&domain=joinery                 │
│  ├── GET /knowledge/joints/:type                                │
│  ├── GET /knowledge/species/:name                               │
│  └── POST /knowledge/ask (RAG-powered Q&A)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Configurator Integration (Initial)

**Deliverables:**
- [ ] Knowledge-powered parameter tooltips
  - Hover over "Apron Height" → "Typical 3.5-4.5\" for dining tables. Affects knee clearance and tenon strength."
- [ ] Validation explanations
  - Instead of "Invalid", show "2\" legs on 36\" wide table may appear thin. Shaker proportions suggest 2.5\"+"
- [ ] Style preset explanations
  - "Shaker: Clean lines, tapered legs (inside faces only for visual stability), minimal ornamentation"
- [ ] Basic Q&A panel
  - User types question → RAG retrieval → Claude response with sources

### 1.5 Testing & Validation

**Deliverables:**
- [ ] Knowledge accuracy review (expert validation)
- [ ] RAG retrieval quality metrics
- [ ] A/B test: with vs without explanations
- [ ] User feedback collection mechanism

**Dependencies:** None (foundational work)

**Risks:**
- Content licensing may limit sources
- RAG quality may require iteration
- Domain-specific chunking needs tuning

**Decision Points:**
- Vector DB selection (Pinecone vs Weaviate vs Qdrant)
- Content licensing strategy
- Quality threshold for launch

---

## Phase 2: Knowledge-Enhanced Configurator (4-6 weeks)

**Goal:** Deep integration of knowledge into the configurator experience.

### 2.1 AI Design Assistant

**Deliverables:**
- [ ] Chat interface in configurator sidebar
- [ ] Context-aware responses (knows current design state)
- [ ] Capabilities:
  - [ ] Answer woodworking questions
  - [ ] Explain current parameter choices
  - [ ] Suggest improvements
  - [ ] Compare styles/options
- [ ] Source citations in responses

**Example Interactions:**
```
User: "Why are the legs tapered on inside faces only?"
Assistant: "Traditional Shaker furniture tapers legs on the two
inside faces only. This maintains a square appearance from the
front while reducing visual weight. It also uses less material
and is easier to cut than four-sided tapers. Your current 2.5\"
legs tapering to 1.5\" follows authentic Shaker proportions."
[Source: Fine Woodworking #156, Shaker Style Guide]
```

### 2.2 Natural Language Configuration

**Deliverables:**
- [ ] Parse natural language into parameter changes
- [ ] "Make it more rustic" → increases leg thickness, adds breadboards, suggests through-tenons
- [ ] "Lighten it up" → reduces dimensions, suggests tapered legs, MCM style
- [ ] Explain changes before applying
- [ ] Undo/confirm workflow

### 2.3 Intelligent Defaults Engine

**Deliverables:**
- [ ] Replace hardcoded presets with knowledge-derived defaults
- [ ] Dynamic defaults based on:
  - [ ] Table dimensions (proportional rules)
  - [ ] Selected style (period-accurate)
  - [ ] Wood species (strength requirements)
  - [ ] Intended use (dining vs display)
- [ ] "Why this default?" explanations

### 2.4 Enhanced Validation

**Deliverables:**
- [ ] Structural validation with explanations
- [ ] Aesthetic validation (proportions, visual balance)
- [ ] Joinery validation (appropriate joints for context)
- [ ] Wood movement warnings
- [ ] Skill level assessment

**Example Validations:**
```
⚠️ PROPORTION WARNING
Apron height (3") is low for 72" table length.
Traditional proportions suggest 4-4.5" for visual balance.
[Adjust to 4"] [Keep current] [Learn more]

⚠️ WOOD MOVEMENT
36" solid top in red oak may expand up to 1/4" seasonally.
Current attachment method (screws) may cause cracking.
Consider: buttons, figure-8 fasteners, or elongated holes.
[Update attachment] [Learn more]
```

**Dependencies:** Phase 1 (knowledge base)

**Risks:**
- LLM latency in chat interface
- Prompt engineering complexity
- Balancing helpfulness vs annoyance

---

## Phase 3: Export & Plan Builder (4-6 weeks)

**Goal:** Generate professional, knowledge-rich construction documents.

### 3.1 Knowledge-Informed Cut Lists

**Deliverables:**
- [ ] Species-specific guidance per part
  - "Top boards: Quartersawn preferred for stability. Allow 1/16\" for movement."
- [ ] Grain direction recommendations
- [ ] Board selection tips
- [ ] Waste calculation with optimization suggestions

### 3.2 Joinery Detail Pages

**Deliverables:**
- [ ] Dimensioned joint drawings
- [ ] Step-by-step cutting instructions from knowledge base
- [ ] Tool requirements with alternatives
- [ ] Common mistakes to avoid
- [ ] Fit tolerance specifications

**Example Content:**
```
MORTISE & TENON: Leg-to-Apron Joint
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tenon: 1/4" × 3" × 2-5/8"
Mortise: 1/4" × 3-1/8" × 2-11/16" (1/16" clearance)

CUTTING SEQUENCE:
1. Mark mortise locations on all four legs
2. Rough out mortises with drill press or router
3. Square corners with 1/4" chisel
4. Cut tenon cheeks on table saw (1/4" reveal each side)
5. Cut tenon shoulders
6. Cut haunches (1/4" deep × 1/2" long)
7. Test fit - should slide with light hand pressure

COMMON MISTAKES:
• Mortise too shallow - tenon bottoms out
• Tenon too tight - splits mortise during glue-up
• Shoulders not square - gaps visible at joint
```

### 3.3 Assembly Instructions

**Deliverables:**
- [ ] Sequence derived from construction knowledge
- [ ] Step-by-step with images/diagrams
- [ ] Glue-up strategy and timing
- [ ] Clamping diagram
- [ ] Finishing recommendations by style/species

### 3.4 PDF Generation

**Deliverables:**
- [ ] Multi-page professional document
- [ ] Cover with 3D render
- [ ] Table of contents
- [ ] Parts list with knowledge annotations
- [ ] Joinery details
- [ ] Assembly instructions
- [ ] Finishing guide
- [ ] Tool list

**Dependencies:** Phase 1 (knowledge base), Phase 2 (enhanced configurator)

---

## Phase 4: Backend & User Accounts (4-6 weeks)

**Goal:** Add persistence, authentication, and prepare for marketplace.

### 4.1 Backend Infrastructure

**Deliverables:**
- [ ] Node.js API server
- [ ] PostgreSQL database
- [ ] Redis caching
- [ ] Knowledge API endpoints (if not already deployed)

### 4.2 Authentication

**Deliverables:**
- [ ] OAuth (Google, Apple)
- [ ] Email/password
- [ ] User profiles
- [ ] Preferences storage

### 4.3 Design Storage

**Deliverables:**
- [ ] Save/load designs
- [ ] Version history
- [ ] My Designs library
- [ ] Public/private toggle
- [ ] Fork designs

### 4.4 Knowledge Contribution System

**Deliverables:**
- [ ] Expert users can submit corrections
- [ ] Community knowledge contributions (moderated)
- [ ] Upvote/downvote on Q&A responses
- [ ] Feedback loop to improve RAG

**Dependencies:** Phase 1-3 (core product value established)

---

## Phase 5: Marketplace Foundation (6-8 weeks)

**Goal:** Enable design sales and maker connections.

### 5.1 Designer Features

**Deliverables:**
- [ ] Designer profiles/portfolios
- [ ] List designs for sale
- [ ] Pricing and licensing
- [ ] Sales dashboard
- [ ] Stripe Connect for payouts

### 5.2 Design Store

**Deliverables:**
- [ ] Browse/search marketplace
- [ ] Knowledge-powered recommendations
- [ ] Preview before purchase
- [ ] Checkout and download
- [ ] Purchase history

### 5.3 Maker Directory

**Deliverables:**
- [ ] Maker signup and profiles
- [ ] Portfolio showcase
- [ ] Skill/tool inventory
- [ ] Location-based search
- [ ] Knowledge-based matching (skills to project requirements)

### 5.4 Project Bidding

**Deliverables:**
- [ ] Post project for quotes
- [ ] Knowledge-generated complexity assessment
- [ ] Makers receive specs with skill requirements
- [ ] Quote submission
- [ ] Accept and start project

**Dependencies:** Phase 4 (backend, auth)

---

## Phase 6: Community & Full Marketplace (8-10 weeks)

**Goal:** Complete three-sided marketplace with community.

### 6.1 Project Management
### 6.2 Reputation System
### 6.3 Community Features
### 6.4 Advanced Discovery

(Details as in previous roadmap)

**Dependencies:** Phase 5

---

## Phase 7: Advanced AI & Scale (Ongoing)

**Goal:** Expand knowledge and AI capabilities.

### 7.1 Fine-Tuning Evaluation

After collecting user interactions in Phases 2-4:
- [ ] Analyze RAG performance gaps
- [ ] Build evaluation dataset from interactions
- [ ] Assess fine-tuning ROI
- [ ] If warranted: train domain-specific model

### 7.2 Advanced Features

- [ ] Voice interface for shop use
- [ ] AR assembly guidance
- [ ] Video tutorial integration
- [ ] Real-time build assistance

### 7.3 Knowledge Expansion

- [ ] Additional furniture types
- [ ] Regional style variations
- [ ] Advanced techniques
- [ ] Tool-specific guidance

---

## Timeline Summary

| Phase | Duration | Key Outcome |
|-------|----------|-------------|
| **Phase 1** | 6-8 weeks | Knowledge base foundation |
| **Phase 2** | 4-6 weeks | AI-enhanced configurator |
| **Phase 3** | 4-6 weeks | Knowledge-rich plan export |
| **Phase 4** | 4-6 weeks | Backend and user accounts |
| **Phase 5** | 6-8 weeks | Marketplace foundation |
| **Phase 6** | 8-10 weeks | Full marketplace |
| **Phase 7** | Ongoing | Advanced AI, scale |

**Total to knowledge-enhanced MVP: ~14-20 weeks (Phase 1-3)**
**Total to marketplace: ~9-12 months**

---

## Phase 1 Detailed Task Breakdown

### Week 1-2: Foundation

```
[ ] Domain Ontology
    [ ] Define knowledge domains and subdomains
    [ ] Create TypeScript interfaces for all entity types
    [ ] Design metadata schema
    [ ] Document relationships between concepts

[ ] Infrastructure Setup
    [ ] Set up vector database account (Pinecone/Weaviate)
    [ ] Create ingestion pipeline skeleton
    [ ] Set up PostgreSQL for structured knowledge
    [ ] Create knowledge API project structure
```

### Week 3-4: Core Content

```
[ ] Structured Data Creation
    [ ] Wood species database (50+ species)
        [ ] Properties (Janka, movement, workability)
        [ ] Characteristics and common uses
        [ ] Price ranges and availability
    [ ] Joinery rules database
        [ ] All major joint types
        [ ] Formulas (tenon sizing, etc.)
        [ ] When-to-use guidance
        [ ] Tool requirements
    [ ] Style definitions
        [ ] 10+ historical/contemporary styles
        [ ] Characteristics and proportions
        [ ] Typical materials and joinery

[ ] Technique Content
    [ ] Write 20+ core technique explanations
    [ ] Create troubleshooting guides
    [ ] Document construction sequences
```

### Week 5-6: RAG Pipeline

```
[ ] Ingestion Pipeline
    [ ] Implement chunking with domain awareness
    [ ] Build entity extraction
    [ ] Create embedding pipeline
    [ ] Implement batch processing

[ ] Retrieval System
    [ ] Implement semantic search
    [ ] Add metadata filtering
    [ ] Build hybrid search
    [ ] Create re-ranking logic

[ ] Knowledge API
    [ ] GET /knowledge/search
    [ ] GET /knowledge/species/:name
    [ ] GET /knowledge/joints/:type
    [ ] POST /knowledge/ask
```

### Week 7-8: Integration & Testing

```
[ ] Configurator Integration
    [ ] Knowledge-powered tooltips
    [ ] Validation explanations
    [ ] Style preset descriptions
    [ ] Basic Q&A panel

[ ] Quality Assurance
    [ ] Expert review of content accuracy
    [ ] RAG retrieval testing
    [ ] User testing (internal)
    [ ] Performance optimization
```

---

## Content Acquisition: Immediate Actions

### What We Can Create Now

1. **Structured databases** (no licensing needed)
   - Wood species properties (public data)
   - Joinery formulas (standard woodworking math)
   - Dimensional standards (ergonomics, clearances)

2. **Original content**
   - Technique explanations in our own words
   - Style guides based on research
   - Troubleshooting from common knowledge

3. **Public domain / CC content**
   - Historical references
   - Government publications (Forest Products Lab)
   - Open educational resources

### What Requires Licensing

1. **Publication archives** (Fine Woodworking, Popular Woodworking)
2. **Book excerpts** (specific technique descriptions)
3. **Images and diagrams** (unless we create our own)

### Recommended Starting Point

**Create original content first.** This:
- Avoids licensing delays
- Ensures consistent voice
- Allows full control
- Can be supplemented with licensed content later

---

## Success Metrics

### Phase 1
- Knowledge base covers 80% of configurator parameter decisions
- RAG retrieval relevance > 85% on test queries
- Tooltips/explanations available for all parameters

### Phase 2
- Chat assistant can answer 90% of common woodworking questions
- Natural language successfully modifies designs > 80% of attempts
- User satisfaction with explanations > 4/5

### Phase 3
- Generated plans rated "buildable" by woodworkers > 90%
- Joinery dimensions accurate to 1/64"
- Assembly instructions follow logical sequence

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Content licensing delays | High | Medium | Start with original content |
| RAG quality insufficient | High | Medium | Iterative improvement, hybrid approaches |
| LLM costs at scale | Medium | Medium | Caching, efficient prompts, smaller models for simple queries |
| Domain accuracy | High | Low | Expert review, user feedback |
| Scope creep in knowledge | Medium | High | Prioritize P0 content, defer expansions |

---

## Immediate Next Steps

After plan approval:

1. **This week:**
   - Create knowledge domain folder structure
   - Start wood species database
   - Set up Pinecone/Weaviate account
   - Begin joinery rules documentation

2. **Next week:**
   - Complete species database (top 50)
   - Complete joinery rules
   - Start RAG pipeline implementation
   - Begin style definitions

3. **Week 3:**
   - First RAG integration test
   - Configurator tooltip integration
   - Content expansion

---

*Document Version: 2.0 (Knowledge-First Revision)*
*Last Updated: 2026-02-04*
