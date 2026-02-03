# Parametric Table Builder - Calculation Formulas

This document contains all mathematical formulas and rules for generating accurate
furniture geometry programmatically.

---

## 1. Mortise and Tenon Joinery

### 1.1 Core Proportions

```typescript
// Tenon Thickness (The 1/3 Rule)
const tenonThickness = Math.min(railThickness, mortiseStockThickness) / 3;

// Tenon Width
const tenonWidth = railWidth / 2;

// Max Tenon Width Constraint (use double tenons if exceeded)
const maxTenonWidth = tenonThickness * 6;

// Tenon Length (into mortise)
const minTenonLength = tenonThickness * 5;
const optimalTenonLength = legWidth * 0.67; // 2/3 of leg width

// Mortise Depth
const mortiseDepth = tenonLength + (1/16); // 1/16" clearance for glue

// Shoulder Dimensions
const shoulderThickness = (railThickness - tenonThickness) / 2;
```

### 1.2 Mitered Corner Tenons

When two aprons meet at a corner leg:

```typescript
function calculateMiteredTenon(legWidth: number, apronThickness: number, setback: number) {
  const mortiseOffset = setback + (apronThickness - tenonThickness) / 2;
  const maxTenonLength = (legWidth - mortiseOffset) * 0.95;
  const miterAngle = 45; // degrees

  return {
    tenonLength: maxTenonLength,
    miterAngle,
    // Miter starts at this depth into the leg
    miterStartDepth: maxTenonLength - (legWidth - 2 * mortiseOffset) / Math.sqrt(2)
  };
}
```

### 1.3 Haunched Tenons

For L-joints at corners where mortise approaches edge:

```typescript
function calculateHaunch(tenonWidth: number, isHardwood: boolean) {
  return {
    haunchWidth: tenonWidth / (isHardwood ? 3 : 2), // 1/3 hardwood, 1/2 softwood
    haunchDepth: tenonThickness // or groove depth for panels
  };
}
```

### 1.4 Double/Twin Tenons

Use when rail width exceeds 6× tenon thickness:

```typescript
function needsDoubleTenon(railWidth: number, tenonThickness: number): boolean {
  return railWidth > tenonThickness * 6;
}

function calculateDoubleTenons(railWidth: number, tenonThickness: number) {
  const totalTenonArea = railWidth * (2/3);
  const tenonCount = 2;
  const tenonWidth = totalTenonArea / tenonCount;
  const gapWidth = railWidth / 3 / (tenonCount - 1);

  return { tenonCount, tenonWidth, gapWidth };
}
```

---

## 2. Leg Geometry

### 2.1 Tapered Legs (Shaker Style)

```typescript
interface TaperedLegParams {
  topWidth: number;      // Width at top (e.g., 2.5")
  bottomWidth: number;   // Width at bottom (e.g., 1.5")
  totalLength: number;   // Full leg length
  taperStartFromTop: number; // Where taper begins (below apron)
}

function calculateTaper(params: TaperedLegParams) {
  const taperLength = params.totalLength - params.taperStartFromTop;
  const taperRate = (params.topWidth - params.bottomWidth) / taperLength;
  const taperAngle = Math.atan((params.topWidth - params.bottomWidth) / (2 * taperLength));

  // Get width at any point along leg
  function widthAtPoint(distanceFromTop: number): number {
    if (distanceFromTop <= params.taperStartFromTop) {
      return params.topWidth; // Still in square section
    }
    const taperDistance = distanceFromTop - params.taperStartFromTop;
    const ratio = taperDistance / taperLength;
    return params.topWidth - (params.topWidth - params.bottomWidth) * ratio;
  }

  return {
    taperRate,          // inches per inch
    taperAngle,         // radians
    taperRatio: `1:${Math.round(taperLength / (params.topWidth - params.bottomWidth))}`,
    widthAtPoint
  };
}
```

**Two-Sided Taper** (inside faces only - traditional Shaker):
- Taper on inside two faces toward table center
- Outside faces remain perpendicular

**Four-Sided Taper** (all faces):
- More refined, lighter appearance
- Requires more precise machining

### 2.2 Splayed Legs (Mid-Century Modern)

