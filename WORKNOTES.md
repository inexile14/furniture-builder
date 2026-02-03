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
- [ ] Mortise and tenon visualization
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
- `docs/JOINERY_CONVENTIONS.md` - Compound angle math documentation

## Session Log

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
