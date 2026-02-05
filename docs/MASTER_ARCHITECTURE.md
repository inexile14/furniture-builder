# Furniture Ecosystem — Master Architecture Document

*Version 3.0 | February 2026*

---

## Executive Summary

This document defines the technical architecture for a furniture design ecosystem connecting three audiences: **consumers** who want beautiful custom furniture, **designers** who create stunning pieces, and **makers** who have craft skills to build them. The platform's core differentiator is **deep woodworking intelligence** — not just parametric geometry, but authentic knowledge that informs every interaction.

The existing parametric table configurator MVP becomes the foundation for Phase 1, extended with knowledge integration and user accounts before expanding to the full marketplace vision.

---

## 1. Platform Vision & Components

### 1.1 The Ecosystem

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         FURNITURE ECOSYSTEM PLATFORM                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   CONSUMERS                    DESIGNERS                    MAKERS               │
│   ─────────                    ─────────                    ──────               │
│   • Configure furniture        • Create designs             • Bid on projects    │
│   • Purchase plans             • Share/sell designs         • Build pieces       │
│   • Commission builds          • Build portfolio            • Collect reviews    │
│   • Manage projects            • Earn revenue               • Grow business      │
│                                                                                  │
│         │                           │                            │              │
│         └───────────────────────────┼────────────────────────────┘              │
│                                     │                                            │
│                                     ▼                                            │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │                        ★ PLATFORM CORE ★                                │   │
│   │                                                                          │   │
│   │   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │   │
│   │   │CONFIGURATOR│  │  RENDERER  │  │PLAN BUILDER│  │MARKETPLACE │       │   │
│   │   │            │  │            │  │            │  │            │       │   │
│   │   │ Parametric │  │Photorealistic│ │ Cut Lists │  │   Design   │       │   │
│   │   │  Design    │  │     3D     │  │   Plans    │  │   Sales    │       │   │
│   │   │            │  │            │  │    CNC     │  │  Project   │       │   │
│   │   │            │  │            │  │            │  │  Bidding   │       │   │
│   │   └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘       │   │
│   │         │               │               │               │              │   │
│   │         └───────────────┴───────────────┴───────────────┘              │   │
│   │                                 │                                       │   │
│   │                                 ▼                                       │   │
│   │   ┌─────────────────────────────────────────────────────────────────┐  │   │
│   │   │                                                                  │  │   │
│   │   │              ★ WOODWORKING KNOWLEDGE BASE ★                     │  │   │
│   │   │                                                                  │  │   │
│   │   │   The Intelligence Layer — Informs Every Module                 │  │   │
│   │   │                                                                  │  │   │
│   │   │   • Historical Styles & Periods    • Wood Science & Movement    │  │   │
│   │   │   • Joinery Rules & Formulas       • Construction Techniques    │  │   │
│   │   │   • Proportional Systems           • Tool Requirements          │  │   │
│   │   │   • Design Principles              • Finishing Knowledge        │  │   │
│   │   │                                                                  │  │   │
│   │   └─────────────────────────────────────────────────────────────────┘  │   │
│   │                                                                          │   │
│   │   ┌─────────────────────────────────────────────────────────────────┐   │   │
│   │   │                      SHARED SERVICES                             │   │   │
│   │   │                                                                  │   │   │
│   │   │   Auth │ Users │ Storage │ Payments │ Messaging │ Notifications │   │   │
│   │   └─────────────────────────────────────────────────────────────────┘   │   │
│   │                                                                          │   │
│   │   ┌─────────────────────────────────────────────────────────────────┐   │   │
│   │   │                    COMMUNITY & NETWORK                           │   │   │
│   │   │                                                                  │   │   │
│   │   │   Profiles │ Portfolios │ Reviews │ Messaging │ Project Mgmt    │   │   │
│   │   └─────────────────────────────────────────────────────────────────┘   │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Module Definitions

#### A. Configurator (Web App)

**Purpose:** Parametric furniture designer powered by deep woodworking knowledge.

