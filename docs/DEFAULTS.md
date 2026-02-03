# Parametric Table Builder - Default Values & Limits

This document defines all default values and validation limits for the parametric
table builder, organized by component and style.

---

## 1. Table Type Defaults

### 1.1 Dining Table

```typescript
const DINING_TABLE = {
  dimensions: {
    length: { min: 48, max: 120, default: 72 },
    width: { min: 30, max: 48, default: 40 },
    height: { min: 28, max: 31, default: 30 }
  },
  seating: {
    widthPerPerson: 24,
    minWidthPerPerson: 20,
    placeSettingDepth: 15
  },
  clearances: {
    kneeHeight: 24,       // Minimum floor to apron bottom
    seatToTableGap: 7     // Ideal gap between chair seat and apron
  }
};
```

### 1.2 Console Table

```typescript
const CONSOLE_TABLE = {
  dimensions: {
    length: { min: 24, max: 72, default: 42 },
    width: { min: 10, max: 24, default: 14 },
    height: { min: 26, max: 36, default: 32 }
  },
  proportions: {
    lengthToHeightRatio: { min: 1.5, max: 3.0 },
    lengthToDepthRatio: { min: 2.5, max: 5.0 }
  },
  features: {
    drawerCount: { min: 0, max: 3, default: 1 },
    hasLowerShelf: false
  }
};
```

### 1.3 End Table

```typescript
const END_TABLE = {
  dimensions: {
    length: { min: 18, max: 30, default: 24 },
    width: { min: 18, max: 30, default: 24 },
    height: { min: 20, max: 26, default: 24 }
  },
  proportions: {
    // End tables often square or nearly square
    aspectRatio: { min: 0.8, max: 1.25 }
  },
  features: {
    drawerCount: { min: 0, max: 1, default: 0 },
    hasLowerShelf: true
  }
};
```

### 1.4 Bedside Table

```typescript
const BEDSIDE_TABLE = {
  dimensions: {
    length: { min: 18, max: 28, default: 22 },
    width: { min: 14, max: 22, default: 18 },
    height: { min: 24, max: 30, default: 26 }
  },
  proportions: {
    // Height should match mattress top + 2-4"
    relativeToMattress: { min: 2, max: 4 }
  },
  features: {
    drawerCount: { min: 0, max: 2, default: 1 },
    hasLowerShelf: false
  }
};
```

---

## 2. Style Presets

### 2.1 Shaker Style

```typescript
const SHAKER_STYLE = {
  name: 'shaker',
  displayName: 'Shaker',
  description: 'Clean lines, honest construction, form follows function',

  defaults: {
    top: {
      thickness: 0.875,
      edgeProfile: 'eased',
      overhang: { front: 2, back: 2, left: 2, right: 2 },
      breadboardEnds: false
    },

    legs: {
      style: 'tapered',
      thickness: 2.25,
      insetFromEdge: 0.5,
      chamfer: 0.0625,
      taperStartFromTop: 5,
      taperEndDimension: 1.25,
      taperSides: 2
    },

    aprons: {
      height: 4,
      thickness: 0.75,
      setback: 0.125,
      bottomProfile: 'straight',
      sides: { front: true, back: true, left: true, right: true }
    },

    stretchers: {
      enabled: false
    },

    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.67,
      topAttachment: 'buttons'
    }
  },

  materials: {
    primary: ['cherry', 'maple', 'pine'],
    finish: 'natural_oil_or_wax'
  }
};
```

### 2.2 Mid-Century Modern Style

```typescript
const MID_CENTURY_STYLE = {
  name: 'mid-century',
  displayName: 'Mid-Century Modern',
  description: 'Visual lightness, splayed geometry, organic modernism',

  defaults: {
    top: {
      thickness: 0.75,
      edgeProfile: 'beveled',
      bevelAngle: 20,
      overhang: { front: 3, back: 3, left: 3, right: 3 },
      breadboardEnds: false
    },

    legs: {
      style: 'splayed',
      thickness: 1.75,
      insetFromEdge: 1.5,
      chamfer: 0,
      splayAngle: 8,
      taperStartFromTop: 0,
      taperEndDimension: 1.0,
      taperSides: 4
    },

    aprons: {
      height: 2.5,          // Shallow for floating look
      thickness: 0.75,
      setback: 0,
      bottomProfile: 'straight',
      sides: { front: true, back: true, left: true, right: true }
    },

    stretchers: {
      enabled: false
    },

    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: false,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.65,
      topAttachment: 'z-clips'
    }
  },

  materials: {
    primary: ['walnut', 'teak', 'white_oak'],
    finish: 'oil_or_lacquer'
  }
};
```

### 2.3 Farmhouse Style

