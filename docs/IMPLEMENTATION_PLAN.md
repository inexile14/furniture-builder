# Parametric Table Builder - Implementation Plan

## Overview

A professional web application for designing customizable tables with:
- 4 table types: Dining, Console, End, Bedside
- 4 design styles: Shaker, Mid-Century Modern, Farmhouse, Japanese-Modern
- Real-time 3D preview with exploded view
- Automatic joinery calculation based on woodworking conventions
- Shop-ready cut lists and dimensioned drawings

---

## Tech Stack

**Core:**
- **Framework:** React 18 + TypeScript + Vite
- **3D Graphics:** Three.js via React Three Fiber + Drei helpers
- **State:** React Context + useReducer (simple, no external deps)

**Styling:**
- **CSS:** Tailwind CSS
- **Theme:** Professional woodworking aesthetic (warm colors, clean lines)

**Export:**
- **PDF:** jsPDF + jspdf-autotable
- **SVG:** Custom drawing generator
- **CSV:** Native JS (Blob API)
- **ZIP:** JSZip (for build packages)

---

## Project Architecture

```
furniture-builder/
├── docs/                           # Documentation (current)
│   ├── SPECIFICATION.md
│   ├── types.ts
│   ├── JOINERY_CONVENTIONS.md
│   ├── STYLE_GUIDE.md
│   ├── CALCULATION_FORMULAS.md
│   ├── DEFAULTS.md
│   ├── REVIEW_AND_IMPROVEMENTS.md
│   └── IMPLEMENTATION_PLAN.md
│
├── src/
│   ├── types/
│   │   ├── index.ts                # Re-export all types
│   │   ├── table.ts                # TableParams, TableType, Style
│   │   ├── geometry.ts             # Point3D, PartGeometry, etc.
│   │   ├── joinery.ts              # JoineryParams, MortiseGeometry
│   │   └── cutlist.ts              # CutListItem, JoineryOperation
│   │
│   ├── constants/
│   │   ├── index.ts
│   │   ├── limits.ts               # Min/max values per table type
│   │   ├── materials.ts            # Wood species, thicknesses
│   │   └── stylePresets.ts         # Default values per style
│   │
│   ├── engine/
│   │   ├── calculations/
│   │   │   ├── joinery.ts          # Mortise-tenon calculations
│   │   │   ├── legs.ts             # Tapered, splayed, turned, square
│   │   │   ├── movement.ts         # Wood movement calculations
│   │   │   └── proportions.ts      # Golden ratio, stability checks
│   │   │
│   │   ├── geometry/
│   │   │   ├── tableGeometry.ts    # Main geometry generator
│   │   │   ├── topGeometry.ts      # Table top with edge profiles
│   │   │   ├── legGeometry.ts      # All leg styles
│   │   │   ├── apronGeometry.ts    # Aprons with profiles
│   │   │   ├── stretcherGeometry.ts
│   │   │   ├── drawerGeometry.ts
│   │   │   └── joineryGeometry.ts  # Visual tenon/mortise geometry
│   │   │
│   │   ├── validation.ts           # Structural validation rules
│   │   ├── cutListGenerator.ts     # Generate cut list from params
│   │   ├── drawingGenerator.ts     # SVG orthographic views
│   │   └── assemblySteps.ts        # Generate build instructions
│   │
│   ├── context/
│   │   ├── TableContext.tsx        # Global state provider
│   │   └── tableReducer.ts         # State update logic
│   │
│   ├── hooks/
│   │   ├── useTableGeometry.ts     # Memoized geometry generation
│   │   ├── useValidation.ts        # Real-time validation
│   │   └── useCutList.ts           # Memoized cut list generation
│   │
│   ├── components/
│   │   ├── App.tsx                 # Main layout (3-column)
│   │   │
│   │   ├── controls/
│   │   │   ├── ControlPanel.tsx    # Left sidebar container
│   │   │   ├── StyleSelector.tsx   # Style preset picker
│   │   │   ├── TableTypeSelector.tsx
│   │   │   ├── DimensionControls.tsx
│   │   │   ├── TopControls.tsx     # Thickness, edge, breadboard
│   │   │   ├── LegControls.tsx     # Style-aware leg options
│   │   │   ├── ApronControls.tsx
│   │   │   ├── StretcherControls.tsx
│   │   │   ├── DrawerControls.tsx
│   │   │   ├── JoineryControls.tsx # Override defaults
│   │   │   ├── MaterialSelector.tsx
│   │   │   └── NumberInput.tsx     # Reusable validated input
│   │   │
│   │   ├── preview/
│   │   │   ├── TablePreview.tsx    # Canvas container
│   │   │   ├── TableModel.tsx      # 3D assembly component
│   │   │   ├── TopMesh.tsx
│   │   │   ├── LegMesh.tsx         # Handles all leg styles
│   │   │   ├── ApronMesh.tsx
│   │   │   ├── StretcherMesh.tsx
│   │   │   ├── DrawerMesh.tsx
│   │   │   ├── JoineryMesh.tsx     # Tenon/mortise visualization
│   │   │   ├── ViewControls.tsx    # Camera presets, exploded toggle
│   │   │   └── Grid.tsx            # Reference grid
│   │   │
│   │   └── export/
│   │       ├── ExportPanel.tsx     # Right sidebar
│   │       ├── CutListPreview.tsx  # Tabular cut list display
│   │       ├── DrawingPreview.tsx  # SVG front/side/top views
│   │       ├── AssemblySteps.tsx   # Build instructions
│   │       └── ExportButtons.tsx   # PDF, CSV, ZIP download
│   │
│   ├── utils/
│   │   ├── math.ts                 # roundToNearest, degToRad, etc.
│   │   ├── format.ts               # Fraction display, dimensions
│   │   └── export.ts               # File generation utilities
│   │
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind + custom styles
│
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Project setup, type system, basic state management

**Tasks:**
1. Initialize Vite + React + TypeScript project
2. Install dependencies:
   ```bash
   npm install three @react-three/fiber @react-three/drei
   npm install tailwindcss postcss autoprefixer
   npm install jspdf jspdf-autotable jszip
   ```
3. Configure Tailwind with woodworking color palette
4. Create all type definitions from `/docs/types.ts`
5. Create constants (limits, materials, style presets)
6. Implement TableContext with reducer
7. Create basic validation utilities

**Deliverable:** Type-safe project skeleton with state management

---

### Phase 2: Calculation Engine (Week 2)

**Goal:** Implement all geometry and joinery calculations

**Tasks:**
1. **Joinery calculations** (`engine/calculations/joinery.ts`)
   - `calculateTenonThickness()` - 1/3 rule with chisel size rounding
   - `calculateTenonWidth()` - Rail height minus shoulders
   - `calculateTenonLength()` - Leg thickness × 0.65
   - `calculateMortiseDimensions()` - With clearances
   - `calculateHaunch()` - For top of leg joints
   - `calculateMiteredTenon()` - Corner joint calculations
   - `validateJoineryFeasibility()` - 6× width check, etc.

2. **Leg calculations** (`engine/calculations/legs.ts`)
   - `calculateTaperedLeg()` - Taper rate, angle, width at point
   - `calculateSplayedLeg()` - Compound angles, actual length
   - `calculateTurnedLegProfile()` - Pommel + profile elements
   - `calculateSquareLeg()` - Proportions, chamfer

3. **Wood movement** (`engine/calculations/movement.ts`)
   - `calculateWoodMovement()` - Width × coefficient × MC change
   - `calculateAttachmentAllowance()` - Groove depth, slot length
   - `calculateBreadboardElongation()` - Per-tenon hole lengths

4. **Proportions** (`engine/calculations/proportions.ts`)
   - `calculateGoldenProportions()`
   - `validateKneeClearance()`
   - `validateBaseStability()`
   - `calculateVisualWeight()`

**Deliverable:** Complete calculation library with unit tests

---

### Phase 3: Geometry Generation (Week 3)

**Goal:** Generate 3D geometry for all components

**Tasks:**
1. **Table top geometry**
   - Box geometry with edge profile options
   - Breadboard end geometry (if enabled)
   - UV mapping for wood grain direction

2. **Leg geometry**
   - Square legs (simple boxes with optional chamfer)
   - Tapered legs (custom vertices, 2-sided or 4-sided)
   - Splayed legs (rotated geometry with compound angles)
   - Turned legs (lathe geometry from profile curve)

3. **Apron geometry**
   - Straight, arched, scalloped, serpentine profiles
   - Correct positioning with setback

4. **Stretcher geometry**
   - H, box, X, and trestle configurations
   - Through-tenon proud ends (for farmhouse)

5. **Drawer geometry**
   - Box with front/back/sides/bottom
   - Correct positioning within apron opening

6. **Joinery visualization**
   - Tenon geometry (with haunch option)
   - Mortise cavity (for exploded view)
   - Assembly animation positions

**Deliverable:** Full 3D geometry generation system

---

### Phase 4: 3D Preview (Week 4)

**Goal:** Interactive 3D visualization

**Tasks:**
1. Set up React Three Fiber canvas
2. Implement OrbitControls with:
   - Mouse drag to rotate
   - Scroll to zoom
   - Camera reset button
3. Create material system:
   - Per-species wood colors
   - Subtle grain texture (procedural or images)
   - Highlight color for selected component
4. Implement table model assembly
5. Add exploded view:
   - Spring-animated explosion
   - Per-component offset directions
   - Reveal joinery details
6. Add component selection (click to highlight)
7. Camera presets (front, side, top, isometric)

**Deliverable:** Interactive 3D preview with exploded view

---

### Phase 5: Control Panel (Week 5)

**Goal:** Full parametric control UI

**Tasks:**
1. **Main selectors:**
   - Style dropdown (with visual preview cards)
   - Table type dropdown
   - Material dropdown

2. **Dimension controls:**
   - Length, width, height sliders
   - Real-time validation feedback
   - Seating capacity display (dining tables)

3. **Component controls:**
   - Top: thickness, edge profile, breadboard toggle
   - Legs: style, dimensions, taper/splay params
   - Aprons: height, thickness, profile, setback
   - Stretchers: enable, style, height, dimensions
   - Drawers: count, style, depth (console only)

4. **Joinery controls (advanced):**
   - Joint type override
   - Tenon ratio adjustments
   - Top attachment method
   - Show/hide joinery preview

5. **Responsive layout:**
   - Collapsible sections
   - Mobile hamburger menu
   - Touch-friendly sliders

**Deliverable:** Full parametric control interface

---

### Phase 6: Cut List & Output (Week 6)

**Goal:** Shop-ready documentation

**Tasks:**
1. **Cut list generator:**
   - Part enumeration (legs × 4, aprons × 4, etc.)
   - Grain direction for each part
   - Joinery operations list
   - Board feet calculation
   - Group by material

2. **Dimensioned drawings:**
   - Front view with width/height dimensions
   - Side view with depth dimensions
   - Top view (plan) with internal structure
   - Detail views for joinery
   - SVG output with proper scaling

3. **Assembly instructions:**
   - Logical build sequence
   - Tips for clamping/squaring
   - Joinery-specific guidance
   - Safety notes

4. **Export formats:**
   - PDF cut list (professional table layout)
   - PDF drawings (multiple pages)
   - CSV cut list (for spreadsheets)
   - Build package ZIP (all files)

**Deliverable:** Complete shop documentation system

---

### Phase 7: Polish (Week 7-8)

**Goal:** Production-ready application

**Tasks:**
1. **Performance:**
   - Geometry memoization
   - Lazy loading for controls
   - Debounced 3D updates

2. **Mobile optimization:**
   - Responsive breakpoints
   - Touch-friendly controls
   - Performance mode (lower poly)

3. **Error handling:**
   - Error boundaries for 3D crashes
   - Validation error display
   - Graceful degradation

4. **Testing:**
   - Unit tests for calculations
   - Integration tests for geometry
   - Visual regression tests

5. **Deployment:**
   - Build optimization
   - Vercel deployment
   - GitHub Actions CI/CD

**Deliverable:** Production-deployed application

---

## Key Implementation Details

### Style-Aware Controls

When user selects a style, the UI should:
1. Apply style preset defaults
2. Show/hide relevant controls (e.g., hide splay for Shaker)
3. Adjust validation limits (e.g., narrower overhang range for Japanese)
4. Update 3D preview immediately

```typescript
function applyStylePreset(style: Style, tableType: TableType): Partial<TableParams> {
  const preset = STYLE_PRESETS[style]
  const typeAdjustments = preset.tableTypeAdjustments[tableType] || {}

  return {
    ...preset.defaults,
    ...typeAdjustments
  }
}
```

### Joinery Auto-Calculation

Joinery dimensions should be calculated automatically but allow override:

```typescript
interface JoineryMode {
  mode: 'auto' | 'manual'
  overrides?: Partial<JoineryDimensions>
}