**Capabilities:**
- Select furniture type (table, chair, cabinet, bed, etc.)
- Choose historical/contemporary style (Shaker, Mission, Mid-Century, etc.)
- Customize all parameters: dimensions, proportions, joinery, profiles, wood species
- AI assistant for design guidance and natural language adjustments
- Real-time validation with educational explanations
- Access curated design library

**Current State (MVP):**
- Table configurator with 6 styles (Shaker, Mid-Century, Farmhouse, Japandi, Trestle, Mission)
- React + TypeScript + Vite + React Three Fiber
- Complex geometry working (splayed legs, compound angles, trestle assemblies)
- Basic validation engine

#### B. Photorealistic Renderer

**Purpose:** Best-in-class visualization of configured furniture.

**Capabilities:**
- Real-time preview (current R3F implementation)
- High-quality export rendering (ray-traced, production stills)
- Accurate wood grain textures per species
- Finish representation (oil, lacquer, wax sheens)
- Environment/room context rendering
- Multiple camera angles and presets

**Architecture Decision:** Two-tier rendering
1. **Real-time (R3F):** Fast preview during configuration
2. **Production (Server-side):** Blender/Three.js headless for marketing-quality images

#### C. Plan Builder

**Purpose:** Generate professional, buildable construction documents.

**Outputs:**
- **Cut List:** Dimensioned parts with species-specific guidance (grain direction, movement allowances)
- **Shop Drawings:** 2D orthographic views with joinery details
- **CNC Files:** DXF/SVG optimized for CAM software
- **Assembly Instructions:** Sequenced steps with knowledge-derived tips
- **Material List:** Board feet calculations, hardware, finishing supplies
- **Tool Requirements:** What's needed to build this piece

**Key Requirement:** Must handle ANY valid configurator output. This is a separate module with its own complexity.

#### D. Marketplace

**Purpose:** Connect consumers with designs and makers.

**Features:**
- **Design Store:** Browse/purchase downloadable plan packages
- **Project Posting:** Consumer posts project, makers bid
- **Maker Directory:** Searchable by location, skills, portfolio, reviews
- **Project Management:** Milestones, communication, payments
- **Escrow & Payments:** Secure transactions via Stripe

#### E. Community & Network

**Purpose:** Support the three-sided network with social features.

**Features:**
- **User Profiles:** Separate views for consumers, designers, makers
- **Portfolios:** Makers showcase completed work
- **Reviews & Ratings:** Build trust and reputation
- **Messaging:** Project communication
- **Forums/Q&A:** Community knowledge sharing
- **Notifications:** Project updates, bids, messages

---

## 2. Knowledge Base Architecture

### 2.1 Why Knowledge-First?

The platform's differentiation is **deep domain expertise**, not just geometry generation.

| Without Knowledge Base | With Knowledge Base |
|------------------------|---------------------|
| Generic parameter sliders | Intelligent defaults with explanations |
| "Invalid dimension" errors | "This apron height limits knee clearance to 23\" — standard is 24\"+" |
| Static style presets | "Shaker tapers inside faces only for visual stability while reducing weight" |
| Basic cut lists | "Orient grain along length for strength; allow 1/16\" for seasonal movement" |
| No context for decisions | "Through-tenons show prominent ray flake in quartersawn oak — consider blind tenons" |

### 2.2 Knowledge Domains

