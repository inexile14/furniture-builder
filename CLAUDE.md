# CLAUDE.md - Project Context for Claude Code

This file provides context for Claude Code sessions working on this project.

## Project Overview

**Parametric Table Builder** - A React Three Fiber application for designing custom furniture tables with real-time 3D preview. Users adjust parameters (dimensions, style, wood species) and see the table update live.

## Tech Stack

- **React 18** + TypeScript
- **React Three Fiber** (R3F) - React renderer for Three.js
- **@react-three/drei** - R3F helpers (OrbitControls, GizmoViewcube, etc.)
- **@react-spring/three** - Animation for explosion view
- **Vite** - Build tool
- **Tailwind CSS** - Styling

## Architecture

```
src/
├── components/
│   ├── App.tsx                    # Main layout (preview + controls)
│   ├── controls/
│   │   ├── ControlPanel.tsx       # Parameter adjustment UI
│   │   └── NumberInput.tsx        # Reusable number input
│   ├── preview/
│   │   ├── TablePreview.tsx       # Canvas + scene setup
│   │   ├── TableModel.tsx         # Main table assembly (orchestrates parts)
│   │   ├── TopMesh.tsx            # Tabletop geometry
│   │   ├── LegMesh.tsx            # Leg geometry (all styles)
│   │   ├── ApronMesh.tsx          # Apron geometry (compound angles!)
│   │   ├── StretcherMesh.tsx      # Stretcher geometry
│   │   ├── TrestleMesh.tsx        # Trestle base assembly
│   │   └── ViewControls.tsx       # Explosion toggle
│   └── export/
│       └── ExportPanel.tsx        # PDF/DXF export
├── context/
│   └── TableContext.tsx           # Global state (params, isExploded)
├── types/
│   └── table.ts                   # TypeScript interfaces
├── constants/
│   ├── index.ts                   # Colors, wood species
│   └── stylePresets.ts            # Default values per style
└── docs/                          # Design documentation
```

## Key Technical Solutions

### Compound Angle Geometry (IMPORTANT)

The hardest problem in this codebase is making apron ends mate perfectly with splayed, tapered legs. **Simple trigonometric formulas don't work** because splayed legs are also tapered, and the combination creates complex compound angles.

**The working solution:**

1. **Compute actual leg face normals** from geometry vertices in `TableModel.tsx`:
   - `computeLegFaceNormal()` calculates the world-space normal of each leg face
   - Accounts for splay rotation, taper, and Y-adjustment (keeping top/bottom horizontal)

2. **Pass normals to ApronMesh** via `legFaceNormals` prop

3. **Position apron end vertices** using the plane equation in `ApronMesh.tsx`:
   - `computeXShift()` transforms world normal to apron-local coords
   - Solves plane equation to find X position for each (Y, Z) vertex

See `docs/JOINERY_CONVENTIONS.md` section "Compound Angles (Splayed Legs)" for full documentation.

### Leg Geometry (LegMesh.tsx)

Splayed legs use custom BufferGeometry with:
- 8 vertices (4 top, 4 bottom) with different sizes for taper
- Y-adjustment per vertex to keep top/bottom faces horizontal after rotation
- Euler rotation (XYZ order) for splay

### Camera Controls

- **Left mouse**: Pan
- **Right mouse**: Orbit
- **Scroll**: Zoom (reversed direction)
- **GizmoViewcube**: Click faces/edges/corners to snap view

## Table Styles

| Style | Legs | Key Features |
|-------|------|--------------|
| Shaker | Tapered (2-sided) | Clean lines, traditional |
| Mid-Century | Splayed + Tapered | Compound angle aprons |
| Farmhouse | Turned | Thick top, stretchers |
| Japandi | Square | Box stretchers |
| Trestle | Trestle assembly | Foot/leg/head/stretcher |

## Current State (2026-02-03)

- All leg styles working including splayed with compound angles
- All stretcher configurations working
- Trestle tables complete
- GizmoViewcube added for view orientation
- Export panel exists (needs work)
- Deployed to Vercel via GitHub

## Known Issues / TODOs

1. **Export panel** - PDF cut list needs real calculations
2. **Top shapes** - Only rectangular implemented (rounded corners, circular, elliptical planned)
3. **Joinery visualization** - Mortise/tenon not rendered
4. **Drawer support** - Not implemented

## Testing Changes

The dev server runs at `http://localhost:5173/`. Key test cases for geometry changes:

1. **Standard legs**: Any style except splayed - verify basic rendering
2. **Splayed legs**: Select "Mid-Century Modern" preset
   - Check all 4 aprons meet legs without gaps
   - Rotate view to verify alignment from multiple angles
3. **Explosion view**: Toggle to verify parts animate apart cleanly

## Documentation

- `docs/JOINERY_CONVENTIONS.md` - Joinery rules and compound angle math
- `docs/CALCULATION_FORMULAS.md` - General geometry formulas
- `docs/SPECIFICATION.md` - Original design spec
- `WORKNOTES.md` - Session-by-session progress log
