# Furniture Ecosystem — Master Architecture Document

## Executive Summary

This document defines the technical architecture for a furniture design platform connecting designers, buyers, and makers. **The Knowledge Base is the foundational layer** — a deep understanding of woodworking that informs every other module. All platform components draw from this shared intelligence to deliver authentic, technically sound furniture design guidance.

---

## 1. System Overview

### 1.1 Knowledge-First Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FURNITURE ECOSYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ CONFIGURATOR│  │  RENDERER   │  │PLAN BUILDER │  │    MARKETPLACE      │ │
│  │             │  │             │  │             │  │                     │ │
│  │ Parametric  │  │Photorealistic│  │ Cut Lists  │  │  Designers/Makers   │ │
│  │   Design    │  │     3D      │  │   Plans    │  │    Consumers        │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                │                     │           │
│         └────────────────┴────────────────┴─────────────────────┘           │
│                                    │                                         │
│         ┌──────────────────────────▼──────────────────────────┐             │
│         │                                                      │             │
│         │            ★ WOODWORKING KNOWLEDGE BASE ★            │             │
│         │                                                      │             │
│         │   The Intelligence Layer That Powers Everything      │             │
│         │                                                      │             │
│         │  • Construction Techniques    • Furniture History    │             │
│         │  • Joinery Methods            • Period Styles        │             │
│         │  • Wood Science               • Proportional Systems │             │
│         │  • Tool Requirements          • Design Principles    │             │
│         │  • Safety Guidelines          • Material Properties  │             │
│         │                                                      │             │
│         └──────────────────────────────────────────────────────┘             │
│                                    │                                         │
│                        ┌───────────▼───────────┐                            │
│                        │     SHARED CORE       │                            │
│                        │                       │                            │
│                        │  • Design Database    │                            │
│                        │  • User Accounts      │                            │
│                        │  • API Gateway        │                            │
│                        └───────────────────────┘                            │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    COMMUNITY & NETWORK MODULE                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Why Knowledge-First?

The platform's differentiation comes from **deep domain expertise**, not just parametric geometry. Without foundational knowledge:

| Without Knowledge Base | With Knowledge Base |
|------------------------|---------------------|
| Generic parameter sliders | Intelligent defaults with explanations |
| "Invalid dimension" errors | "This apron height limits knee clearance to 23\" — standard is 24\"+" |
| Static style presets | "Shaker tapers inside faces only for visual stability while reducing weight" |
| Basic cut lists | "Orient grain along length for strength; allow 1/16\" for seasonal movement" |
| No context for decisions | "Through-tenons show prominent ray flake in quartersawn oak — consider blind tenons for subtle grain" |

### 1.3 User Roles

| Role | Primary Actions | How Knowledge Helps |
|------|-----------------|---------------------|
| **Consumer** | Configure furniture, purchase plans | Guided design with explanations |
| **Designer** | Create/share/sell designs | Validated designs, historical context |
| **Maker** | Bid on projects, build | Accurate plans, technique guidance |

---

## 2. Knowledge Base Architecture (Foundational Layer)

### 2.1 Domain Ontology

