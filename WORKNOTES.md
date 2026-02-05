# Work Notes - Parametric Table Builder

## Current State
All core table geometry is working. Deployed to Vercel via GitHub.

## Completed Features

### Table Styles (5 options)
- [x] Shaker - tapered legs, clean lines
- [x] **Mid-Century Modern** - splayed legs with compound angle aprons
- [x] Farmhouse - turned legs, thick top
- [x] Japandi - square legs, box stretchers
- [x] **Trestle** - foot/leg/head/stretcher assembly

### Leg Types
- [x] Square
- [x] Tapered (2-sided and 4-sided)
- [x] Turned (with pommel)
- [x] **Splayed** (with taper and compound angles)

### Stretcher Styles
- [x] Box - 4 stretchers centered on legs
- [x] H - Front/back + center crossbar

### Other
- [x] GizmoViewcube for view orientation
- [x] Explosion view with animation
- [x] Multiple wood species with colors

---

## ROADMAP - Future Features

### Top Shapes
- [ ] Rectangular with rounded corners (for mid-century)
- [ ] Circular
- [ ] Elliptical

### Joinery
- [x] Mortise visualization (Manifold CSG)
- [ ] Tenon visualization
- [ ] Through-tenon, wedged tenon, tusked tenon
- [ ] Cut list generation with real calculations
- [ ] Shop drawings / DXF export

### UI/UX
- [ ] Style preset quick-select buttons
- [ ] Dimension labels on 3D model
- [ ] Save/load designs

---

## Key Files
- `src/components/preview/TableModel.tsx` - Main assembly, leg face normal computation
- `src/components/preview/ApronMesh.tsx` - Compound angle apron geometry
- `src/components/preview/LegMesh.tsx` - All leg styles including splayed
- `src/components/preview/TrestleMesh.tsx` - Trestle base
- `src/engine/manifold.ts` - Manifold WASM CSG operations
- `src/hooks/useManifold.ts` - React hooks for Manifold geometry
- `docs/JOINERY_CONVENTIONS.md` - Compound angle math documentation
- `docs/JOINERY_RESEARCH.md` - Industry standards for joinery dimensions

## Session Log

### 2026-02-05
- **Manifold CSG Integration for Mortise Visualization**
  - Installed manifold-3d library for robust boolean operations
  - Created `src/engine/manifold.ts` with geometry conversion functions
  - Created `src/hooks/useManifold.ts` with React hooks for async WASM loading
  - Mortises now show as actual 3D cavities cut into leg geometry

- **Extended Mortise Support to All Leg Types**
  - Square legs: Use `createBoxLegWithMortises()` - creates box and cuts mortises
  - All other legs (tapered, turned, splayed): Use `cutMortisesFromGeometry()` - converts existing geometry to Manifold, cuts mortises
  - Fixed `shouldShowMortises` in TableModel.tsx to enable for all leg types (was previously square-only)
  - Fixed turned leg geometry to be watertight (added cone caps) for Manifold compatibility

- **Joinery Research** (see `docs/JOINERY_RESEARCH.md`)
  - Documented industry standards for tenon dimensions (1/3 rule, 5x length rule, etc.)
  - Corner joint collision solutions (mitered tenons, shortened tenons)
  - Through-tenon, wedged tenon, tusked tenon variations
  - Parameter validation rules for future implementation

- **TODO for next session:**
  - Discuss parameter limits (mortises shouldn't be too close to leg top edge)
  - Test mortises on all leg styles
  - Potential: separate agent for branding/UI/UX work

### 2026-02-03
- Implemented trestle table style with proper foot/leg/head/stretcher
- Fixed stretcher positioning (centered on legs, no mortise penetration)
- **SOLVED: Compound angle geometry for splayed legs**
  - Key insight: compute actual leg face normals from geometry, not analytical formulas
  - See `docs/JOINERY_CONVENTIONS.md` for full documentation
- Added GizmoViewcube for view orientation
- Set up Git/GitHub repo: https://github.com/inexile14/furniture-builder
- Added CLAUDE.md for future Claude Code context
- Deployed to Vercel