```typescript
interface SplayedLegParams {
  verticalHeight: number;   // Desired table height
  splayFrontDeg: number;    // Front splay angle (degrees)
  splaySideDeg: number;     // Side splay angle (degrees)
}

function calculateSplayedLeg(params: SplayedLegParams) {
  const α = params.splayFrontDeg * Math.PI / 180;
  const β = params.splaySideDeg * Math.PI / 180;

  // Resultant angle from vertical
  const resultantAngle = Math.acos(Math.cos(α) * Math.cos(β));

  // Required leg length (longer than vertical height)
  const legLength = params.verticalHeight / Math.cos(resultantAngle);

  // Foot offset from directly below top attachment
  const footOffsetFront = legLength * Math.sin(α);
  const footOffsetSide = legLength * Math.sin(β);

  // Compound miter angles for joinery
  const miterAngle = Math.atan(Math.tan(β) / Math.tan(α)) * 180 / Math.PI;
  const bevelAngle = resultantAngle * 180 / Math.PI;

  // Apron end cut angles
  const frontApronEndAngle = 90 - params.splayFrontDeg;
  const sideApronEndAngle = 90 - params.splaySideDeg;

  return {
    legLength,
    resultantAngle: resultantAngle * 180 / Math.PI,
    footOffset: { front: footOffsetFront, side: footOffsetSide },
    compoundAngles: { miter: miterAngle, bevel: bevelAngle },
    apronEndCuts: { front: frontApronEndAngle, side: sideApronEndAngle }
  };
}
```

**Splay Angle Reference Table:**
| Angle | Miter Setting | Bevel Setting |
|-------|---------------|---------------|
| 5°    | 45.3°         | 4.9°          |
| 8°    | 45.8°         | 7.9°          |
| 10°   | 46.2°         | 9.8°          |
| 12°   | 46.9°         | 11.8°         |
| 15°   | 48.1°         | 14.5°         |

### 2.3 Turned Legs (Farmhouse)

```typescript
interface TurnedLegParams {
  totalLength: number;
  maxDiameter: number;
  minDiameter: number;
  pommelLength: number;  // Square section for joinery
}

function calculatePommel(apronHeight: number, legSize: number) {
  const setback = 0.25; // inches from top of leg
  const transitionLength = 0.75;
  const pommelLength = apronHeight + setback + transitionLength;

  return {
    pommelLength,
    mortiseZone: {
      top: setback,
      bottom: setback + apronHeight,
      width: legSize * 0.4,
      depth: legSize * 0.5
    },
    transitionStart: setback + apronHeight,
    firstTurningPoint: pommelLength
  };
}

// Vase profile follows sine curve
function vaseProfile(position: number, maxDia: number, minDia: number): number {
  // position: 0 to 1 along vase length
  const radius = (minDia / 2) + ((maxDia - minDia) / 2) * Math.sin(position * Math.PI);
  return radius;
}
```

### 2.4 Square Legs (Japanese-Modern)

```typescript
function calculateSquareLeg(tableHeight: number, tableType: string) {
  const ratios: Record<string, number> = {
    dining: 18,
    coffee: 12,
    side: 16,
    console: 20
  };

  const legSize = tableHeight / ratios[tableType];
  const PHI = 1.618;

  return {
    legSize,
    setback: legSize * PHI,
    apronHeight: tableHeight / 8,
    chamfer: {
      subtle: legSize * 0.08,
      standard: legSize * 0.125,
      bold: legSize * 0.2
    }
  };
}

function calculateChamfer(legSize: number, style: 'subtle' | 'standard' | 'bold', angle = 45) {
  const ratios = { subtle: 0.08, standard: 0.125, bold: 0.2 };
  const faceWidth = legSize * ratios[style];
  const depth = faceWidth / Math.tan(angle * Math.PI / 180);

  return {
    faceWidth,
    depth,
    angle,
    remainingFace: legSize - (2 * faceWidth)
  };
}
```

---

## 3. Wood Movement

### 3.1 Dimensional Change Calculation

```typescript
interface WoodMovementParams {
  width: number;           // Board width in inches
  species: string;         // Wood species
  grainType: 'flat' | 'quarter';  // Flat-sawn vs quarter-sawn
  mcChange: number;        // Moisture content change (typically 3-4%)
}

// Dimensional change coefficients per 1% MC change
const COEFFICIENTS: Record<string, { tangential: number; radial: number }> = {
  mahogany:   { tangential: 0.00250, radial: 0.00150 },
  walnut:     { tangential: 0.00274, radial: 0.00190 },
  cherry:     { tangential: 0.00270, radial: 0.00140 },
  white_oak:  { tangential: 0.00365, radial: 0.00180 },
  red_oak:    { tangential: 0.00369, radial: 0.00158 },
  hard_maple: { tangential: 0.00353, radial: 0.00165 },
  beech:      { tangential: 0.00431, radial: 0.00190 },
  teak:       { tangential: 0.00230, radial: 0.00140 },
  ash:        { tangential: 0.00290, radial: 0.00170 }
};

function calculateWoodMovement(params: WoodMovementParams): number {
  const coeff = COEFFICIENTS[params.species] || COEFFICIENTS.red_oak;
  const coefficient = params.grainType === 'flat' ? coeff.tangential : coeff.radial;

  return params.width * coefficient * params.mcChange;
}

// Movement from center (for attachment calculations)
function calculateMovementFromCenter(tableWidth: number, species: string, grainType: 'flat' | 'quarter', mcChange = 4) {
  const totalMovement = calculateWoodMovement({ width: tableWidth, species, grainType, mcChange });
  return totalMovement / 2;
}
```