The knowledge base organizes woodworking expertise into structured domains:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      WOODWORKING KNOWLEDGE DOMAINS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     1. FURNITURE DESIGN                              │    │
│  │                                                                      │    │
│  │  Historical Periods           Proportional Systems                   │    │
│  │  ├── Shaker (1780-1900)       ├── Golden ratio applications         │    │
│  │  ├── Arts & Crafts (1880-1920)├── Rule of thirds                    │    │
│  │  ├── Mid-Century Modern       ├── Classical orders (adapted)        │    │
│  │  ├── Danish Modern            └── Visual weight balancing           │    │
│  │  ├── Queen Anne, Chippendale                                        │    │
│  │  ├── Federal, Empire          Design Elements                       │    │
│  │  └── Contemporary             ├── Line, form, mass                  │    │
│  │                               ├── Negative space                    │    │
│  │  Style Characteristics        ├── Visual hierarchy                  │    │
│  │  ├── Defining features        └── Style coherence rules             │    │
│  │  ├── Typical proportions                                            │    │
│  │  ├── Common materials                                               │    │
│  │  └── Historical context                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     2. JOINERY & CONSTRUCTION                        │    │
│  │                                                                      │    │
│  │  Joint Types                  Construction Sequences                 │    │
│  │  ├── Mortise & Tenon          ├── Order of operations               │    │
│  │  │   ├── Through              ├── Dry-fit requirements              │    │
│  │  │   ├── Blind                ├── Glue-up strategies                │    │
│  │  │   ├── Haunched             └── Clamping techniques               │    │
│  │  │   ├── Wedged                                                     │    │
│  │  │   └── Tusk                 Strength Considerations               │    │
│  │  ├── Dovetails                ├── Grain orientation rules           │    │
│  │  │   ├── Through              ├── Load paths                        │    │
│  │  │   ├── Half-blind           ├── Stress concentration             │    │
│  │  │   └── Sliding              └── Long-grain vs end-grain           │    │
│  │  ├── Box Joints                                                     │    │
│  │  ├── Dowel Joints             When to Use Each Joint                │    │
│  │  ├── Biscuit/Domino           ├── Strength requirements             │    │
│  │  ├── Pocket Screws            ├── Visibility preferences            │    │
│  │  └── Dados, Rabbets, Grooves  ├── Skill level                       │    │
│  │                               └── Tool availability                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     3. WOOD SCIENCE                                  │    │
│  │                                                                      │    │
│  │  Species Properties           Wood Movement                          │    │
│  │  ├── Hardness (Janka)         ├── Tangential vs radial rates        │    │
│  │  ├── Workability              ├── Seasonal expansion/contraction    │    │
│  │  ├── Grain patterns           ├── Allowances by width               │    │
│  │  ├── Color & aging            └── Attachment methods                │    │
│  │  ├── Toxicity/allergies                                             │    │
│  │  └── Sustainability           Defects & Selection                   │    │
│  │                               ├── Knots, checks, splits             │    │
│  │  Lumber Grades & Cuts         ├── Warp types (cup, bow, twist)      │    │
│  │  ├── FAS, Select, Common      ├── Reading grain direction           │    │
│  │  ├── Flatsawn, quartersawn    └── Working around defects            │    │
│  │  └── Rift sawn                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     4. TOOLS & TECHNIQUES                            │    │
│  │                                                                      │    │
│  │  Hand Tools                   Power Tools                            │    │
│  │  ├── Planes (types, tuning)   ├── Table saw techniques              │    │
│  │  ├── Chisels (sizes, use)     ├── Router operations                 │    │
│  │  ├── Saws (rip, crosscut)     ├── Jointer/planer                    │    │
│  │  ├── Marking & measuring      ├── Bandsaw                           │    │
│  │  └── Sharpening               └── Drill press                       │    │
│  │                                                                      │    │
│  │  CNC & Digital Fabrication    Safety                                 │    │
│  │  ├── CAD/CAM workflow         ├── Tool-specific hazards             │    │
│  │  ├── Toolpath strategies      ├── Dust collection                   │    │
│  │  └── Material holding         ├── Hearing/eye protection            │    │
│  │                               └── Shop layout                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     5. FINISHING                                     │    │
│  │                                                                      │    │
│  │  Surface Preparation          Finish Types                           │    │
│  │  ├── Sanding progressions     ├── Oil (tung, linseed, Danish)       │    │
│  │  ├── Scraping                 ├── Varnish, polyurethane             │    │
│  │  ├── Grain raising            ├── Shellac, lacquer                  │    │
│  │  └── Pre-stain conditioning   ├── Wax                               │    │
│  │                               └── Paint, milk paint                 │    │
│  │  Application Methods                                                 │    │
│  │  ├── Brush, wipe, spray       Finish Selection                      │    │
│  │  ├── Drying times             ├── Use case (table vs display)       │    │
│  │  ├── Between-coat sanding     ├── Durability requirements           │    │
│  │  └── Rubbing out              └── Appearance goals                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Knowledge Base Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE BASE SYSTEM ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     SOURCE MATERIALS                                 │    │
│  │                                                                      │    │
│  │  Publications                 Books & Manuals                        │    │
│  │  ├── Fine Woodworking         ├── Tage Frid Teaches Woodworking     │    │
│  │  ├── Popular Woodworking      ├── Understanding Wood (Hoadley)      │    │
│  │  ├── Wood Magazine            ├── The Complete Manual of Woodworking│    │
│  │  └── Woodsmith                ├── Encyclopedia of Furniture Making  │    │
│  │                               └── Period furniture references       │    │
│  │  Video Content                                                       │    │
│  │  ├── Technique demonstrations Structured Data                       │    │
│  │  ├── Project walkthroughs     ├── Wood-Database.com                 │    │
│  │  └── Tool reviews             ├── Species properties tables         │    │
│  │                               └── Joinery dimension formulas        │    │
│  └──────────────────────────────────┬──────────────────────────────────┘    │
│                                     │                                        │
│                                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     INGESTION PIPELINE                               │    │
│  │                                                                      │    │
│  │  1. Content Acquisition        2. Preprocessing                      │    │
│  │     ├── PDF extraction            ├── Clean & normalize text        │    │
│  │     ├── Web scraping              ├── Extract tables & figures      │    │
│  │     ├── Manual curation           ├── Identify structure            │    │
│  │     └── API integrations          └── Tag content type              │    │
│  │                                                                      │    │
│  │  3. Domain-Aware Chunking      4. Enrichment                         │    │
│  │     ├── Preserve technique        ├── Add domain metadata           │    │
│  │     │   descriptions intact       ├── Link related concepts         │    │
│  │     ├── Keep dimensions           ├── Extract entities (tools,      │    │
│  │     │   with context              │   species, joints)              │    │
│  │     ├── Group related steps       └── Generate summaries            │    │
│  │     └── Maintain figure refs                                        │    │
│  └──────────────────────────────────┬──────────────────────────────────┘    │
│                                     │                                        │
│                                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     VECTOR DATABASE                                  │    │
│  │                                                                      │    │
│  │  Embedding Model               Storage                               │    │
│  │  ├── text-embedding-3-large    ├── Pinecone / Weaviate / Qdrant    │    │
│  │  │   or domain-tuned model     ├── Metadata indices                 │    │
│  │  └── 1536+ dimensions          └── Hybrid search (vector + keyword) │    │
│  │                                                                      │    │
│  │  Metadata Schema               Namespaces                            │    │
│  │  ├── domain (joinery, wood,    ├── techniques                       │    │
│  │  │   design, finishing)        ├── species                          │    │
│  │  ├── source (FWW, book, etc)   ├── styles                           │    │
│  │  ├── content_type (how-to,     ├── safety                           │    │
│  │  │   reference, project)       └── projects                         │    │
│  │  └── difficulty_level                                               │    │
│  └──────────────────────────────────┬──────────────────────────────────┘    │
│                                     │                                        │
│                                     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     RETRIEVAL & REASONING                            │    │
│  │                                                                      │    │
│  │  Query Processing              Retrieval Strategies                  │    │
│  │  ├── Intent classification     ├── Semantic search                  │    │
│  │  ├── Query expansion           ├── Metadata filtering               │    │
│  │  ├── Domain term detection     ├── Hybrid (vector + BM25)           │    │
│  │  └── Context gathering         └── Multi-query retrieval            │    │
│  │                                                                      │    │
│  │  Response Generation           Quality Assurance                     │    │
│  │  ├── Claude with retrieved     ├── Source citation                  │    │
│  │  │   context                   ├── Confidence scoring               │    │
│  │  ├── Structured output for     ├── Contradiction detection          │    │
│  │  │   parameters                └── Human feedback loop              │    │
│  │  └── Explanation generation                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Knowledge Integration Points

