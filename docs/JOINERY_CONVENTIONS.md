# Joinery Conventions for Parametric Furniture

This document defines the rules and conventions used to automatically generate
joinery dimensions in the parametric table builder.

---

## Core Philosophy

Joinery should be:
1. **Structurally sound** - sized for the loads expected
2. **Proportional** - looks right at any scale
3. **Buildable** - achievable with common tools
4. **Conventional** - follows established woodworking practice

---

## Mortise and Tenon Fundamentals

### The Rule of Thirds

The most fundamental rule in mortise and tenon joinery:

```
TENON THICKNESS = STOCK THICKNESS / 3
```

**Rationale:** Dividing into thirds leaves adequate material on both faces
(cheeks) of the mortised piece and provides a tenon thick enough to resist shear.

**Examples:**
| Stock Thickness | Tenon Thickness | Each Cheek |
|-----------------|-----------------|------------|
| 3/4" (0.75")    | 1/4" (0.25")    | 1/4"       |
| 7/8" (0.875")   | 5/16" (0.3125") | 9/32"      |
| 1" (1.0")       | 5/16" or 3/8"   | 11/32"     |
| 1-1/4" (1.25")  | 3/8" or 7/16"   | 7/16"      |

**Rounding Rule:** Round tenon thickness to nearest standard chisel size:
- 1/4", 5/16", 3/8", 7/16", 1/2", 5/8", 3/4"

### Implementation

```typescript
function calculateTenonThickness(stockThickness: number): number {
  const idealThickness = stockThickness / 3

  // Standard chisel sizes in inches
  const chiselSizes = [0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75]

  // Find nearest chisel size
  return chiselSizes.reduce((prev, curr) =>
    Math.abs(curr - idealThickness) < Math.abs(prev - idealThickness) ? curr : prev
  )
}
```

---

## Tenon Dimensions

### Tenon Width

The tenon width is determined by the rail/apron height minus shoulders.

```
TENON WIDTH = RAIL HEIGHT - (2 × SHOULDER WIDTH)
```

**Shoulder Width Guidelines:**
- Minimum shoulder: 1/4" (for clean joint line)
- Standard shoulder: 3/8" (good visual, hides gaps)
- Heavy work: 1/2" (rustic/farmhouse)

**Calculation:**
```typescript
function calculateTenonWidth(railHeight: number, shoulderWidth: number = 0.375): number {
  const tenonWidth = railHeight - (2 * shoulderWidth)

  // Minimum tenon width check
  if (tenonWidth < 1.0) {
    console.warn('Tenon width very small - consider narrower shoulders')
  }

  return Math.max(tenonWidth, 0.75) // Absolute minimum
}
```

### Tenon Length

Tenon length determines joint strength. Deeper = stronger, but limited by mortised piece.

```
TENON LENGTH = LEG THICKNESS × 0.6 to 0.75
```

**Constraints:**
- Never penetrate opposite face of leg
- Leave minimum 1/4" at bottom of mortise (blind mortise)
- For through tenons: leg thickness + 1/4" proud

**Examples:**
| Leg Thickness | Tenon Length (65%) | Min. Remaining |
|---------------|--------------------| ---------------|
| 1.5"          | ~1"                | 0.5"           |
| 1.75"         | ~1.125"            | 0.625"         |
| 2"            | ~1.25"             | 0.75"          |
| 3" (farmhouse)| ~2"                | 1"             |

**Implementation:**
```typescript
function calculateTenonLength(
  legThickness: number,
  ratio: number = 0.65,
  isThroughTenon: boolean = false
): number {
  if (isThroughTenon) {
    return legThickness + 0.25 // 1/4" proud for wedging
  }

  const idealLength = legThickness * ratio
  const maxLength = legThickness - 0.25 // Leave 1/4" at bottom

  return Math.min(idealLength, maxLength)
}
```

---

## Mortise Dimensions

### Mortise Width

Mortise width equals tenon thickness plus a small clearance for glue.

```
MORTISE WIDTH = TENON THICKNESS + 1/32"
```

The 1/32" clearance:
- Allows tenon to enter without force-fitting dry
- Leaves room for glue
- Too much clearance = weak joint

### Mortise Height

```
MORTISE HEIGHT = TENON WIDTH + 1/32"
```