function getEffectiveJoinery(params: TableParams): JoineryDimensions {
  const auto = calculateJoineryDimensions(params)

  if (params.joineryMode === 'manual') {
    return { ...auto, ...params.joineryOverrides }
  }

  return auto
}
```

### 3D Performance Strategy

For complex tables (turned legs, many drawers):
1. Use instanced meshes where possible
2. Reduce turned leg segments based on camera distance
3. Skip joinery geometry unless exploded
4. Use lower-poly mode on mobile

```typescript
const QUALITY_SETTINGS = {
  low: { legSegments: 8, edgeSegments: 1 },
  medium: { legSegments: 16, edgeSegments: 2 },
  high: { legSegments: 32, edgeSegments: 4 }
}
```

---

## Open Decisions

### 1. Turned Leg Generation

**Options:**
- A) Parametric generation from profile curve (more flexible)
- B) 3-4 preset profiles as fixed geometry (simpler)

**Recommendation:** Option A with fallback to B for performance

### 2. Save/Load

**Options:**
- A) Local storage only (simplest, no backend)
- B) URL-encoded params (shareable links)
- C) Backend with user accounts (future monetization)

**Recommendation:** Start with A + B, add C later

### 3. Units

**Options:**
- A) Imperial only (US market focus)
- B) Imperial default with metric toggle
- C) Full metric support

**Recommendation:** Option B (small effort, broader market)

### 4. Material Affects Parameters

**Question:** Should selecting a wood species change default thicknesses?

**Recommendation:** Yes, subtly:
- Hardwoods: standard thicknesses
- Softwoods: slightly thicker defaults (structural)
- Display warning if softwood selected for turned legs

---

## Success Criteria

1. **Functionality:**
   - All 4 styles × 4 table types work correctly
   - Joinery calculations match woodworking conventions
   - Cut lists are accurate and buildable

2. **Performance:**
   - 3D preview loads in < 2 seconds
   - Parameter changes update in < 100ms
   - Works smoothly on mid-range mobile devices

3. **Quality:**
   - Generated designs are structurally sound
   - Proportions look correct to woodworkers
   - Exported drawings are shop-ready

4. **User Experience:**
   - Non-woodworkers can create good designs
   - Experienced woodworkers can fine-tune
   - Export process is intuitive

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Turned leg geometry too slow | Use LOD system, pre-computed profiles |
| Compound angles confusing | Provide lookup table, visual aid |
| Too many parameters overwhelm users | Style presets, progressive disclosure |
| 3D crashes on mobile | Error boundary, 2D fallback |
| Incorrect joinery calculations | Extensive unit tests, woodworker review |

---

*Implementation Plan Version: 1.0*
*Created: Based on comprehensive research and planning phase*