The knowledge base connects to every platform module:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE INTEGRATION POINTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CONFIGURATOR INTEGRATION                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Intelligent Defaults                                                │    │
│  │  └─ "For a 72\" Shaker dining table, standard apron height is       │    │
│  │      4\" with 3/4\" tenons. This provides 24\"+ knee clearance."    │    │
│  │                                                                      │    │
│  │  Validation Explanations                                             │    │
│  │  └─ "2\" legs on a 36\" wide table may appear spindly. Shaker       │    │
│  │      proportions suggest 2.5-2.75\" for this width."                │    │
│  │                                                                      │    │
│  │  Style Guidance                                                      │    │
│  │  └─ "Mission style typically uses 11 slats per end panel,           │    │
│  │      1/2\" wide with 3/8\" spacing, mortised into apron and rail."  │    │
│  │                                                                      │    │
│  │  Parameter Tooltips                                                  │    │
│  │  └─ Each slider shows context: "Overhang (typical 2-3\"):           │    │
│  │      Shaker often uses 3\" sides, 6\" ends for visual balance"      │    │
│  │                                                                      │    │
│  │  Natural Language Interface                                          │    │
│  │  └─ User: "Make it more farmhouse"                                  │    │
│  │     System: Increases leg thickness, adds breadboard ends,          │    │
│  │             switches to through-tenons, explains each change        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PLAN BUILDER INTEGRATION                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Cut List Intelligence                                               │    │
│  │  └─ "Top boards: Orient grain along length. For 36\" width,         │    │
│  │      allow 1/16\" total for seasonal movement with elongated        │    │
│  │      screw holes in cleats."                                        │    │
│  │                                                                      │    │
│  │  Assembly Instructions                                               │    │
│  │  └─ "Dry-fit all joints before glue-up. For mortise-tenon,          │    │
│  │      apply glue to mortise walls and tenon cheeks, not shoulders."  │    │
│  │                                                                      │    │
│  │  Joinery Details                                                     │    │
│  │  └─ "Haunched tenon: 1/4\" haunch prevents apron twist.             │    │
│  │      Set mortise back 3/16\" from leg face for reveal."             │    │
│  │                                                                      │    │
│  │  Tool Requirements                                                   │    │
│  │  └─ "This project requires: 1/4\" and 3/8\" mortise chisels,        │    │
│  │      dado blade or router with 3/4\" bit, 24\"+ clamps (4+)"        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  MARKETPLACE INTEGRATION                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Complexity Assessment                                               │    │
│  │  └─ "This design is INTERMEDIATE: Requires mortise-tenon joinery,   │    │
│  │      tapered legs, and careful top attachment for movement."        │    │
│  │                                                                      │    │
│  │  Maker Matching                                                      │    │
│  │  └─ "This Mission table requires: hand-cut mortises (or domino),    │    │
│  │      slat joinery experience, quartersawn white oak sourcing"       │    │
│  │                                                                      │    │
│  │  Cost Estimation                                                     │    │
│  │  └─ "White oak FAS grade: ~$8/bf × 42 bf = $336 materials.          │    │
│  │      Intermediate project: estimate 25-35 shop hours."              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Q&A / ASSISTANT                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Direct Questions                                                    │    │
│  │  └─ User: "What's the difference between blind and through tenons?" │    │
│  │     System: [Retrieves FWW article, explains with diagrams,         │    │
│  │              notes when each is appropriate]                        │    │
│  │                                                                      │    │
│  │  Design Critique                                                     │    │
│  │  └─ User: "Review my table design"                                  │    │
│  │     System: "Proportions are good. Consider: (1) apron height       │    │
│  │              could increase 1/2\" for stronger tenon, (2) add       │    │
│  │              stretchers for this leg style at this width."          │    │
│  │                                                                      │    │
│  │  Technique Guidance                                                  │    │
│  │  └─ User: "How do I cut haunched tenons?"                           │    │
│  │     System: [Step-by-step with tool options, common mistakes,       │    │
│  │              video references]                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Knowledge Data Models