```typescript
const FARMHOUSE_STYLE = {
  name: 'farmhouse',
  displayName: 'Farmhouse',
  description: 'Robust, practical, built for daily use with heirloom quality',

  defaults: {
    top: {
      thickness: 1.75,
      edgeProfile: 'eased',
      overhang: { front: 3.5, back: 3.5, left: 3.5, right: 3.5 },
      breadboardEnds: true,
      breadboard: {
        width: 3,
        thickness: 1.75,
        tongueDepth: 1,
        tongueThickness: 0.5
      }
    },

    legs: {
      style: 'turned',
      thickness: 4,
      insetFromEdge: 0,
      turnProfile: 'baluster',
      pommelLength: 5,
      maxDiameter: 4,
      minDiameter: 2.5
    },

    aprons: {
      height: 5,
      thickness: 1,
      setback: 0.25,
      bottomProfile: 'straight',
      sides: { front: true, back: true, left: true, right: true }
    },

    stretchers: {
      enabled: true,
      style: 'H',
      heightFromFloor: 8,
      width: 3,
      thickness: 1.5
    },

    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: true,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.65,
      topAttachment: 'buttons'
    }
  },

  materials: {
    primary: ['pine', 'oak', 'reclaimed_fir'],
    finish: 'wax_or_oil'
  }
};
```

### 2.4 Japanese-Modern Style

```typescript
const JAPANESE_MODERN_STYLE = {
  name: 'japanese-modern',
  displayName: 'Japanese Modern',
  description: 'Refined simplicity, precise joinery, respect for materials',

  defaults: {
    top: {
      thickness: 0.875,
      edgeProfile: 'square',    // Crisp edges
      overhang: { front: 1, back: 1, left: 1, right: 1 }, // Minimal
      breadboardEnds: false
    },

    legs: {
      style: 'square',
      thickness: 1.75,
      insetFromEdge: 0.75,
      chamfer: 0                 // Sharp corners or very subtle
    },

    aprons: {
      height: 2.5,
      thickness: 0.75,
      setback: 0,               // Flush
      bottomProfile: 'straight',
      sides: { front: true, back: true, left: true, right: true }
    },

    stretchers: {
      enabled: false
    },

    joinery: {
      legApronJoint: 'mortise-tenon',
      cornerJoint: 'mitered',
      haunched: false,
      tenonThicknessRatio: 0.333,
      tenonLengthRatio: 0.67,
      topAttachment: 'elongated-holes',
      showJoineryInPreview: true  // Exposed joinery as feature
    }
  },

  materials: {
    primary: ['walnut', 'white_oak', 'ash', 'hinoki'],
    finish: 'natural_oil_matte'
  }
};
```

---

## 3. Component Limits

### 3.1 Top Parameters

```typescript
const TOP_LIMITS = {
  thickness: { min: 0.75, max: 2.5, step: 0.125, default: 1.0 },

  overhang: {
    min: 0.5,
    max: 6,
    step: 0.25,
    default: 2
  },

  edgeProfiles: ['square', 'eased', 'beveled', 'bullnose', 'ogee', 'chamfered'],

  bevelAngle: { min: 10, max: 45, step: 5, default: 20 },

  breadboard: {
    width: { min: 2, max: 4, default: 3 },
    tongueDepth: { min: 0.75, max: 1.25, default: 1 }
  }
};
```

### 3.2 Leg Parameters

```typescript
const LEG_LIMITS = {
  // Square/tapered legs
  thickness: { min: 1.5, max: 5, step: 0.125, default: 2.5 },

  // Taper
  taperStartFromTop: { min: 3, max: 8, step: 0.5, default: 5 },
  taperEndDimension: { min: 0.75, max: 3, step: 0.125 },
  taperRatio: { min: 1.5, max: 3, default: 2 }, // top:bottom

  // Splay (splayed legs)
  splayAngle: { min: 3, max: 15, step: 1, default: 8 },

  // Turned legs
  maxDiameter: { min: 2.5, max: 6, default: 4 },
  minDiameter: { min: 1.5, max: 4, default: 2.5 },
  pommelLength: { min: 4, max: 8, default: 5 },

  // Chamfer
  chamfer: { min: 0, max: 0.25, step: 0.0625, default: 0.0625 },

  // Inset
  insetFromEdge: { min: 0, max: 4, step: 0.25, default: 0.5 }
};
```

### 3.3 Apron Parameters

```typescript
const APRON_LIMITS = {
  height: { min: 2, max: 6, step: 0.25, default: 4 },
  thickness: { min: 0.625, max: 1.25, step: 0.125, default: 0.75 },
  setback: { min: 0, max: 0.5, step: 0.0625, default: 0.125 },
  archHeight: { min: 0.5, max: 2, step: 0.25, default: 1 }
};
```