Same clearance reasoning as width.

### Mortise Depth

```
MORTISE DEPTH = TENON LENGTH + 1/16"
```

The extra 1/16" creates a "glue pocket" at the bottom where excess glue
can accumulate without preventing the tenon from seating fully.

### Mortise Position (Setback)

The mortise should be offset from the outside face of the leg:

```
MORTISE SETBACK = 3/16" to 1/4" from outside face
```

**Rationale:**
- Leaves material for cleanup/flush trimming
- Prevents tenon from showing on outside
- Creates visual shadow line at apron/leg junction

**Implementation:**
```typescript
interface MortisePosition {
  setbackFromOutsideFace: number  // X position
  distanceFromTop: number          // Y position (where mortise starts)
}

function calculateMortisePosition(
  legThickness: number,
  tenonThickness: number,
  shoulderWidth: number,
  setback: number = 0.1875  // 3/16" default
): MortisePosition {
  return {
    setbackFromOutsideFace: setback,
    distanceFromTop: shoulderWidth,
  }
}
```

---

## Corner Joints

When two aprons meet inside a leg (table corners), their tenons must
not collide inside the leg. Two approaches:

### Option 1: Mitered Tenons

Each tenon is cut at 45° where they would meet inside the leg.

```
┌──────────────────┐
│      LEG         │
│   ┌────┐         │
│   │    │ Apron 1 │
│   │  ╲ │ tenon   │
│   │   ╲│         │
│   │    ╲         │
│   │    │╲        │
│   │    │ ╲       │
│   │    │  ╲──────│── Apron 2 tenon
│   └────┘         │
│                  │
└──────────────────┘
```

**Advantages:**
- Maximum tenon length
- Maximum glue surface
- Traditional approach

**Calculation:**
```typescript
function calculateMiteredTenon(tenonLength: number): {
  effectiveLength: number
  miterAngle: number
} {
  return {
    effectiveLength: tenonLength,  // Full length maintained
    miterAngle: 45,  // degrees
  }
}
```

### Option 2: Shortened (Stub) Tenons

Each tenon stops before meeting the other.

```
┌──────────────────┐
│      LEG         │
│   ┌────┐         │
│   │    │ Apron 1 │
│   │    │ tenon   │
│   │    │ (short) │
│   │    │         │
│   │    │  gap    │
│   │    │         │
│   │    │         │
│   └────┴─────────│── Apron 2 tenon (short)
│                  │
└──────────────────┘
```

**Calculation:**
Each tenon shortened by ~3/8" so they don't touch:
```typescript
function calculateShortenedTenon(
  fullTenonLength: number,
  legThickness: number
): number {
  // Each tenon should stop with a gap in the middle
  const gapRequired = 0.25  // 1/4" gap between tenon ends
  const maxEachTenon = (legThickness - gapRequired) / 2

  return Math.min(fullTenonLength, maxEachTenon)
}
```

**Advantages:**
- Simpler to cut (no miters)
- Easier layout
- Good for less experienced makers

---

## Haunched Tenons

A haunch is a small step in the tenon that fills the gap at the top
of the leg where the groove for a panel (or just the mortise end) would
otherwise be open.

### When to Use

- **Table aprons:** Always recommended (top of leg is visible)
- **Panel frames:** Required (fills groove)
- **Stretchers:** Usually not needed

### Haunch Dimensions

```
HAUNCH WIDTH = 3/4" to 1" (or groove width if matching panel groove)
HAUNCH DEPTH = 3/8" to 1/2" (shallower than main tenon)
```

**Implementation:**
```typescript
interface HaunchDimensions {
  width: number
  depth: number
}

function calculateHaunch(
  isTopOfLeg: boolean,
  grooveWidth?: number
): HaunchDimensions | null {
  if (!isTopOfLeg) return null

  return {
    width: grooveWidth || 0.75,
    depth: 0.5,
  }
}
```

### Haunch Layout

```
        ← shoulder →
        ┌──────────┐
        │          │ ← haunch depth
   ─────┤  HAUNCH  ├─────
        │          │
        └──┬────┬──┘
           │    │
           │    │
           │MAIN│
           │TENON
           │    │
           │    │
           └────┘
```

---

## Table-Specific Joinery