```typescript
// Core knowledge chunk structure
interface KnowledgeChunk {
  id: string
  content: string
  embedding: number[]
  metadata: {
    domain: 'joinery' | 'wood-science' | 'design' | 'finishing' | 'tools' | 'safety'
    contentType: 'technique' | 'reference' | 'project' | 'history' | 'science'
    source: {
      publication: string
      author?: string
      issue?: string
      year?: number
      url?: string
    }
    entities: {
      joints?: string[]        // ['mortise-tenon', 'dovetail']
      species?: string[]       // ['white-oak', 'walnut']
      tools?: string[]         // ['chisel', 'router']
      styles?: string[]        // ['shaker', 'mission']
    }
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    relatedChunks?: string[]   // Links to related content
  }
  createdAt: Date
  validatedBy?: string         // Human review
}

// Structured knowledge for direct lookup
interface JoineryRule {
  jointType: string
  formula: {
    tenonThickness: string     // "1/3 of stock thickness"
    tenonLength: string        // "2/3 of leg thickness"
    mortiseDepth: string       // "tenon length + 1/16\""
  }
  constraints: {
    minStockThickness: number
    maxTenonLength: number
    grainRequirements: string
  }
  whenToUse: string[]
  alternatives: string[]
}

interface WoodSpeciesData {
  commonName: string
  scientificName: string
  jankaHardness: number
  specificGravity: number
  tangentialMovement: number   // % per % MC change
  radialMovement: number
  workability: {
    handTools: 'easy' | 'moderate' | 'difficult'
    machining: 'easy' | 'moderate' | 'difficult'
    gluing: 'easy' | 'moderate' | 'difficult'
    finishing: 'easy' | 'moderate' | 'difficult'
  }
  characteristics: string[]
  commonUses: string[]
  sustainability: 'sustainable' | 'moderate' | 'concern'
  priceRange: 'budget' | 'moderate' | 'premium' | 'exotic'
}

interface StyleDefinition {
  name: string
  period: { start: number, end: number }
  origins: string[]
  characteristics: {
    lines: string[]            // "clean", "minimal", "curved"
    ornamentation: string
    proportions: string[]      // Rules and ratios
    materials: string[]
    joinery: string[]
  }
  typicalFurniture: string[]
  influences: string[]
  keyMakers: string[]
  modernAdaptations: string
}
```