```
WOODWORKING KNOWLEDGE DOMAINS
├── FURNITURE DESIGN
│   ├── Historical Periods (Shaker, Mission, Mid-Century, Danish, Queen Anne, etc.)
│   ├── Style Characteristics (defining features, typical proportions, materials)
│   ├── Proportional Systems (golden ratio, rule of thirds, visual balance)
│   └── Design Principles (line, form, mass, negative space)
│
├── JOINERY & CONSTRUCTION
│   ├── Joint Types (mortise-tenon, dovetail, box, dowel, domino, pocket)
│   ├── Joint Selection (when to use each, strength requirements)
│   ├── Formulas (tenon sizing: 1/3 stock thickness, mortise depth, etc.)
│   ├── Construction Sequences (order of operations, dry-fit, glue-up)
│   └── Structural Engineering (load paths, stress, grain orientation)
│
├── WOOD SCIENCE
│   ├── Species Properties (Janka hardness, workability, grain patterns)
│   ├── Wood Movement (tangential vs radial, seasonal expansion/contraction)
│   ├── Lumber Grades & Cuts (FAS, Select, quartersawn, rift sawn)
│   └── Defects & Selection (knots, checks, warp, working around defects)
│
├── TOOLS & TECHNIQUES
│   ├── Hand Tools (planes, chisels, saws, marking)
│   ├── Power Tools (table saw, router, jointer, bandsaw)
│   ├── CNC & Digital Fabrication (CAD/CAM, toolpaths, holding)
│   └── Safety (tool hazards, dust collection, PPE)
│
└── FINISHING
    ├── Surface Preparation (sanding progressions, scraping, grain raising)
    ├── Finish Types (oil, varnish, shellac, lacquer, wax, paint)
    ├── Application Methods (brush, wipe, spray)
    └── Selection Guidance (durability vs appearance, use case)
```