### 3.2 Top Attachment Calculations

```typescript
function calculateTopAttachment(tableWidth: number, species: string, grainType: 'flat' | 'quarter') {
  const movement = calculateMovementFromCenter(tableWidth, species, grainType);
  const safetyFactor = 1.25;

  return {
    // Button groove depth
    grooveDepth: 0.375 + movement, // 3/8" base + movement

    // Slotted hole length (for screw attachment)
    slotLength: Math.max(0.125, movement * safetyFactor),

    // Figure-8 fasteners only suitable up to this width
    figure8MaxWidth: 18,

    // Recommended method
    method: tableWidth <= 18 ? 'figure_8' : 'wood_button'
  };
}
```

### 3.3 Breadboard End Calculations

```typescript
interface BreadboardParams {
  tableWidth: number;
  topThickness: number;
  species: string;
}

function calculateBreadboardJoinery(params: BreadboardParams) {
  const tongueThickness = params.topThickness / 3;
  const tongueLength = Math.max(0.75, params.topThickness * 0.67);
  const grooveDepth = tongueLength + 0.25;

  // Tenon count: minimum 3, one per 8"
  const tenonCount = Math.max(3, Math.ceil(params.tableWidth / 8));
  const centerTenonIndex = Math.floor(tenonCount / 2);

  // Movement calculation for elongated holes
  const coeff = COEFFICIENTS[params.species] || COEFFICIENTS.red_oak;
  const mcSwing = 4;

  const tenons = [];
  for (let i = 0; i < tenonCount; i++) {
    const distanceFromCenter = Math.abs(i - centerTenonIndex) * (params.tableWidth / tenonCount);
    const isCenter = i === centerTenonIndex;

    tenons.push({
      index: i,
      isCenter,
      holeType: isCenter ? 'round' : 'elongated',
      glued: isCenter,
      drawboreOffset: isCenter ? 0.03125 : 0, // 1/32"
      elongatedHoleLength: isCenter ? 0 : Math.max(0.5, distanceFromCenter * coeff.tangential * mcSwing * 1.5)
    });
  }

  return {
    tongueThickness,
    tongueLength,
    grooveDepth,
    tenonCount,
    tenons
  };
}
```

---

## 4. Table Proportions

### 4.1 Dining Table Dimensions

```typescript
interface DiningTableDefaults {
  // Heights
  standardHeight: number;
  counterHeight: number;
  barHeight: number;

  // Width per person
  widthPerPerson: number;
  minWidthPerPerson: number;
  placeSettingDepth: number;

  // Clearances
  kneeHeight: number;  // Minimum from floor to apron bottom
}

const DINING_DEFAULTS: DiningTableDefaults = {
  standardHeight: 30,
  counterHeight: 36,
  barHeight: 42,
  widthPerPerson: 24,
  minWidthPerPerson: 20,
  placeSettingDepth: 15,
  kneeHeight: 24
};

function calculateSeatingCapacity(tableLength: number, tableWidth: number): number {
  const personsPerSide = Math.floor(tableLength / DINING_DEFAULTS.widthPerPerson);
  const endSeats = tableWidth >= 36 ? 2 : 0;
  return personsPerSide * 2 + endSeats;
}

function validateKneeClearance(tableHeight: number, topThickness: number, apronHeight: number): boolean {
  const clearance = tableHeight - topThickness - apronHeight;
  return clearance >= DINING_DEFAULTS.kneeHeight;
}
```

### 4.2 Console Table Dimensions