---

## 3. Module Architecture

### 3.1 Configurator (Web App)

**Purpose:** Parametric furniture designer powered by deep woodworking knowledge.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONFIGURATOR                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │   UI Layer       │    │  AI Assistant    │                   │
│  │                  │    │                  │                   │
│  │  • Style Picker  │◄──►│  • Design Q&A    │                   │
│  │  • Param Controls│    │  • Suggestions   │                   │
│  │  • Preview Canvas│    │  • Explanations  │                   │
│  │  • Component Tree│    │  • Critiques     │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌─────────────────────────────────────────────┐                │
│  │            CONFIGURATION ENGINE              │                │
│  │                                              │                │
│  │  • Parametric Model (geometry)               │                │
│  │  • Constraint Solver                         │                │
│  │  • Proportional Systems                      │                │
│  │  • Joinery Rule Engine                       │                │
│  └──────────────────────┬──────────────────────┘                │
│                         │                                        │
│                         ▼                                        │
│  ┌─────────────────────────────────────────────┐                │
│  │      ★ KNOWLEDGE BASE CONNECTION ★          │                │
│  │                                              │                │
│  │  • Intelligent defaults with rationale       │                │
│  │  • Validation with explanations              │                │
│  │  • Contextual tooltips                       │                │
│  │  • Natural language param adjustments        │                │
│  └─────────────────────────────────────────────┘                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Current State (MVP):**
- React + TypeScript + Vite frontend
- React Three Fiber for 3D preview
- 6 furniture styles (Shaker, Mid-Century, Farmhouse, Japandi, Trestle, Mission)
- Context + Reducer state management
- Parameter validation engine
- Basic cut list generation

**Knowledge Integration (New):**
- Parameter explanations pulled from knowledge base
- Validation messages cite woodworking principles
- Style presets include historical context
- AI assistant for design guidance

### 3.2 Plan Builder

**Purpose:** Generate professional construction documents informed by best practices.

