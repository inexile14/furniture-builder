# Parametric Table Builder - Technical Specification

## Project Overview

A parametric furniture design system that generates customizable table designs with:
- Multiple table types (dining, console, end tables, bedside tables)
- Multiple style presets (Shaker, Mid-Century Modern, Farmhouse, Japanese-Modern)
- Automatic joinery generation using woodworking conventions
- 3D preview with exploded view
- Shop drawings and cut lists

---

## Table Types

### Dining Table
Primary use: Seating for meals
- Seats: 4, 6, 8, or 10 people
- Standard height: 29-30" (allows for 12" apron-to-seat clearance with 18" chair)
- Width: 36-42" (36" minimum for comfortable facing diners)
- Length: Based on seating (24" per person on long sides)
- Typical features: Four legs, aprons on all sides, optional stretchers

### Console Table
Primary use: Entryway, behind sofa, hallway
- Standard height: 30-34" (30" for sofa back, 34" for entry)
- Depth: 12-18" (shallow profile)
- Length: 36-60" (depends on space)
- Typical features: Optional drawers (1-3), optional lower shelf, decorative front

### End Table (Future)
Primary use: Beside seating
- Standard height: 22-26" (matches sofa arm height)
- Dimensions: 18-24" square or round

### Bedside Table (Future)
Primary use: Beside bed
- Standard height: 24-28" (matches mattress top)
- Dimensions: 18-24" wide, 14-18" deep
- Features: Usually includes drawer

---

## Style Definitions

### 1. Shaker Style

**Philosophy:** "Beauty rests on utility." Simplicity, functionality, honest construction.

**Characteristics:**
- Tapered legs (two or four sides)
- Minimal overhang (3/4" - 1")
- Clean, square edges or subtle eased edges
- Visible but refined joinery
- Light, airy proportions

**Typical Dimensions:**
```
Leg: 1.75" square at top, tapers to 1" at bottom
Taper starts: 4-6" from top (below apron)
Apron height: 4-5"
Apron thickness: 3/4" - 7/8"
Top thickness: 7/8" - 1"
Overhang: 3/4" - 1"
```

**Joinery:**
- Mortise and tenon throughout
- Tenon: 1/3 of leg thickness
- Haunched tenons on aprons meeting at corner

### 2. Mid-Century Modern

**Philosophy:** Form follows function with sculptural flair. Visual lightness.

**Characteristics:**
- Splayed legs (angled outward 5-12°)
- Generous overhang (1.5" - 3")
- Tapered or beveled edges on top
- Low-profile aprons
- Often uses contrasting materials

**Typical Dimensions:**
```
Leg: 1.5" - 2" at widest, tapered
Leg splay: 8-12° typical
Apron height: 2.5" - 3.5" (minimal)
Apron thickness: 3/4"
Top thickness: 3/4" - 1" (can be thinner due to overhang)
Overhang: 2" - 3"
Edge bevel: 30-45° chamfer
```

**Joinery:**
- Compound angle mortise and tenon
- Leg-to-apron requires compound miter calculation
- Often uses mechanical fasteners hidden

### 3. Farmhouse / Country

**Philosophy:** Robust, built to last generations, rustic charm.

**Characteristics:**
- Chunky turned legs or heavy square legs
- Breadboard ends on top
- Substantial stretchers (often H or box configuration)
- Generous proportions throughout
- May show tool marks, rustic finish

**Typical Dimensions:**
```
Leg: 3" - 4" at thickest
Turned profile: baluster or vase shape
Apron height: 5" - 6"
Apron thickness: 7/8" - 1"
Top thickness: 1.25" - 1.5"
Overhang: 1" - 2"
Stretcher: 2" - 3" wide, 1" thick
```

**Joinery:**
- Heavy mortise and tenon
- Drawbored tenons (pegged)
- Breadboard with sliding dovetails or tongue-and-groove

### 4. Japanese-Modern (Minimalist)

**Philosophy:** Precision, restraint, perfect proportions, negative space.

**Characteristics:**
- Square legs, no taper
- Minimal or zero overhang
- Sharp, precise edges
- Very low aprons or none visible
- Floating appearance

**Typical Dimensions:**
```
Leg: 1.5" square (exactly)
Apron height: 2" - 2.5" (or hidden)
Apron thickness: 3/4"
Top thickness: 3/4" (precise, not chunky)
Overhang: 0" - 1/2" (often flush)
Chamfer: 1/16" - 1/8" (subtle)
```

**Joinery:**
- Precise mortise and tenon
- May use blind joints (no visible joinery)
- Mitered corners possible

---

## Joinery System

### Core Principle: Convention-Based Auto-Generation

The system will automatically calculate joinery dimensions based on established woodworking conventions. User can override but defaults follow rules.

### Mortise and Tenon Rules

**Tenon Thickness:**
```
tenon_thickness = stock_thickness / 3
```
- For 3/4" apron: 1/4" tenon
- For 7/8" apron: ~5/16" tenon (round to nearest 1/16")
- Keep tenon centered in stock

**Tenon Width:**
```
tenon_width = apron_height - (2 * shoulder)
shoulder = 1/4" to 3/8" typical
```
- For 4" apron with 3/8" shoulders: 3.25" tenon width

**Tenon Length:**
```
tenon_length = leg_thickness * 0.6 to 0.75
```
- For 1.75" leg: 1" - 1.25" tenon length
- Must not break through opposite face
- Leave 1/4" minimum at bottom of mortise

**Mortise Dimensions:**
```
mortise_width = tenon_thickness + 1/32" (glue allowance)
mortise_depth = tenon_length + 1/16" (glue pocket)
mortise_height = tenon_width + 1/32"
```

**Corner Joint Rules (where two aprons meet in leg):**
```
Option 1: Mitered tenons - each tenon mitered at 45° where they meet
Option 2: Shortened tenons - each tenon stops before meeting
  - Each tenon reduced by 1/4" to 3/8" where they would intersect
```

**Setback:**
```
mortise_setback = 1/8" to 1/4" from outside face of leg
```
- This creates a visual reveal and allows for cleanup

### Haunched Tenons

Used when apron is at top of leg (table aprons).

```
haunch_depth = 1/2" to 3/4"
haunch_width = 1/2" to 1"
```
- Haunch fills the gap that would otherwise be open at top of leg
- Adds resistance to twisting

### Stretcher Joinery

**Standard Stretcher Tenon:**
```
tenon_thickness = stretcher_thickness / 3
tenon_width = stretcher_width - (2 * 3/8" shoulder)
tenon_length = leg_thickness * 0.5
```

**Through Tenon (visible on outside):**
```
tenon_length = leg_thickness + 1/4" (proud)
wedge_slot = saw kerf width, centered
```

### Top Attachment

**Wood Buttons:**
```
button_spacing = 12" - 18" apart
button_thickness = 3/4"
groove_in_apron:
  - width = 3/8"
  - depth = 3/8"
  - distance_from_top = 1/2"
```

**Figure-8 Fasteners:**
```
spacing = 16" - 24" apart
mortise_depth = fastener_thickness (usually 1/8" - 3/16")
```

**Elongated Screw Holes:**
```
slot_length = 3/8" (allows ~1/4" movement)
slot_direction = perpendicular to grain of top
centered_screw_at_center_of_table_width
```

---

## Parameter System

### Global Parameters (Apply to all table types)

```typescript
interface GlobalParams {
  // Style
  style: 'shaker' | 'mid-century' | 'farmhouse' | 'japanese-modern'

  // Overall dimensions
  length: number      // inches
  width: number       // inches
  height: number      // inches

  // Top
  topThickness: number
  topOverhangFront: number
  topOverhangBack: number
  topOverhangSides: number
  topEdgeProfile: 'square' | 'eased' | 'beveled' | 'bullnose' | 'ogee'

  // Material (affects defaults)
  primaryWood: string  // for display/cut list
  secondaryWood?: string
}
```

### Leg Parameters

```typescript
interface LegParams {
  style: 'square' | 'tapered' | 'turned' | 'splayed'

  // Dimensions
  thickness: number         // at widest point

  // Taper (if style === 'tapered')
  taperStartFromTop: number // where taper begins
  taperEndDimension: number // final dimension at floor
  taperSides: 2 | 4         // inside faces or all faces

  // Splay (if style === 'splayed')
  splayAngle: number        // degrees

  // Turn profile (if style === 'turned')
  turnProfile: 'baluster' | 'vase' | 'cylinder' | 'custom'
  pommelLength: number      // square section at top

  // Placement
  insetFromEdge: number     // how far from table edge

  // Details
  chamfer: number           // edge chamfer
  foot: 'none' | 'tapered' | 'ball' | 'pad'
}
```

### Apron Parameters

```typescript
interface ApronParams {
  height: number
  thickness: number

  // Profile
  bottomProfile: 'straight' | 'arched' | 'scalloped'
  archHeight?: number       // if arched

  // Which sides have aprons
  sides: {
    front: boolean
    back: boolean
    left: boolean
    right: boolean
  }

  // Setback from leg face
  setback: number
}
```

### Stretcher Parameters

```typescript
interface StretcherParams {
  enabled: boolean
  style: 'H' | 'box' | 'X' | 'trestle' | 'none'

  heightFromFloor: number
  width: number
  thickness: number

  // For H-stretcher
  centerStretcherEnabled?: boolean
}
```

### Drawer Parameters (Console tables)

```typescript
interface DrawerParams {
  count: 0 | 1 | 2 | 3

  // Sizing (auto-calculated but overridable)
  height: number
  depth: number           // how deep drawer box is

  // Construction
  slideType: 'wood-runner' | 'side-mount' | 'under-mount'
  boxJoinery: 'dovetail' | 'rabbet' | 'dado'

  // Front
  frontStyle: 'inset' | 'overlay'
  frontReveal?: number    // gap for inset
  frontOverlay?: number   // overlap for overlay

  // Position
  verticalPosition: 'top' | 'center' | 'bottom'
  gap: number             // between multiple drawers
}
```

### Joinery Parameters

```typescript
interface JoineryParams {
  // Leg-to-apron
  legApronJoint: 'mortise-tenon' | 'domino' | 'dowel' | 'pocket-screw'
  tenonThicknessRatio: number   // default 0.333 (1/3)
  tenonLengthRatio: number      // default 0.65
  cornerJoint: 'mitered' | 'shortened'
  haunched: boolean

  // Top attachment
  topAttachment: 'buttons' | 'figure-8' | 'elongated-holes' | 'z-clips'
  attachmentSpacing: number

  // Stretcher
  stretcherJoint: 'mortise-tenon' | 'through-tenon' | 'half-lap'

  // Display
  showJoineryInPreview: boolean
}
```

---

## Style Presets

```typescript
const STYLE_PRESETS: Record<Style, Partial<AllParams>> = {
  'shaker': {
    leg: {
      style: 'tapered',
      thickness: 1.75,
      taperStartFromTop: 5,
      taperEndDimension: 1.125,
      taperSides: 2,
      insetFromEdge: 0.5,
      chamfer: 0.0625,
    },
    apron: {
      height: 4.5,
      thickness: 0.875,
      bottomProfile: 'straight',
      setback: 0.125,
      sides: { front: true, back: true, left: true, right: true },
    },
    top: {
      thickness: 0.875,
      overhangFront: 0.75,
      overhangBack: 0.75,
      overhangSides: 0.75,
      edgeProfile: 'eased',
    },
    stretcher: { enabled: false },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      topAttachment: 'buttons',
    },
  },

  'mid-century': {
    leg: {
      style: 'splayed',
      thickness: 1.5,
      splayAngle: 10,
      insetFromEdge: 1,
      chamfer: 0,
    },
    apron: {
      height: 3,
      thickness: 0.75,
      bottomProfile: 'straight',
      setback: 0.125,
      sides: { front: true, back: true, left: true, right: true },
    },
    top: {
      thickness: 0.875,
      overhangFront: 2,
      overhangBack: 2,
      overhangSides: 2,
      edgeProfile: 'beveled',
    },
    stretcher: { enabled: false },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      topAttachment: 'figure-8',
    },
  },

  'farmhouse': {
    leg: {
      style: 'turned',
      thickness: 3.5,
      turnProfile: 'baluster',
      pommelLength: 6,
      insetFromEdge: 1.5,
      chamfer: 0,
    },
    apron: {
      height: 5.5,
      thickness: 1,
      bottomProfile: 'arched',
      archHeight: 1,
      setback: 0.25,
      sides: { front: true, back: true, left: true, right: true },
    },
    top: {
      thickness: 1.25,
      overhangFront: 1.5,
      overhangBack: 1.5,
      overhangSides: 1.5,
      edgeProfile: 'square',
      breadboardEnds: true,
    },
    stretcher: {
      enabled: true,
      style: 'H',
      heightFromFloor: 6,
      width: 3,
      thickness: 1,
    },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'shortened',
      haunched: true,
      topAttachment: 'buttons',
      stretcherJoint: 'through-tenon',
    },
  },

  'japanese-modern': {
    leg: {
      style: 'square',
      thickness: 1.5,
      insetFromEdge: 0.25,
      chamfer: 0.0625,
    },
    apron: {
      height: 2.5,
      thickness: 0.75,
      bottomProfile: 'straight',
      setback: 0,  // flush with leg
      sides: { front: true, back: true, left: true, right: true },
    },
    top: {
      thickness: 0.75,
      overhangFront: 0.25,
      overhangBack: 0.25,
      overhangSides: 0.25,
      edgeProfile: 'square',
    },
    stretcher: { enabled: false },
    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      topAttachment: 'figure-8',
    },
  },
}
```

---

## Validation Rules

### Dimension Constraints

```typescript
const DINING_TABLE_LIMITS = {
  length: { min: 48, max: 120 },    // 4' to 10'
  width: { min: 30, max: 48 },      // 2.5' to 4'
  height: { min: 28, max: 32 },     // standard range
}

const CONSOLE_TABLE_LIMITS = {
  length: { min: 24, max: 72 },     // 2' to 6'
  width: { min: 10, max: 20 },      // shallow
  height: { min: 28, max: 36 },     // varies by use
}
```

### Structural Validation

```typescript
function validateStructure(params: AllParams): ValidationResult {
  const errors: string[] = []

  // Apron must fit within leg height minus top
  const availableForApron = params.height - params.top.thickness
  if (params.apron.height > availableForApron * 0.3) {
    errors.push('Apron too tall relative to table height')
  }

  // Leg inset must leave room for apron
  const minApronLength = params.length - (2 * params.leg.insetFromEdge) - (2 * params.leg.thickness)
  if (minApronLength < 12) {
    errors.push('Leg inset too large - not enough apron length')
  }

  // Tenon must fit in leg
  const tenonLength = params.apron.thickness * params.joinery.tenonLengthRatio
  const maxTenonLength = params.leg.thickness * 0.75
  if (tenonLength > maxTenonLength) {
    errors.push('Tenon would penetrate too far into leg')
  }

  // For splayed legs, check compound angle feasibility
  if (params.leg.style === 'splayed' && params.leg.splayAngle > 15) {
    errors.push('Leg splay angle exceeds practical limit')
  }

  return { valid: errors.length === 0, errors }
}
```

---

## Geometry Calculations

### Tapered Leg Geometry

```typescript
function calculateTaperedLeg(leg: LegParams, tableHeight: number): LegGeometry {
  const totalHeight = tableHeight - topThickness
  const taperLength = totalHeight - leg.taperStartFromTop

  // For two-sided taper (inside faces only)
  if (leg.taperSides === 2) {
    return {
      vertices: [
        // Top (square)
        { x: -leg.thickness/2, y: totalHeight, z: -leg.thickness/2 },
        { x: leg.thickness/2, y: totalHeight, z: -leg.thickness/2 },
        { x: leg.thickness/2, y: totalHeight, z: leg.thickness/2 },
        { x: -leg.thickness/2, y: totalHeight, z: leg.thickness/2 },
        // At taper start
        // ... same as top
        // At bottom (tapered on two inside faces)
        { x: -leg.thickness/2, y: 0, z: -leg.thickness/2 },
        { x: leg.thickness/2, y: 0, z: -leg.thickness/2 },
        { x: leg.taperEndDimension - leg.thickness/2, y: 0, z: leg.thickness/2 - (leg.thickness - leg.taperEndDimension) },
        { x: -leg.thickness/2, y: 0, z: leg.thickness/2 - (leg.thickness - leg.taperEndDimension) },
      ]
    }
  }
  // ... four-sided taper
}
```

### Splayed Leg Calculations

```typescript
function calculateSplayedLeg(leg: LegParams, tableHeight: number, position: 'FL'|'FR'|'BL'|'BR'): SplayedLegGeometry {
  const radians = leg.splayAngle * Math.PI / 180

  // Leg is longer when splayed
  const verticalHeight = tableHeight - topThickness
  const actualLength = verticalHeight / Math.cos(radians)

  // Foot position offset from top position
  const footOffset = verticalHeight * Math.tan(radians)

  // Compound angle for apron miter
  // The apron must be cut at a compound angle to meet the splayed leg
  const apronMiterAngle = Math.atan(Math.tan(radians) * Math.cos(45 * Math.PI / 180))
  const apronBevelAngle = Math.atan(Math.tan(radians) * Math.sin(45 * Math.PI / 180))

  return {
    actualLength,
    footOffset,
    apronMiterAngle: apronMiterAngle * 180 / Math.PI,
    apronBevelAngle: apronBevelAngle * 180 / Math.PI,
    rotation: getSplayRotation(position, radians),
  }
}

function getSplayRotation(position: string, radians: number): [number, number, number] {
  // Returns Euler angles for leg rotation
  switch(position) {
    case 'FL': return [-radians, 0, -radians]  // Front-left
    case 'FR': return [-radians, 0, radians]   // Front-right
    case 'BL': return [radians, 0, -radians]   // Back-left
    case 'BR': return [radians, 0, radians]    // Back-right
  }
}
```

### Mortise and Tenon Calculations

```typescript
function calculateMortiseAndTenon(
  apron: ApronParams,
  leg: LegParams,
  joinery: JoineryParams
): MortiseTenonGeometry {

  // Tenon dimensions based on conventions
  const tenonThickness = roundToNearest(
    apron.thickness * joinery.tenonThicknessRatio,
    1/16  // Round to 1/16"
  )

  const shoulderWidth = 0.375  // 3/8" typical shoulder
  const tenonWidth = apron.height - (2 * shoulderWidth)

  const tenonLength = roundToNearest(
    leg.thickness * joinery.tenonLengthRatio,
    1/16
  )

  // Mortise positioned with setback from outside face
  const mortiseSetback = 0.1875  // 3/16" from face

  // Haunch (if enabled)
  const haunch = joinery.haunched ? {
    width: 0.75,
    depth: 0.5,
  } : null

  return {
    tenon: {
      thickness: tenonThickness,
      width: tenonWidth,
      length: tenonLength,
      shoulderWidth,
    },
    mortise: {
      width: tenonThickness + 0.03125,  // 1/32" clearance
      height: tenonWidth + 0.03125,
      depth: tenonLength + 0.0625,       // 1/16" glue pocket
      setbackFromFace: mortiseSetback,
      distanceFromTop: shoulderWidth,
    },
    haunch,
  }
}
```

---

## Cut List Generation

### Part Naming Convention

```
{TableType}_{Component}_{Position}_{Detail}

Examples:
- DiningTable_Leg_FrontLeft
- DiningTable_Apron_Front
- DiningTable_Top_Main
- ConsoleTable_Drawer_1_Front
- ConsoleTable_Drawer_1_Side_Left
```

### Cut List Fields

```typescript
interface CutListItem {
  partName: string
  quantity: number
  lengthGrain: number      // dimension along grain
  widthCross: number       // dimension across grain
  thickness: number
  material: string
  notes: string            // "Taper inside faces", "45° miter both ends"

  // For joinery details
  joinery?: {
    mortises?: MortiseSpec[]
    tenons?: TenonSpec[]
    grooves?: GrooveSpec[]
  }
}
```

---

## 3D Preview Components

### Component Hierarchy

```
<TableModel>
  <Top />
  <Leg position="FL" />
  <Leg position="FR" />
  <Leg position="BL" />
  <Leg position="BR" />
  <Apron position="front" />
  <Apron position="back" />
  <Apron position="left" />
  <Apron position="right" />
  <Stretcher /> (if enabled)
  <Drawer /> (if console with drawers)
</TableModel>
```

### Exploded View Offsets

```typescript
const EXPLODE_OFFSETS = {
  top: { x: 0, y: 8, z: 0 },
  legs: { x: 3, y: 0, z: 3 },      // Each leg moves outward
  aprons: { x: 0, y: 0, z: 4 },    // Forward
  stretchers: { x: 0, y: -4, z: 0 }, // Down
  drawers: { x: 0, y: 0, z: 8 },    // Forward
}
```

---

## Implementation Phases

### Phase 1: Core Engine (Week 1-2)
- [ ] Project setup (Vite + React + Three.js + Tailwind)
- [ ] Type definitions
- [ ] Parameter validation
- [ ] Style preset system
- [ ] Basic geometry calculations

### Phase 2: Simple Tables (Week 3-4)
- [ ] Square leg geometry
- [ ] Tapered leg geometry
- [ ] Basic top
- [ ] Aprons
- [ ] 3D preview with orbit controls
- [ ] Shaker and Japanese-Modern presets working

### Phase 3: Advanced Legs (Week 5-6)
- [ ] Splayed leg geometry + compound angles
- [ ] Turned leg geometry (profiles)
- [ ] Mid-Century and Farmhouse presets
- [ ] Leg detail (chamfers, feet)

### Phase 4: Console Tables (Week 7-8)
- [ ] Table type selector
- [ ] Drawer system
- [ ] Lower shelf option
- [ ] Console-specific proportions

### Phase 5: Joinery & Output (Week 9-10)
- [ ] Mortise and tenon visualization
- [ ] Auto-generated joinery dimensions
- [ ] Cut list generator
- [ ] Shop drawings (SVG)
- [ ] PDF export

### Phase 6: Polish (Week 11-12)
- [ ] Mobile responsive
- [ ] Performance optimization
- [ ] Error handling
- [ ] User testing feedback

---

## Open Questions / Decisions Needed

1. **Turned legs:** Generate geometry programmatically or use predefined profiles?
   - Option A: Lathe-style geometry from profile curve
   - Option B: 3-4 preset turn profiles as models

2. **Breadboard ends:** Include in MVP or defer?
   - Adds complexity but very common for farmhouse

3. **Material selection:** Cosmetic only or affects parameters?
   - Different woods have different typical thicknesses

4. **Save/Load:** Local storage or backend for saved designs?

5. **Units:** Imperial only or also metric?

---

*Document Version: 0.1*
*Last Updated: [Current Date]*