### Leg-to-Apron Joint

Standard table leg-to-apron is mortise and tenon with:
- Haunched tenon (fills gap at top)
- Mitered or shortened at corners
- Setback from outside face

**Full Specification:**
```typescript
function calculateLegApronJoint(
  apronThickness: number,
  apronHeight: number,
  legThickness: number,
  isCornerLeg: boolean
): JointSpecification {
  const tenonThickness = calculateTenonThickness(apronThickness)
  const shoulderWidth = 0.375
  const tenonWidth = apronHeight - (2 * shoulderWidth)
  let tenonLength = legThickness * 0.65

  // Shorten for corner joints
  if (isCornerLeg) {
    tenonLength = calculateShortenedTenon(tenonLength, legThickness)
  }

  return {
    tenon: {
      thickness: tenonThickness,
      width: tenonWidth,
      length: tenonLength,
      shoulderWidth: shoulderWidth,
      haunch: { width: 0.75, depth: 0.5 },
    },
    mortise: {
      width: tenonThickness + 0.03125,
      height: tenonWidth + 0.03125,
      depth: tenonLength + 0.0625,
      setback: 0.1875,
    },
  }
}
```

### Stretcher Joinery

Stretchers typically use simpler joints since they're not at the top of legs.

**Standard Stretcher Tenon:**
```
STRETCHER TENON THICKNESS = STRETCHER THICKNESS / 3
STRETCHER TENON WIDTH = STRETCHER WIDTH - (2 × 3/8")
STRETCHER TENON LENGTH = LEG THICKNESS × 0.5
```

**Through Tenon (visible on outside):**
For farmhouse/arts-and-crafts style with decorative wedged through tenons:
```
TENON LENGTH = LEG THICKNESS + 1/4" (proud)
WEDGE SLOT = kerf width, perpendicular to grain, at 2/3 depth
```

### Top Attachment

Table tops must be attached to allow for seasonal wood movement.
The top expands/contracts across its width (perpendicular to grain).

**Movement Calculation:**
```
EXPECTED MOVEMENT = WIDTH × COEFFICIENT × MOISTURE_CHANGE

Typical coefficients (tangential, per 1% MC change):
- Red Oak: 0.00369
- Hard Maple: 0.00353
- Cherry: 0.00274
- Walnut: 0.00274

For 36" wide flat-sawn red oak top with 4% seasonal MC change:
Movement = 36 × 0.00369 × 4 = 0.53" total (~1/4" per side)

For quarter-sawn (radial coefficient ~0.00158):
Movement = 36 × 0.00158 × 4 = 0.23" total (~1/8" per side)
```

**Attachment Methods:**

1. **Wood Buttons (Traditional)**
   ```
   Button spacing: 12" - 16" apart
   Button thickness: 3/4"
   Tongue length: 3/4"
   Groove in apron:
     - Width: 3/8"
     - Depth: 3/8"
     - Distance from top of apron: 1/2"
   ```

2. **Figure-8 Fasteners (Quick)**
   ```
   Spacing: 16" - 24" apart
   Mortise in apron: diameter of fastener, depth = thickness
   One hole in top: #8 screw
   ```

3. **Elongated Screw Holes (Simple)**
   ```
   Slot length: 3/8" (allows 3/16" movement each way)
   Slot orientation: perpendicular to top's grain
   Only center screw is in round hole (keeps top centered)
   ```

---

## Compound Angles (Splayed Legs)

When legs are splayed (angled outward), aprons must be cut at compound
angles to meet them properly.

### The Math

For a leg splayed at angle θ from vertical:

```
APRON MITER ANGLE = arctan(tan(θ) × cos(45°))
APRON BEVEL ANGLE = arctan(tan(θ) × sin(45°))
```

For 10° leg splay:
- Miter angle ≈ 7.1°
- Bevel angle ≈ 7.1°

**Implementation:**
```typescript
function calculateCompoundAngles(splayAngle: number): {
  miterAngle: number
  bevelAngle: number
} {
  const splayRadians = splayAngle * Math.PI / 180
  const cornerAngle = 45 * Math.PI / 180  // 45° for rectangular table

  const miterRadians = Math.atan(Math.tan(splayRadians) * Math.cos(cornerAngle))
  const bevelRadians = Math.atan(Math.tan(splayRadians) * Math.sin(cornerAngle))

  return {
    miterAngle: miterRadians * 180 / Math.PI,
    bevelAngle: bevelRadians * 180 / Math.PI,
  }
}
```