```typescript
interface ConsoleTableDefaults {
  height: { min: number; max: number; default: number };
  depth: { min: number; max: number; default: number };
  length: { min: number; max: number; default: number };
  drawerFaceHeight: { min: number; max: number; default: number };
  lowerShelfHeight: { min: number; max: number; default: number };
}

const CONSOLE_DEFAULTS: ConsoleTableDefaults = {
  height: { min: 26, max: 36, default: 32 },
  depth: { min: 10, max: 24, default: 14 },
  length: { min: 24, max: 72, default: 42 },
  drawerFaceHeight: { min: 4, max: 8, default: 5 },
  lowerShelfHeight: { min: 6, max: 12, default: 8 }
};

// Sofa table specific: height relative to sofa back
function calculateSofaTableHeight(sofaBackHeight: number): number {
  return sofaBackHeight - 2;
}

// Length relative to sofa
function calculateSofaTableLength(sofaLength: number): number {
  return sofaLength * 0.67; // 2/3 of sofa length
}
```

### 4.3 Golden Ratio Applications

```typescript
const PHI = 1.618;
const INVERSE_PHI = 0.618;

function goldenProportions(referenceDimension: number) {
  return {
    larger: referenceDimension * PHI,
    smaller: referenceDimension * INVERSE_PHI,
    // Visual distribution
    primaryPortion: 0.62, // 62%
    secondaryPortion: 0.38 // 38%
  };
}

// Base stability rule
function calculateMinBaseWidth(tableHeight: number): number {
  return tableHeight * 0.6; // Base >= 60% of height
}

// Leg to top thickness relationship
function calculateLegWidth(topThickness: number): number {
  return topThickness * 2 + 0.5;
}
```

---

## 5. Style-Specific Defaults

### 5.1 Shaker Style

```typescript
const SHAKER_DEFAULTS = {
  leg: {
    style: 'tapered' as const,
    taperSides: 2 as const, // Inside faces only
    topDimension: 2.5,
    bottomDimension: 1.5,
    taperStartFromApron: 1.0
  },
  top: {
    thickness: 0.875,
    edgeProfile: 'eased' as const,
    overhang: 2.0
  },
  apron: {
    height: 4.0,
    thickness: 0.75,
    setback: 0.125,
    profile: 'straight' as const
  },
  joinery: {
    type: 'mortise-tenon' as const,
    haunched: true,
    cornerStyle: 'mitered' as const
  }
};
```

### 5.2 Mid-Century Modern Style

```typescript
const MID_CENTURY_DEFAULTS = {
  leg: {
    style: 'splayed' as const,
    splayAngle: 8, // degrees
    topDimension: 1.75,
    bottomDimension: 1.0,
    insetFromEdge: 1.5
  },
  top: {
    thickness: 0.75,
    edgeProfile: 'beveled' as const,
    bevelAngle: 20,
    overhang: 3.0
  },
  apron: {
    height: 2.5, // Shallow for "floating" look
    thickness: 0.75,
    setback: 0,
    profile: 'straight' as const
  },
  joinery: {
    type: 'mortise-tenon' as const,
    haunched: false,
    cornerStyle: 'mitered' as const
  }
};
```

### 5.3 Farmhouse Style

```typescript
const FARMHOUSE_DEFAULTS = {
  leg: {
    style: 'turned' as const,
    maxDiameter: 4.0,
    minDiameter: 2.5,
    pommelLength: 5.0,
    turnProfile: 'baluster' as const
  },
  top: {
    thickness: 1.75,
    edgeProfile: 'eased' as const,
    overhang: 3.5,
    breadboardEnds: true
  },
  apron: {
    height: 5.0,
    thickness: 1.0,
    setback: 0.25,
    profile: 'straight' as const
  },
  stretchers: {
    enabled: true,
    style: 'H' as const,
    heightFromFloor: 8.0
  },
  joinery: {
    type: 'mortise-tenon' as const,
    haunched: true,
    cornerStyle: 'mitered' as const
  }
};
```

### 5.4 Japanese-Modern Style

```typescript
const JAPANESE_MODERN_DEFAULTS = {
  leg: {
    style: 'square' as const,
    dimension: 1.75,
    chamfer: 0.0625, // 1/16" or none
    insetFromEdge: 0.75
  },
  top: {
    thickness: 0.875,
    edgeProfile: 'square' as const,
    overhang: 1.0 // Minimal
  },
  apron: {
    height: 2.5,
    thickness: 0.75,
    setback: 0, // Flush
    profile: 'straight' as const
  },
  joinery: {
    type: 'mortise-tenon' as const,
    haunched: false,
    cornerStyle: 'mitered' as const,
    visible: true // Exposed joinery as feature
  }
};
```

---

## 6. Drawer Calculations

### 6.1 Drawer Box Sizing