### 2.3 Technical Implementation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE BASE SYSTEM ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  SOURCE MATERIALS                                                                │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ • Curated original content (technique explanations, style guides)          │  │
│  │ • Structured databases (species properties, joinery formulas)              │  │
│  │ • Public domain references (historical furniture, gov't publications)      │  │
│  │ • Licensed content (Fine Woodworking, books — future)                      │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                     │                                            │
│                                     ▼                                            │
│  INGESTION PIPELINE                                                              │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Content Acquisition → 2. Preprocessing → 3. Domain-Aware Chunking      │  │
│  │ 4. Entity Extraction (joints, species, tools) → 5. Embedding Generation   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                     │                                            │
│                                     ▼                                            │
│  STORAGE LAYER                                                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │    Vector Database   │  │     PostgreSQL      │  │      Object Storage     │  │
│  │                      │  │                     │  │                         │  │
│  │ • Embeddings         │  │ • Structured data   │  │ • Source documents      │  │
│  │ • Metadata indices   │  │   (species, joints) │  │ • Images/diagrams       │  │
│  │ • Semantic search    │  │ • Relationships     │  │ • PDFs                  │  │
│  │                      │  │ • User feedback     │  │                         │  │
│  │ Pinecone / Weaviate  │  │                     │  │ S3 / Cloudflare R2     │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘  │
│                                     │                                            │
│                                     ▼                                            │
│  RETRIEVAL & REASONING                                                           │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ Query Processing:                                                          │  │
│  │ • Intent classification (Q&A, validation, recommendation)                  │  │
│  │ • Query expansion with domain terms                                        │  │
│  │ • Context gathering (current design state)                                 │  │
│  │                                                                            │  │
│  │ Retrieval Strategies:                                                      │  │
│  │ • Semantic search (vector similarity)                                      │  │
│  │ • Metadata filtering (domain, difficulty, source)                          │  │
│  │ • Hybrid search (vector + BM25 keyword)                                    │  │
│  │ • Re-ranking for relevance                                                 │  │
│  │                                                                            │  │
│  │ Response Generation:                                                       │  │
│  │ • Claude with retrieved context                                            │  │
│  │ • Structured output for parameters                                         │  │
│  │ • Source citations                                                         │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                     │                                            │
│                                     ▼                                            │
│  KNOWLEDGE API                                                                   │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ GET  /knowledge/search?q=...&domain=joinery                                │  │
│  │ GET  /knowledge/species/:name                                              │  │
│  │ GET  /knowledge/joints/:type                                               │  │
│  │ GET  /knowledge/styles/:style                                              │  │
│  │ POST /knowledge/ask        (RAG-powered Q&A)                               │  │
│  │ POST /knowledge/validate   (design validation with explanations)           │  │
│  │ POST /knowledge/recommend  (suggestions based on current state)            │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Knowledge Integration Points

| Module | Integration | Example |
|--------|-------------|---------|
| **Configurator** | Tooltips, validation, defaults | "Apron height of 4\" provides 24\" knee clearance (standard: 24\"+)" |
| **Plan Builder** | Cut list notes, assembly tips | "Quartersawn preferred for top stability. Allow 1/16\" for movement." |
| **Marketplace** | Complexity assessment | "INTERMEDIATE: Requires mortise-tenon joinery, tapered legs" |
| **Community** | Q&A moderation, tutorials | Validates user-submitted technique advice |

---

## 3. Technical Architecture

### 3.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM ARCHITECTURE                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  CLIENTS                                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                     │
│  │   Web App      │  │   Mobile Web   │  │  Native Apps   │                     │
│  │   (React)      │  │   (Responsive) │  │   (Future)     │                     │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘                     │
│          │                   │                   │                               │
│          └───────────────────┴───────────────────┘                               │
│                              │                                                   │
│                              ▼                                                   │
│  API GATEWAY (Vercel Edge / Cloudflare Workers)                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ • Rate limiting  • Auth verification  • Request routing  • Caching        │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                   │
│          ┌───────────────────┼───────────────────┬───────────────────┐          │
│          │                   │                   │                   │          │
│          ▼                   ▼                   ▼                   ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  API Server  │    │  Knowledge   │    │   Render     │    │  Plan Gen    │  │
│  │   (Main)     │    │   Service    │    │   Service    │    │   Service    │  │
│  │              │    │              │    │              │    │              │  │
│  │ • Users      │    │ • RAG        │    │ • Real-time  │    │ • Cut lists  │  │
│  │ • Designs    │    │ • Q&A        │    │ • Export     │    │ • Drawings   │  │
│  │ • Marketplace│    │ • Validation │    │ • Thumbnails │    │ • DXF/SVG    │  │
│  │ • Payments   │    │              │    │              │    │ • Assembly   │  │
│  │              │    │              │    │              │    │              │  │
│  │ Node.js      │    │ Python       │    │ Node.js      │    │ Python       │  │
│  │ Fastify/tRPC │    │ FastAPI      │    │ + Blender    │    │ + Cairo/PDF  │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                   │                   │          │
│         └───────────────────┴───────────────────┴───────────────────┘          │
│                                     │                                           │
│                                     ▼                                           │
│  DATA LAYER                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  PostgreSQL  │    │   Vector DB  │    │    Redis     │    │ Object Store │  │
│  │              │    │              │    │              │    │              │  │
│  │ • Users      │    │ • Embeddings │    │ • Sessions   │    │ • Designs    │  │
│  │ • Designs    │    │ • Knowledge  │    │ • Cache      │    │ • Plans      │  │
│  │ • Orders     │    │ • Search     │    │ • Rate limit │    │ • Renders    │  │
│  │ • Reviews    │    │              │    │ • Pub/sub    │    │ • Assets     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                                                  │
│  EXTERNAL SERVICES                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │    Clerk     │    │    Stripe    │    │  Anthropic   │    │   SendGrid   │  │
│  │   (Auth)     │    │  (Payments)  │    │   (Claude)   │    │   (Email)    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Models

#### Core Entities

```typescript
// User (supports all three roles)
interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  roles: ('consumer' | 'designer' | 'maker')[]
  createdAt: Date

  // Consumer fields
  savedDesigns: string[]  // Design IDs
  purchasedPlans: string[]

  // Designer fields
  designerProfile?: {
    bio: string
    portfolio: string[]  // Design IDs
    salesCount: number
    rating: number
  }

  // Maker fields
  makerProfile?: {
    shopName: string
    location: { city: string, state: string, country: string }
    bio: string
    skills: string[]      // ['mortise-tenon', 'cnc', 'finishing']
    tools: string[]       // ['table-saw', 'router', 'cnc-router']
    portfolio: string[]   // Completed project IDs
    rating: number
    reviewCount: number
    responseTime: string  // 'within-24h', 'within-week'
  }
}

// Furniture Design
interface Design {
  id: string
  ownerId: string
  name: string
  description?: string

  furnitureType: 'table' | 'chair' | 'cabinet' | 'bed' | 'desk'
  style: string
  params: TableParams | ChairParams | ...  // Type-specific parameters

  thumbnail: string     // URL
  renders: string[]     // High-quality render URLs

  isPublic: boolean
  isForSale: boolean
  price?: number
  salesCount: number

  knowledgeAnnotations: {  // From knowledge base
    complexity: 'beginner' | 'intermediate' | 'advanced'
    skillsRequired: string[]
    estimatedHours: { min: number, max: number }
  }

  createdAt: Date
  updatedAt: Date
}

// Plan Package (generated from design)
interface PlanPackage {
  id: string
  designId: string
  version: number

  files: {
    cutList: string       // PDF URL
    shopDrawings: string  // PDF URL
    cnc: string[]         // DXF/SVG URLs
    assembly: string      // PDF URL
    fullPackage: string   // ZIP URL
  }

  generatedAt: Date
}

// Marketplace Project (consumer posts for bids)
interface Project {
  id: string
  consumerId: string
  designId: string

  status: 'open' | 'bidding' | 'in-progress' | 'completed' | 'cancelled'

  requirements: {
    deadline?: Date
    location: string      // For delivery/pickup
    notes: string
  }

  bids: Bid[]
  acceptedBidId?: string

  milestones: Milestone[]
  messages: Message[]

  createdAt: Date
}

interface Bid {
  id: string
  makerId: string
  projectId: string

  price: number
  estimatedDelivery: Date
  message: string

  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  createdAt: Date
}
```

### 3.3 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 + TypeScript | Existing investment, mature ecosystem |
| **3D Rendering** | React Three Fiber | Existing investment, excellent DX |
| **State Management** | Zustand or TanStack Query | Simpler than Redux, good for async |
| **Build Tool** | Vite | Existing, fast HMR |
| **Styling** | Tailwind CSS | Existing, rapid UI development |
| **Backend** | Node.js + Fastify | Fast, low overhead, JS ecosystem |
| **API Layer** | tRPC | Type-safe API, great DX with TypeScript |
| **Database** | PostgreSQL | Robust, JSON support, proven |
| **Vector DB** | Pinecone | Managed, scalable, good filtering |
| **Cache** | Redis (Upstash) | Sessions, rate limiting, pub/sub |
| **Object Storage** | Cloudflare R2 | S3-compatible, no egress fees |
| **Auth** | Clerk | Fast to implement, good UX |
| **Payments** | Stripe Connect | Marketplace-ready, escrow support |
| **LLM** | Claude 3.5 Sonnet | Strong reasoning, instruction following |
| **Embeddings** | text-embedding-3-large | High quality for technical content |
| **PDF Generation** | jsPDF + React-PDF | Client + server-side generation |
| **Email** | Resend or SendGrid | Transactional email |
| **Hosting** | Vercel + Railway | Existing Vercel, Railway for services |
| **CDN** | Cloudflare | Global, fast, R2 integration |

### 3.4 API Structure

```
/api
├── /auth                    # Clerk webhooks
├── /users
│   ├── GET    /me
│   ├── PATCH  /me
│   ├── GET    /:id
│   └── GET    /:id/portfolio
│
├── /designs
│   ├── GET    /            # List (with filters)
│   ├── POST   /            # Create
│   ├── GET    /:id
│   ├── PATCH  /:id
│   ├── DELETE /:id
│   ├── POST   /:id/fork
│   └── POST   /:id/render  # Trigger high-quality render
│
├── /plans
│   ├── POST   /generate    # Generate from design
│   ├── GET    /:id
│   └── GET    /:id/download/:file
│
├── /marketplace
│   ├── /store
│   │   ├── GET    /designs    # Browse for-sale designs
│   │   └── POST   /purchase
│   │
│   ├── /projects
│   │   ├── GET    /           # List (maker view: open projects)
│   │   ├── POST   /           # Create project from design
│   │   ├── GET    /:id
│   │   ├── POST   /:id/bid
│   │   └── POST   /:id/accept-bid
│   │
│   └── /makers
│       ├── GET    /           # Directory search
│       └── GET    /:id
│
├── /knowledge
│   ├── GET    /search
│   ├── GET    /species/:name
│   ├── GET    /joints/:type
│   ├── GET    /styles/:style
│   ├── POST   /ask
│   └── POST   /validate
│
└── /webhooks
    ├── /stripe
    └── /clerk
```

---

## 4. Fine-Tuned Woodworking Model Analysis

### 4.1 The Question

> Should we train or fine-tune a model to become a domain expert in woodworking?

### 4.2 Analysis

#### RAG Approach (Recommended for Now)

**How it works:** Retrieve relevant chunks from knowledge base, include in Claude's context, generate response.

**Pros:**
- Faster to implement (weeks vs months)
- Lower cost (no training compute)
- Easier to update (add/modify content without retraining)
- Full control over source material
- Source citations naturally available
- Leverages Claude's strong base capabilities

**Cons:**
- Limited by retrieval quality
- Context window constraints
- May miss nuanced domain patterns
- Requires ongoing content curation

#### Fine-Tuning Approach

**How it would work:** Train on curated woodworking corpus (Fine Woodworking articles, technique manuals, wood science literature) with human feedback (RLHF).

**Pros:**
- Deeper internalized knowledge
- Better at nuanced domain reasoning
- Consistent domain "voice"
- Faster inference (no retrieval step)

**Cons:**
- Expensive (training costs, infrastructure)
- Long timeline (months to quality model)
- Hard to update (retrain for new knowledge)
- Risk of hallucination without retrieval grounding
- Licensing challenges for training data
- Requires ML expertise and infrastructure

### 4.3 Recommendation

**Phase 1-3: RAG-only approach**

Start with well-architected RAG:
1. High-quality curated content (original + structured data)
2. Domain-aware chunking and embedding
3. Hybrid retrieval (semantic + keyword)
4. Claude 3.5 Sonnet for generation

This gets us 80% of the value at 10% of the cost/time.

**Phase 4+: Evaluate fine-tuning ROI**

After collecting user interactions:
1. Analyze RAG failure cases
2. Build evaluation dataset from real queries
3. Identify patterns that require deeper domain reasoning
4. If clear ROI: fine-tune a smaller model for specific tasks (validation, defaults)

**Where Fine-Tuning Might Help Later:**
- Consistent style-specific advice (knowing Shaker vs Mission deeply)
- Complex proportional reasoning
- Construction sequence optimization
- Failure mode prediction

### 4.4 Training Pipeline (If We Proceed Later)

```
┌────────────────────────────────────────────────────────────────────────┐
│                    FUTURE FINE-TUNING PIPELINE                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. DATA COLLECTION                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • License Fine Woodworking archive (negotiate access)           │   │
│  │ • Curate woodworking book excerpts (with permission)            │   │
│  │ • Collect user interactions from production (anonymized)        │   │
│  │ • Create synthetic examples from domain rules                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  2. DATA PREPARATION                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • Convert to instruction format (question → answer)             │   │
│  │ • Add domain-specific formatting                                │   │
│  │ • Quality filtering and deduplication                           │   │
│  │ • Train/validation/test splits                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  3. FINE-TUNING                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • Base model: Claude 3 Haiku or Sonnet (if available)           │   │
│  │ • Or: Llama 3 / Mistral for self-hosted option                  │   │
│  │ • LoRA/QLoRA for efficient training                             │   │
│  │ • RLHF with expert woodworker feedback                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  4. EVALUATION                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • Domain-specific benchmark (joinery questions, validation)     │   │
│  │ • A/B test vs RAG approach                                      │   │
│  │ • Expert review of responses                                    │   │
│  │ • Production metrics (user satisfaction, accuracy)              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. MVP Integration

### 5.1 Current MVP Assets

The existing parametric table configurator provides:

| Component | Status | Reuse Strategy |
|-----------|--------|----------------|
| React + TypeScript setup | ✅ Complete | Keep as-is |
| R3F 3D rendering | ✅ Complete | Keep, enhance textures |
| Table geometry (6 styles) | ✅ Complete | Keep, expand furniture types |
| Compound angle math | ✅ Complete | Document for other furniture |
| Validation engine | ✅ Basic | Enhance with knowledge explanations |
| Control panel UI | ✅ Complete | Keep pattern, improve UX |
| Export panel | ⚠️ Basic | Major enhancement needed |
| State management (Context) | ✅ Works | Consider Zustand for scale |

### 5.2 MVP-to-Platform Migration

**Phase 1 transforms MVP:**
1. Add authentication (Clerk)
2. Add design save/load (backend)
3. Integrate knowledge base for tooltips/validation
4. Add AI chat assistant

**Existing code remains core:**
- All geometry components stay
- Validation engine enhanced (not replaced)
- UI patterns extended

---

## 6. Content Acquisition Strategy

### 6.1 Priority Sources

| Priority | Type | Examples | Method |
|----------|------|----------|--------|
| **P0** | Structured reference | Wood properties, joinery formulas | Manual curation, databases |
| **P1** | Original content | Technique explanations, style guides | Write in-house |
| **P2** | Public domain | Historical references, FPL publications | Research, extraction |
| **P3** | Licensed content | Fine Woodworking, books | Future partnerships |

### 6.2 Starting Point

Create original content first:
- Avoids licensing delays
- Ensures consistent voice
- Full control over accuracy
- Can supplement with licensed content later

### 6.3 Initial Content Targets

- [ ] 50+ wood species with full properties
- [ ] All major joinery types with formulas
- [ ] 10+ furniture styles with characteristics
- [ ] 20+ technique explanations
- [ ] Construction sequences by furniture type
- [ ] Troubleshooting guides

---

## 7. Security & Compliance

### 7.1 Authentication & Authorization

- Clerk handles auth (OAuth + email/password)
- Role-based access (consumer, designer, maker)
- API routes protected by middleware
- Design visibility (public/private)

### 7.2 Payment Security

- Stripe handles all payment processing
- No card data stored on our servers
- PCI compliance via Stripe
- Escrow for project payments

### 7.3 Data Privacy

- GDPR-ready data model
- User data export capability
- Right to deletion
- Clear data retention policies

---

## 8. Scalability Considerations

### 8.1 Bottlenecks & Solutions

| Potential Bottleneck | Solution |
|---------------------|----------|
| 3D rendering load | Client-side R3F; server renders queued |
| Knowledge API latency | Redis caching, embedding cache |
| Plan generation | Async job queue, progress updates |
| Image/file storage | Cloudflare R2 CDN |
| Database queries | Indexed queries, read replicas if needed |

### 8.2 Cost Optimization

- LLM calls: Cache common queries, use Haiku for simple tasks
- Vector DB: Pinecone serverless (pay per query)
- Storage: R2 has no egress fees
- Compute: Vercel serverless scales to zero

---

## 9. Open Questions & Decisions

### 9.1 Technical Decisions Needed

| Question | Options | Recommendation |
|----------|---------|----------------|
| Vector DB provider | Pinecone vs Weaviate vs Qdrant | Pinecone (managed, proven) |
| State management | Keep Context vs Zustand vs Jotai | Zustand (simpler, scalable) |
| Backend hosting | Vercel Functions vs Railway vs Render | Railway (more control) |
| Real-time updates | WebSockets vs SSE vs polling | SSE (simpler, sufficient) |

### 9.2 Business Decisions Needed

| Question | Impact |
|----------|--------|
| Pricing model for plans | Revenue, adoption |
| Marketplace fee structure | Maker/designer economics |
| Content licensing budget | Knowledge base depth |
| Geographic scope | Maker directory, shipping |

### 9.3 Immediate Next Steps

After document approval:
1. Set up backend infrastructure (Railway + PostgreSQL)
2. Add Clerk authentication to MVP
3. Create knowledge base content structure
4. Implement design save/load
5. Begin RAG pipeline development

---

## 10. Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-03 | Initial architecture |
| 2.0 | 2026-02-04 | Knowledge-first revision |
| 3.0 | 2026-02-04 | Complete ecosystem architecture with fine-tuning analysis |

---

*This document should be reviewed and updated as major decisions are made.*