### 3.4 Stretcher Parameters

```typescript
const STRETCHER_LIMITS = {
  heightFromFloor: { min: 4, max: 14, step: 0.5, default: 8 },
  width: { min: 1.5, max: 4, step: 0.25, default: 2.5 },
  thickness: { min: 0.75, max: 2, step: 0.25, default: 1 }
};
```

### 3.5 Drawer Parameters

```typescript
const DRAWER_LIMITS = {
  count: { min: 0, max: 3 },
  openingHeight: { min: 3, max: 10, default: 5 },
  boxDepth: { min: 10, max: 24, default: 14 },
  gapBetween: { min: 0.5, max: 1, default: 0.75 },
  reveal: { min: 0.0625, max: 0.125, default: 0.09375 } // 1/16" to 1/8"
};
```

### 3.6 Shelf Parameters

```typescript
const SHELF_LIMITS = {
  heightFromFloor: { min: 4, max: 14, step: 0.5, default: 8 },
  thickness: { min: 0.5, max: 1, step: 0.125, default: 0.75 },
  inset: { min: 0, max: 2, step: 0.25, default: 0.5 }
};
```

---

## 4. Joinery Defaults

### 4.1 Mortise-Tenon Rules

```typescript
const JOINERY_DEFAULTS = {
  // Tenon proportions
  tenonThicknessRatio: 0.333,     // 1/3 of stock thickness
  tenonWidthRatio: 0.5,           // 1/2 of rail width
  tenonLengthRatio: 0.67,         // 2/3 of leg width

  // Constraints
  maxTenonWidthMultiple: 6,       // Max width = 6 × thickness
  minTenonLength: 1.25,           // Absolute minimum

  // Mortise
  mortiseDepthExtra: 0.0625,      // 1/16" deeper than tenon
  mortiseSetback: 0.125,          // From outside face

  // Shoulders
  tenonShoulderWidth: 0.25,       // Standard shoulder width
  minTopShoulder: 0.5,            // Protect short grain

  // Corner joints
  cornerJointStyles: ['mitered', 'shortened', 'stacked'],
  defaultCornerStyle: 'mitered',

  // Haunch
  haunchWidthRatio: 0.333,        // 1/3 of tenon width (hardwood)
  haunchDepth: 'match_tenon_thickness'
};
```

### 4.2 Top Attachment Methods

```typescript
const TOP_ATTACHMENT = {
  methods: ['buttons', 'figure-8', 'elongated-holes', 'z-clips'],

  buttons: {
    width: 1.5,
    length: 1.5,
    thickness: 0.75,
    tongueLength: 0.5,
    tongueThickness: 0.625,
    spacingMax: 6
  },

  figure8: {
    diameter: 0.625,
    maxTableWidth: 18,
    spacing: 12
  },

  zClips: {
    spacing: 10
  },

  elongatedHoles: {
    // Slot length per 12" of width from center
    slotPerFoot: 0.125
  }
};
```

---

## 5. Material Specifications

### 5.1 Wood Properties

```typescript
const WOOD_SPECIES = {
  walnut: {
    displayName: 'Black Walnut',
    tangentialCoefficient: 0.00274,
    radialCoefficient: 0.00190,
    stability: 'good',
    hardness: 1010,
    primaryColor: '#5c4033'
  },

  cherry: {
    displayName: 'Cherry',
    tangentialCoefficient: 0.00270,
    radialCoefficient: 0.00140,
    stability: 'good',
    hardness: 950,
    primaryColor: '#9e6b4a'
  },

  white_oak: {
    displayName: 'White Oak',
    tangentialCoefficient: 0.00365,
    radialCoefficient: 0.00180,
    stability: 'moderate',
    hardness: 1360,
    primaryColor: '#c4a35a'
  },

  red_oak: {
    displayName: 'Red Oak',
    tangentialCoefficient: 0.00369,
    radialCoefficient: 0.00158,
    stability: 'moderate',
    hardness: 1290,
    primaryColor: '#bf9b7a'
  },

  hard_maple: {
    displayName: 'Hard Maple',
    tangentialCoefficient: 0.00353,
    radialCoefficient: 0.00165,
    stability: 'poor',
    hardness: 1450,
    primaryColor: '#efe4d4'
  },

  pine: {
    displayName: 'Eastern White Pine',
    tangentialCoefficient: 0.00210,
    radialCoefficient: 0.00070,
    stability: 'good',
    hardness: 380,
    primaryColor: '#f5deb3'
  },

  ash: {
    displayName: 'White Ash',
    tangentialCoefficient: 0.00290,
    radialCoefficient: 0.00170,
    stability: 'moderate',
    hardness: 1320,
    primaryColor: '#e3d7bf'
  },

  teak: {
    displayName: 'Teak',
    tangentialCoefficient: 0.00230,
    radialCoefficient: 0.00140,
    stability: 'excellent',
    hardness: 1070,
    primaryColor: '#b8860b'
  },

  mahogany: {
    displayName: 'Honduran Mahogany',
    tangentialCoefficient: 0.00250,
    radialCoefficient: 0.00150,
    stability: 'excellent',
    hardness: 900,
    primaryColor: '#c04000'
  }
};
```

