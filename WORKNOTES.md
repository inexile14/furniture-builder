# Work Notes - Parametric Table Builder

## Current Session Focus
Implementing table styles and stretchers for **dining tables**.

## Table Styles (5 options)
- Shaker - tapered legs, clean lines
- **Mid-Century Modern** - splayed legs toward corners, tapered from top, compound angle aprons, rounded corner top
- Farmhouse - beefy square legs, thick top
- Japandi - box stretchers, square legs
- **Trestle** - implemented with foot/leg/head/stretcher assembly

## Stretcher Styles (2 options, for non-trestle tables)
| Style | Status | Notes |
|-------|--------|-------|
| Box | Done | 4 stretchers, centered on legs |
| H | Done | Front/back + center crossbar |

## Trestle Table Structure (Complete)
- Foot: beveled top (flat center, slopes to ends), dado underneath
- Leg: rectangular, flush with foot width
- Head: mirror of foot (flat top, beveled bottom)
- Stretcher: connects leg assemblies at 55% height

---

## ROADMAP - Future Features

### Top Shapes (Not Yet Implemented)
- [ ] Rectangular (current default)
- [ ] Rectangular with rounded corners (for mid-century)
- [ ] Circular
- [ ] Elliptical

### Mid-Century Modern (In Progress)
- [ ] Splayed legs angled toward corners
- [ ] Square legs tapered from very top
- [ ] Compound angle apron cuts to mate with splayed legs
- [ ] Rounded corner tabletop

### Joinery (Later)
- [ ] Mortise and tenon visualization
- [ ] Cut list generation
- [ ] Shop drawings

---

## Key Files
- `src/components/preview/StretcherMesh.tsx` - Stretcher rendering
- `src/components/preview/TrestleMesh.tsx` - Trestle base rendering
- `src/components/preview/LegMesh.tsx` - Leg rendering
- `src/components/preview/ApronMesh.tsx` - Apron rendering
- `src/components/preview/TopMesh.tsx` - Tabletop rendering
- `src/constants/stylePresets.ts` - Style configurations

## Session Log

### 2026-02-03
- Implemented trestle table style with proper foot/leg/head/stretcher
- Fixed stretcher positioning (centered on legs, no mortise penetration)
- Cleaned up Japandi box stretchers
- Starting mid-century modern implementation