### Mortise Angle

The mortise in a splayed leg must also be angled:
```
MORTISE ANGLE = same as leg splay angle
```

This is complex to cut and is one reason MCM furniture often uses
different joinery (dowels, loose tenons, mechanical fasteners).

---

## Practical Tolerances

### Fit Guidelines

| Joint Element | Target Fit | Tolerance |
|---------------|------------|-----------|
| Tenon in mortise (dry) | Slides in by hand, snug | +0.01" to +0.03" |
| Tenon thickness | Exact or very slightly under | -0.01" |
| Mortise width | Slightly over tenon | +1/32" |
| Shoulder gap | Zero (seated fully) | 0 |

### Glue Considerations

- **Gap-filling glue (polyurethane):** Up to 1/32" gap acceptable
- **PVA/Yellow glue:** Needs close fit, max 0.010" gap
- **Epoxy:** Very gap-filling, up to 1/16" acceptable

---

## Implementation Summary

### Master Function

```typescript
function generateJoinery(
  params: TableParams
): JoinerySpecification {
  const { aprons, legs, joinery, stretchers } = params

  // Calculate tenon dimensions
  const tenonThickness = calculateTenonThickness(aprons.thickness)
  const tenonWidth = calculateTenonWidth(aprons.height, joinery.tenonShoulderWidth)
  const baseTenonLength = legs.thickness * joinery.tenonLengthRatio

  // Adjust for corner joints
  const tenonLength = joinery.cornerJoint === 'shortened'
    ? calculateShortenedTenon(baseTenonLength, legs.thickness)
    : baseTenonLength

  // Calculate mortise
  const mortise = {
    width: tenonThickness + 0.03125,
    height: tenonWidth + 0.03125,
    depth: tenonLength + 0.0625,
    setback: joinery.mortiseSetback,
  }

  // Haunch for top of leg
  const haunch = joinery.haunched
    ? { width: 0.75, depth: 0.5 }
    : null

  // Handle splayed legs
  let compoundAngles = null
  if (legs.style === 'splayed' && legs.splayAngle) {
    compoundAngles = calculateCompoundAngles(legs.splayAngle)
  }

  // Stretcher joinery if applicable
  let stretcherJoinery = null
  if (stretchers.enabled) {
    stretcherJoinery = calculateStretcherJoinery(stretchers, legs)
  }

  return {
    legToApron: {
      tenon: {
        thickness: tenonThickness,
        width: tenonWidth,
        length: tenonLength,
        shoulderWidth: joinery.tenonShoulderWidth,
        haunch,
        miterAngle: joinery.cornerJoint === 'mitered' ? 45 : undefined,
      },
      mortise,
      compoundAngles,
    },
    stretcher: stretcherJoinery,
    topAttachment: joinery.topAttachment,
  }
}
```

---

## Cut List Integration

When generating cut lists, include joinery operations:

```typescript
interface JoineryOperation {
  type: 'mortise' | 'tenon' | 'groove' | 'haunch'
  position: string      // "both ends", "one end", "inside face"
  dimensions: {
    width?: number
    height?: number
    depth?: number
    length?: number
  }
  angle?: number        // For compound cuts
  notes?: string[]
}

// Example for apron:
const apronOperations: JoineryOperation[] = [
  {
    type: 'tenon',
    position: 'both ends',
    dimensions: {
      thickness: 0.25,
      width: 3.25,
      length: 1.125,
    },
    notes: ['Haunch: 3/4" × 1/2"', 'Miter at 45° for corner']
  }
]

// Example for leg:
const legOperations: JoineryOperation[] = [
  {
    type: 'mortise',
    position: 'inside faces, top',
    dimensions: {
      width: 0.28125,
      height: 3.28125,
      depth: 1.1875,
    },
    notes: ['Setback 3/16" from outside', '2 mortises per leg (adjacent faces)']
  }
]
```

---

*This document provides the foundation for auto-generating structurally sound,
proportionally correct joinery in the parametric table builder.*