### 5.2 Default Material Thicknesses

```typescript
const MATERIAL_THICKNESSES = {
  // Standard lumber (4/4, 5/4, 6/4, 8/4)
  fourQuarter: 0.75,   // After surfacing
  fiveQuarter: 1.0,
  sixQuarter: 1.25,
  eightQuarter: 1.75,

  // Plywood
  quarterPly: 0.25,
  halfPly: 0.5,
  threeQuarterPly: 0.75,

  // Typical component thicknesses
  drawerSides: 0.5,
  drawerBottom: 0.25,
  apron: 0.75,
  topLight: 0.75,
  topMedium: 1.0,
  topHeavy: 1.5
};
```

---

## 6. Validation Rules

### 6.1 Structural Validation

```typescript
const VALIDATION_RULES = {
  // Knee clearance (dining tables)
  kneeHeightMin: 24,

  // Apron must fit between top and knee clearance
  maxApronHeight: (tableHeight: number, topThickness: number) =>
    tableHeight - topThickness - 24,

  // Stretcher must be above floor but below knee
  stretcherHeightRange: (kneeHeight: number) => ({
    min: 4,
    max: kneeHeight - 6
  }),

  // Tenon must fit in leg
  maxTenonLength: (legWidth: number, setback: number) =>
    (legWidth - setback) * 0.95,

  // Drawer opening constraints
  maxDrawerHeight: (availableHeight: number, drawerCount: number) =>
    (availableHeight - (drawerCount - 1) * 0.75) / drawerCount,

  // Top overhang stability
  maxOverhang: (legInset: number) =>
    legInset + 4  // Max 4" beyond leg
};
```

### 6.2 Proportion Validation

```typescript
const PROPORTION_RULES = {
  // Leg thickness relative to table size
  minLegThickness: (tableLength: number, tableWidth: number) => {
    const diagonal = Math.sqrt(tableLength ** 2 + tableWidth ** 2);
    return diagonal / 40; // Proportional to perceived mass
  },

  // Apron height relative to table height
  apronHeightRatio: {
    min: 0.08,  // 8% of table height
    max: 0.20   // 20% of table height
  },

  // Base stability
  baseStabilityRatio: 0.6, // Base width >= 60% of height
};
```

---

## 7. UI/UX Defaults

### 7.1 Slider Steps

```typescript
const UI_STEPS = {
  inches_coarse: 0.5,
  inches_fine: 0.125,
  inches_very_fine: 0.0625,
  degrees: 1,
  ratios: 0.01
};
```

### 7.2 Default Camera Positions

```typescript
const CAMERA_DEFAULTS = {
  distance: 80,
  elevation: 25,      // degrees
  azimuth: 45,        // degrees
  fov: 45,

  // Exploded view offsets
  explodeDistance: {
    top: 6,
    legs: 4,
    aprons: 3,
    stretchers: 4,
    drawers: 8
  }
};
```

### 7.3 Material Colors (3D Preview)

```typescript
const PREVIEW_COLORS = {
  walnut: '#5c4033',
  cherry: '#9e6b4a',
  oak: '#c4a35a',
  maple: '#efe4d4',
  pine: '#f5deb3',
  teak: '#b8860b',

  // Component highlights
  selected: '#4a90d9',
  highlight: '#6cb2f7',

  // Grid/helpers
  grid: '#cccccc',
  dimension: '#333333'
};
```

---

## Summary: Quick Reference

| Component | Default | Min | Max |
|-----------|---------|-----|-----|
| **Dining Height** | 30" | 28" | 31" |
| **Console Height** | 32" | 26" | 36" |
| **End Table Height** | 24" | 20" | 26" |
| **Top Thickness** | 1" | 0.75" | 2.5" |
| **Leg Thickness** | 2.5" | 1.5" | 5" |
| **Apron Height** | 4" | 2" | 6" |
| **Overhang** | 2" | 0.5" | 6" |
| **Splay Angle** | 8° | 3° | 15° |
| **Taper Ratio** | 2:1 | 1.5:1 | 3:1 |
| **Tenon Thickness** | 1/3 stock | - | - |
| **Tenon Length** | 2/3 leg | 1.25" | - |
