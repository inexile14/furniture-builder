# Furniture Ecosystem — Master Planning Brief

## Context
You've been coding on this project for ~8 hours. We have an MVP parametric table designer in progress. This document defines the full product vision so you can produce a master architecture document and phased roadmap. Do not start building yet — produce the planning documents first.

## Vision
A first-of-its-kind platform connecting furniture designers, buyers, and makers to increase the amount of beautiful, custom furniture in the world.

**Core thesis:** As AI relieves humans of knowledge work, people will have more time to work with their hands, improve their spaces, and live creatively. COVID showed what happens when people stay home — this is the logical extension.

---

## Platform Components

### 1. Configurator (Web App)
A parametric furniture designer that allows users to:
- Choose a furniture type and style (mission, shaker, mid-century modern, etc.)
- Customize dimensions, proportions, joinery, edge treatments, wood species, hardware, and finish
- Access an AI-curated library of fine furniture designs, components, and details

The configurator should be trained on or informed by a deep knowledge base of real furniture design — historical styles, proportional systems, joinery types, wood properties, and construction best practices.

### 2. Photorealistic 3D Rendering
- Best-in-class photorealistic rendering of configured pieces
- Zoom, pan, and orbit controls
- Accurate material/texture representation (wood grain, finish sheen, hardware)

### 3. Plan Builder (Separate Module)
A best-in-class system that generates downloadable design packages from any configurator output:
- Cut lists with dimensions and material requirements
- Full-color detailed construction plans
- 2D drawings optimized for CNC (DXF/SVG)
- Assembly instructions and joinery details

This is its own project and must handle any valid configurator combination.

### 4. Marketplace
Users who design a piece but lack tools or skills can:
- Purchase the file/plan package for personal use (DIY)
- Post the project for makers to bid on
- Browse maker portfolios, references, reviews, and pricing
- Select a maker and manage the project through completion

### 5. Community & Network Module (Separate Project)
Manages the three-sided network:
- **Designers** — create and share/sell furniture designs
- **Consumers** — configure, purchase plans, or commission builds
- **Makers** — bid on projects, build portfolios, collect reviews

Includes profiles, messaging, reputation systems, and project management.

---

## Open Question: Fine-Tuned Woodworking Model

Should we train or fine-tune a model to become a domain expert in woodworking? Potential training sources: Fine Woodworking, Popular Woodworking, historical furniture references, joinery manuals, wood science literature, etc., refined with human feedback.

Please address in the planning document:
- Would this add meaningful value vs. prompt engineering + RAG over reference materials?
- What would the training pipeline look like?
- Where in the platform would the model be used (configurator intelligence, plan validation, user Q&A)?
- Is this feasible within our scope, or is it a future phase?

---

## Deliverables Requested

### A. Master Architecture Document
- Expand and refine the ideas above (add your own where you see gaps)
- Propose a technical architecture for the full ecosystem
- Define module boundaries, data flows, and integration points
- Recommend tech stack decisions with rationale
- Address how the existing parametric table designer MVP fits in

### B. Phased Roadmap
- Break the ecosystem into buildable phases
- Phase 1 should extend what we've already built
- Each phase should have clear scope, deliverables, and dependencies
- Flag risks, unknowns, and decision points we need to align on

---

*Do not begin implementation. Produce the planning documents so we can review and agree on direction together before writing more code.*