```
┌─────────────────────────────────────────────────────────────────┐
│                        PLAN BUILDER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────┐                │
│  │      ★ KNOWLEDGE-INFORMED GENERATION ★      │                │
│  │                                              │                │
│  │  • Wood movement allowances by species       │                │
│  │  • Grain orientation recommendations         │                │
│  │  • Assembly sequence from technique DB       │                │
│  │  • Tool requirements by operation            │                │
│  └──────────────────────┬──────────────────────┘                │
│                         │                                        │
│           ┌─────────────┼─────────────┐                         │
│           ▼             ▼             ▼                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                   │
│  │ Cut List   │ │ 2D Drawings│ │ Assembly   │                   │
│  │ + Notes    │ │ + Joinery  │ │ + Tips     │                   │
│  │            │ │            │ │            │                   │
│  │ Species-   │ │ Technique- │ │ Context-   │                   │
│  │ specific   │ │ aware      │ │ aware      │                   │
│  │ guidance   │ │ details    │ │ steps      │                   │
│  └────────────┘ └────────────┘ └────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Other Modules

The Renderer, Marketplace, and Community modules remain as previously specified, but all draw from the Knowledge Base for:

- **Renderer:** Material properties inform texture selection, finish appearance
- **Marketplace:** Complexity assessment, skill requirements, cost estimation
- **Community:** Technique tutorials, Q&A moderation, content validation

---

## 4. Technology Stack

### 4.1 Knowledge Base Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Vector DB** | Pinecone or Weaviate | Managed, scalable, metadata filtering |
| **Embeddings** | text-embedding-3-large | High quality, good for technical content |
| **LLM** | Claude 3.5 Sonnet | Strong reasoning, good at following instructions |
| **Orchestration** | LangChain or custom | RAG pipeline management |
| **Content Store** | PostgreSQL + S3 | Structured data + raw documents |
| **Processing** | Python (ingestion) | Strong NLP/ML libraries |

### 4.2 Full Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React + TypeScript | Existing investment |
| **3D Rendering** | Three.js / R3F | Existing investment |
| **Build Tool** | Vite | Existing, fast |
| **Backend** | Node.js + Fastify | JS ecosystem consistency |
| **API** | tRPC | Type-safe |
| **Database** | PostgreSQL | Robust, JSON support |
| **Auth** | Clerk | Managed, fast to implement |
| **Payments** | Stripe | Industry standard |
| **Hosting** | Vercel + Railway | Existing Vercel |
| **CDN** | Cloudflare | Fast, R2 for objects |

---

## 5. Content Acquisition Strategy

### 5.1 Source Priority

| Priority | Source Type | Examples | Acquisition Method |
|----------|-------------|----------|-------------------|
| **P0** | Structured reference data | Wood properties, joinery formulas | Manual curation, APIs |
| **P1** | Public domain / CC content | Historical references, basic techniques | Web scraping, digitization |
| **P2** | Licensed content | Fine Woodworking, books | Partnership or licensing |
| **P3** | Generated content | Synthesized from multiple sources | LLM with validation |

### 5.2 Content Licensing Considerations

**Questions to resolve:**
- Can we license Fine Woodworking article archives?
- Are there open-access woodworking databases?
- Can we partner with publishers for excerpts?
- What falls under fair use for RAG retrieval?

**Alternative: Build Original Content**
- Commission original technique articles
- Create our own reference database
- Invite community contributions
- Partner with woodworking influencers/educators

---

## 6. Parallel Development Strategy

With knowledge-first approach, work streams adjust:

```
┌─────────────────────────────────────────────────────────────────┐
│                   PARALLEL WORK STREAMS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Stream A: Knowledge Base (PRIORITY)                             │
│  ├── Agent 1: Content curation and ingestion pipeline           │
│  ├── Agent 2: Vector DB setup and RAG implementation            │
│  └── Agent 3: Knowledge API and integration hooks               │
│                                                                  │
│  Stream B: Configurator Enhancement                              │
│  ├── Agent 4: Knowledge-connected tooltips and explanations     │
│  ├── Agent 5: AI assistant chat interface                       │
│  └── Agent 6: Natural language parameter adjustments            │
│                                                                  │
│  Stream C: Export & Plans                                        │
│  ├── Agent 7: PDF generation with knowledge-informed content    │
│  ├── Agent 8: Cut list with species-specific notes              │
│  └── Agent 9: Assembly instructions from technique DB           │
│                                                                  │
│  Stream D: Infrastructure                                        │
│  ├── Agent 10: Backend API setup                                │
│  ├── Agent 11: Database and storage                             │
│  └── Agent 12: Authentication                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Open Questions & Decisions

### 7.1 Knowledge Base Decisions

| Question | Options | Impact |
|----------|---------|--------|
| Content licensing | License FWW vs create original | Time, cost, quality |
| Vector DB provider | Pinecone vs Weaviate vs Qdrant | Cost, features |
| Embedding model | OpenAI vs Cohere vs open-source | Quality, cost |
| RAG vs fine-tuning | RAG first vs hybrid | Complexity, performance |

### 7.2 Immediate Decisions Needed

1. **Content sources:** What materials do you have access to? What can be licensed?
2. **Budget for AI:** Vector DB and LLM API costs can scale
3. **Quality bar:** How much human validation before launch?

---

## 8. Summary

This architecture positions the **Woodworking Knowledge Base as the foundational differentiator**. Every module in the platform draws from this shared intelligence:

1. **Configurator** — Intelligent defaults, explanations, natural language
2. **Plan Builder** — Species-aware instructions, technique references
3. **Marketplace** — Complexity assessment, skill matching
4. **Community** — Q&A, tutorials, validated content

The knowledge base isn't an add-on feature — it's the core that makes this platform valuable versus any generic parametric modeler.

---

*Document Version: 2.0 (Knowledge-First Revision)*
*Last Updated: 2026-02-04*