```typescript
interface DrawerSizingParams {
  openingWidth: number;
  openingHeight: number;
  cabinetDepth: number;
  slideType: 'side_mount' | 'undermount' | 'wood_runner';
  materialThickness: number;
}

const DRAWER_CLEARANCES = {
  side_mount:   { width: 1.0625, height: 0.75, depth: 1.0 },
  undermount:   { width: 0.25, height: 0.875, depth: 1.0 },
  wood_runner:  { width: 0.125, height: 0.25, depth: 0.5 }
};

function calculateDrawerBox(params: DrawerSizingParams) {
  const clearance = DRAWER_CLEARANCES[params.slideType];

  return {
    width: params.openingWidth - clearance.width,
    height: params.openingHeight - clearance.height,
    depth: params.cabinetDepth - clearance.depth,

    // Joinery
    jointDepth: params.materialThickness / 2,
    jointWidth: params.materialThickness / 2,

    // Bottom groove (for undermount compatibility)
    grooveWidth: 0.25,
    grooveDepth: 0.25,
    grooveFromBottom: 0.5
  };
}
```

### 6.2 Drawer Front Sizing

```typescript
interface DrawerFrontParams {
  openingWidth: number;
  openingHeight: number;
  frontStyle: 'inset' | 'overlay';
  gap?: number;
  overlayAmount?: number;
}

function calculateDrawerFront(params: DrawerFrontParams) {
  if (params.frontStyle === 'inset') {
    const gap = params.gap || 0.09375; // 3/32" default
    return {
      width: params.openingWidth - (gap * 2),
      height: params.openingHeight - (gap * 2)
    };
  } else {
    const overlay = params.overlayAmount || 0.5;
    const reveal = 0.125; // 1/8" between fronts
    return {
      width: params.openingWidth + (overlay * 2),
      height: params.openingHeight + (overlay * 2) - reveal
    };
  }
}
```

---

## 7. Cut List Generation

### 7.1 Part Naming Convention

```typescript
type PartCategory = 'top' | 'leg' | 'apron' | 'stretcher' | 'drawer' | 'shelf';
type Position = 'FL' | 'FR' | 'BL' | 'BR' | 'front' | 'back' | 'left' | 'right';

function generatePartId(category: PartCategory, position?: Position, index?: number): string {
  const base = category.toUpperCase();
  const pos = position ? `-${position}` : '';
  const idx = index !== undefined ? `-${index}` : '';
  return `${base}${pos}${idx}`;
}
```

### 7.2 Board Foot Calculation

```typescript
function calculateBoardFeet(length: number, width: number, thickness: number): number {
  // Board feet = (L × W × T) / 144
  return (length * width * thickness) / 144;
}

function calculateTotalBoardFeet(parts: Array<{ length: number; width: number; thickness: number; quantity: number }>): number {
  return parts.reduce((total, part) => {
    return total + calculateBoardFeet(part.length, part.width, part.thickness) * part.quantity;
  }, 0);
}
```

### 7.3 Grain Direction Rules

```typescript
type GrainDirection = 'length' | 'width' | 'any';

function getGrainDirection(partType: string): GrainDirection {
  const grainRules: Record<string, GrainDirection> = {
    top: 'length',          // Grain runs long way
    apron: 'length',        // Grain runs horizontally
    leg: 'length',          // Grain runs vertically
    stretcher: 'length',    // Grain runs along length
    drawer_front: 'length', // Grain horizontal
    drawer_side: 'length',  // Grain along depth
    drawer_back: 'length',  // Grain horizontal
    drawer_bottom_solid: 'width',  // Side-to-side for expansion
    drawer_bottom_plywood: 'any',
    breadboard: 'length',   // Grain perpendicular to top
    shelf: 'length'
  };

  return grainRules[partType] || 'length';
}
```

---

## Summary Formula Reference

| Calculation | Formula |
|-------------|---------|
| Tenon Thickness | `stock_thickness / 3` |
| Tenon Width | `rail_width / 2` |
| Tenon Length | `leg_width × 0.67` |
| Mortise Depth | `tenon_length + 1/16"` |
| Taper Rate | `(top - bottom) / taper_length` |
| Splayed Leg Length | `vertical_height / cos(resultant_angle)` |
| Resultant Splay | `arccos(cos(α) × cos(β))` |
| Wood Movement | `width × coefficient × MC_change` |
| Board Feet | `(L × W × T) / 144` |
| Golden Ratio | `1.618` |
| Base Stability | `base_width >= height × 0.6` |
| Knee Clearance | `table_height - top_thickness - apron_height >= 24"` |
