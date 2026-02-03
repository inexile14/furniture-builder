# Furniture Style Guide

Detailed specifications for each design style supported by the parametric table builder.

---

## 1. Shaker Style

### Historical Context

Originating from the Shaker religious communities (1770s-1850s), this style
embodies the belief that "beauty rests on utility." Every element serves a
purpose; ornamentation is avoided.

### Design Philosophy

- **Simplicity:** No decorative elements that don't serve a function
- **Proportion:** Carefully balanced relationships between parts
- **Honesty:** Joinery is visible but refined, not hidden
- **Lightness:** Tapered legs create visual lift

### Visual Characteristics

```
    ┌─────────────────────────────────┐
    │           TABLE TOP             │  ← Minimal overhang (3/4")
    └─────────────────────────────────┘
           │                 │
     ┌─────┴───┐       ┌─────┴───┐
     │  APRON  │       │  APRON  │       ← Clean, straight apron
     └────┬────┘       └────┬────┘
          │                 │
          │                 │
          │                 │            ← Taper begins below apron
          ╲                 ╱
           ╲               ╱
            ╲             ╱               ← Gradual taper to floor
             ╲           ╱
              ╲         ╱
```

### Dimensional Specifications

#### Dining Table (6-seat)
```typescript
const SHAKER_DINING_DEFAULTS = {
  // Overall
  length: 72,           // inches
  width: 36,
  height: 29.5,

  // Top
  top: {
    thickness: 0.875,   // 7/8"
    overhang: {
      front: 0.75,
      back: 0.75,
      left: 0.75,
      right: 0.75,
    },
    edgeProfile: 'eased',  // Slight roundover, 1/16" radius
    breadboardEnds: false,
  },

  // Legs
  legs: {
    style: 'tapered',
    thickness: 1.75,           // At top
    taperStartFromTop: 5,      // Below apron
    taperEndDimension: 1.125,  // At floor (1-1/8")
    taperSides: 2,             // Inside faces only
    insetFromEdge: 0.5,
    chamfer: 0.0625,           // 1/16" ease on corners
  },

  // Aprons
  aprons: {
    height: 4.5,
    thickness: 0.875,
    bottomProfile: 'straight',
    setback: 0.125,            // 1/8" shadow line
  },

  // No stretchers typical
  stretchers: {
    enabled: false,
  },
}
```

#### Console Table
```typescript
const SHAKER_CONSOLE_DEFAULTS = {
  length: 48,
  width: 14,
  height: 30,

  top: {
    thickness: 0.75,
    overhang: {
      front: 0.5,
      back: 0.5,
      left: 0.5,
      right: 0.5,
    },
  },

  legs: {
    thickness: 1.5,
    taperStartFromTop: 4,
    taperEndDimension: 1,
  },

  aprons: {
    height: 3.5,
    thickness: 0.75,
  },

  // Optional single drawer
  drawers: {
    count: 1,
    frontStyle: 'inset',
    reveal: 0.0625,  // 1/16" gap
  },
}
```

### Joinery Notes

- Mortise and tenon throughout (traditional pegged originally)
- Tenons follow standard 1/3 rule
- Haunched tenons at top of legs
- Top attached with wood buttons (traditional)

### Wood Species (Traditional)

- Cherry (most common)
- Maple
- Pine (painted pieces)
- Birch

---

## 2. Mid-Century Modern

### Historical Context

Emerging post-WWII (1945-1969), MCM design embraced new materials and
manufacturing while celebrating organic forms and the optimism of the era.
Designers: Hans Wegner, Finn Juhl, George Nakashima.

### Design Philosophy

- **Visual Lightness:** Furniture appears to float
- **Organic Forms:** Subtle curves, splayed angles
- **Sculptural:** Each piece is art
- **Space:** Generous negative space, minimal visual mass

### Visual Characteristics

```
        ┌───────────────────────────────────────┐
        │              TABLE TOP                │  ← Generous overhang
        │                                       │     Beveled edge
        └───────────────────────────────────────┘
                 ╲                     ╱
                  ╲                   ╱
                   ╲                 ╱
                    ╲   LOW APRON  ╱                ← Minimal apron height
                     ╲           ╱
                      ╲         ╱
                       ╲       ╱                    ← Legs splay outward
                        ╲     ╱                       at 8-12°
                         ╲   ╱
                          ╲ ╱
```

### Dimensional Specifications

#### Dining Table
```typescript
const MCM_DINING_DEFAULTS = {
  length: 72,
  width: 36,
  height: 29,          // Often slightly lower

  top: {
    thickness: 0.875,
    overhang: {
      front: 2,
      back: 2,
      left: 2,
      right: 2,
    },
    edgeProfile: 'beveled',
    bevelAngle: 30,    // degrees
  },

  legs: {
    style: 'splayed',
    thickness: 1.5,
    splayAngle: 10,    // degrees outward
    insetFromEdge: 1,
    chamfer: 0,        // Clean edges
    // Many MCM legs also taper while splayed
    taperEndDimension: 1,  // Optional taper
  },

  aprons: {
    height: 3,         // Low profile
    thickness: 0.75,
    bottomProfile: 'straight',
    setback: 0.125,
  },

  stretchers: {
    enabled: false,    // Rarely used
  },
}
```

#### Console Table
```typescript
const MCM_CONSOLE_DEFAULTS = {
  length: 54,
  width: 16,
  height: 29,

  top: {
    thickness: 0.75,
    overhang: {
      front: 1.5,
      back: 1.5,
      left: 1.5,
      right: 1.5,
    },
    edgeProfile: 'beveled',
  },

  legs: {
    style: 'splayed',
    thickness: 1.25,
    splayAngle: 8,
  },

  aprons: {
    height: 2.5,
  },

  // Drawers common, floating appearance
  drawers: {
    count: 2,
    frontStyle: 'overlay',
    overlay: 0.375,
  },
}
```

### Joinery Notes

- Compound angle joinery is challenging
- Often uses:
  - Loose tenons (Domino, etc.)
  - Dowels
  - Metal hardware hidden inside
- Through tenons sometimes used decoratively
- Top often attached with figure-8 fasteners (allows easy removal)

### Compound Angle Reference

| Splay Angle | Miter Angle | Bevel Angle |
|-------------|-------------|-------------|
| 5°          | 3.5°        | 3.5°        |
| 8°          | 5.7°        | 5.7°        |
| 10°         | 7.1°        | 7.1°        |
| 12°         | 8.5°        | 8.5°        |
| 15°         | 10.6°       | 10.6°       |

### Wood Species (Traditional)

- Walnut (most iconic)
- Teak
- Rosewood
- White Oak

---

## 3. Farmhouse / Country

### Historical Context

Rooted in rural American and European furniture traditions (1700s-1900s),
farmhouse furniture was built to last generations of hard use. Revival
popular in 2010s as "modern farmhouse."

### Design Philosophy

- **Durability:** Built to withstand heavy use
- **Honesty:** Shows its construction
- **Warmth:** Inviting, comfortable, rustic
- **Generosity:** Substantial proportions

### Visual Characteristics

```
      ┌───────────────────────────────────────────┐
     ╔╧═══════════════════════════════════════════╧╗  ← Breadboard ends
     ║                TABLE TOP                    ║     Thick top (1-1/4"+)
     ╚╤═══════════════════════════════════════════╤╝
       │                                         │
    ┌──┴───────────────────────────────────────┴──┐
    │              DEEP APRON                     │     ← Often arched
    └──┬───────────────────────────────────────┬──┘
       │                                       │
       │ ╭─╮                               ╭─╮ │
       │ │ │                               │ │ │       ← Turned legs
       │ ╰─╯                               ╰─╯ │         (baluster profile)
       │ │ │                               │ │ │
       ├─┴─┼───────────────────────────────┼─┴─┤
       │   │        STRETCHER              │   │       ← H-stretcher common
       └───┴───────────────────────────────┴───┘
```

### Dimensional Specifications

#### Dining Table
```typescript
const FARMHOUSE_DINING_DEFAULTS = {
  length: 84,          // Often larger
  width: 40,
  height: 30,

  top: {
    thickness: 1.25,   // Substantial
    overhang: {
      front: 1.5,
      back: 1.5,
      left: 2,         // More on ends for breadboards
      right: 2,
    },
    edgeProfile: 'square',  // Or eased
    breadboardEnds: true,
    breadboard: {
      width: 3,
      thickness: 1.25,
      tongueDepth: 1,
      tongueThickness: 0.375,
    },
  },

  legs: {
    style: 'turned',
    thickness: 3.5,            // Chunky
    turnProfile: 'baluster',
    pommelLength: 6,           // Square section for mortises
    maxDiameter: 3.5,
    minDiameter: 2,
    insetFromEdge: 1.5,
  },

  aprons: {
    height: 5.5,
    thickness: 1,
    bottomProfile: 'arched',
    archHeight: 1,
    setback: 0.25,
  },

  stretchers: {
    enabled: true,
    style: 'H',
    heightFromFloor: 6,
    width: 3,
    thickness: 1,
    centerStretcher: true,
  },
}
```

#### Console Table
```typescript
const FARMHOUSE_CONSOLE_DEFAULTS = {
  length: 60,
  width: 18,
  height: 32,

  top: {
    thickness: 1,
    edgeProfile: 'square',
  },

  legs: {
    style: 'turned',
    thickness: 3,
    turnProfile: 'vase',
    pommelLength: 5,
  },

  aprons: {
    height: 4.5,
  },

  shelf: {
    enabled: true,
    heightFromFloor: 8,
    thickness: 0.75,
  },

  drawers: {
    count: 2,
    frontStyle: 'inset',
  },
}
```

### Turned Leg Profiles

```
BALUSTER:
  ┌─┐
  │ │  ← Pommel (square)
  ╞═╡
  │ │
 ╱   ╲
│     │  ← Main swell
 ╲   ╱
  │ │
  │ │    ← Narrow section
  │ │
 ╱   ╲
│     │  ← Secondary swell
 ╲   ╱
  │ │
  ╰─╯

VASE:
  ┌─┐
  │ │
  ╞═╡
 ╱   ╲
│     │
│     │
 ╲   ╱
  │ │
  │ │
  │ │
  ╰─╯
```

### Joinery Notes

- Heavy mortise and tenon
- Often draw-bored (pegged) for strength
- Through tenons on stretchers (wedged)
- Breadboard attachment:
  - Tongue and groove or sliding dovetail
  - Elongated screw holes (movement)
  - Only center peg is fixed; others float

### Wood Species (Traditional)

- Pine (painted, most common historically)
- Oak
- Maple
- Reclaimed barn wood (modern farmhouse)

---

## 4. Japanese-Modern (Minimalist)

### Historical Context

Blending traditional Japanese woodworking aesthetics with modern minimalism.
Influenced by: George Nakashima, Isamu Noguchi, and contemporary Japanese
makers. Emphasizes restraint, precision, and the beauty of negative space.

### Design Philosophy

- **Ma (間):** The importance of negative space
- **Kanso (簡素):** Simplicity, elimination of clutter
- **Shizen (自然):** Naturalness, nothing forced
- **Precision:** Every joint, every edge is intentional

### Visual Characteristics

```
      ┌─────────────────────────────────────┐
      │           TABLE TOP                 │  ← Minimal or zero overhang
      │                                     │     Precise, thin profile
      └─────────────────────────────────────┘
        │                               │
        │                               │
        │                               │       ← Square legs, no taper
        │                               │         Sharp, precise edges
        │                               │
        │        (low apron or          │
        │         no visible apron)     │
        │                               │
        │                               │
        │                               │
        ─                               ─
```

### Dimensional Specifications

#### Dining Table
```typescript
const JAPANESE_MODERN_DINING_DEFAULTS = {
  length: 72,
  width: 36,
  height: 28,          // Often slightly lower

  top: {
    thickness: 0.75,   // Precise, not chunky
    overhang: {
      front: 0.25,
      back: 0.25,
      left: 0.25,
      right: 0.25,
    },
    edgeProfile: 'square',  // Or tiny chamfer
  },

  legs: {
    style: 'square',
    thickness: 1.5,    // Exactly 1.5", not 1-1/2" or 1-9/16"
    insetFromEdge: 0.25,
    chamfer: 0.0625,   // Subtle 1/16" chamfer
  },

  aprons: {
    height: 2.5,       // Low, minimal
    thickness: 0.75,
    bottomProfile: 'straight',
    setback: 0,        // Flush with leg
  },

  stretchers: {
    enabled: false,
  },
}
```

#### Console Table
```typescript
const JAPANESE_MODERN_CONSOLE_DEFAULTS = {
  length: 48,
  width: 12,           // Very shallow
  height: 28,

  top: {
    thickness: 0.625,  // Thin
    overhang: {
      front: 0,        // Flush
      back: 0,
      left: 0,
      right: 0,
    },
    edgeProfile: 'chamfered',
  },

  legs: {
    style: 'square',
    thickness: 1.25,
    insetFromEdge: 0,  // At corners
    chamfer: 0.03125,  // 1/32" micro chamfer
  },

  aprons: {
    height: 2,
    setback: 0,
  },

  // If drawers, hidden/integrated
  drawers: {
    count: 1,
    frontStyle: 'overlay',  // Continuous surface
    overlay: 0,             // Flush overlay
  },
}
```

### Joinery Notes

- Precision is paramount - no gaps
- Traditional Japanese joinery possible:
  - Blind joints preferred (nothing visible)
  - Mitered corners
- May use:
  - Precision mortise and tenon
  - Domino (for precision and speed)
  - Dowels
- Top attached with figure-8 or L-brackets (hidden)
- Floating appearance sometimes achieved with recessed aprons

### Edge Treatment

The edge treatment is critical in Japanese-modern:

```
SQUARE (with micro-chamfer):
  ┌────────
  │←1/32"  ╲
  │         │
  │         │

CHAMFERED:
  ╲←1/8"
   ╲
    │
    │

KNIFE EDGE (advanced):
       ╲
        ╲
         ╲
          │
```

### Wood Species (Traditional)

- White Oak (rift or quarter sawn)
- Ash
- Walnut
- Japanese Elm
- Paulownia

---

## Style Comparison Matrix

| Attribute | Shaker | Mid-Century | Farmhouse | Japanese-Modern |
|-----------|--------|-------------|-----------|-----------------|
| **Leg Style** | Tapered | Splayed | Turned | Square |
| **Leg Dimension** | 1.75" | 1.5" | 3.5" | 1.5" |
| **Apron Height** | 4.5" | 3" | 5.5" | 2.5" |
| **Top Thickness** | 7/8" | 7/8" | 1-1/4" | 3/4" |
| **Overhang** | 3/4" | 2" | 1.5" | 1/4" |
| **Edge** | Eased | Beveled | Square | Square/Chamfer |
| **Stretchers** | Rare | No | Yes | No |
| **Visual Mass** | Light | Airy | Heavy | Minimal |
| **Joinery** | M&T | Compound | Pegged M&T | Precision M&T |

---

## Implementation: Style Preset System

```typescript
const STYLE_PRESETS: Record<Style, StylePreset> = {
  shaker: {
    name: 'shaker',
    displayName: 'Shaker',
    description: 'Simple, refined, tapered legs with minimal overhang',
    defaults: {
      legs: {
        style: 'tapered',
        thickness: 1.75,
        taperStartFromTop: 5,
        taperEndDimension: 1.125,
        taperSides: 2,
        chamfer: 0.0625,
      },
      aprons: {
        height: 4.5,
        thickness: 0.875,
        bottomProfile: 'straight',
        setback: 0.125,
      },
      top: {
        thickness: 0.875,
        overhang: { front: 0.75, back: 0.75, left: 0.75, right: 0.75 },
        edgeProfile: 'eased',
      },
      stretchers: { enabled: false },
      joinery: {
        legApronJoint: 'mortise-tenon',
        haunched: true,
        topAttachment: 'buttons',
      },
    },
  },

  'mid-century': {
    name: 'mid-century',
    displayName: 'Mid-Century Modern',
    description: 'Splayed legs, generous overhang, beveled edges',
    defaults: {
      legs: {
        style: 'splayed',
        thickness: 1.5,
        splayAngle: 10,
        chamfer: 0,
      },
      aprons: {
        height: 3,
        thickness: 0.75,
        bottomProfile: 'straight',
        setback: 0.125,
      },
      top: {
        thickness: 0.875,
        overhang: { front: 2, back: 2, left: 2, right: 2 },
        edgeProfile: 'beveled',
        bevelAngle: 30,
      },
      stretchers: { enabled: false },
      joinery: {
        legApronJoint: 'domino',  // Or precision mortise-tenon
        haunched: true,
        topAttachment: 'figure-8',
      },
    },
  },

  farmhouse: {
    name: 'farmhouse',
    displayName: 'Farmhouse',
    description: 'Chunky turned legs, breadboard top, H-stretcher',
    defaults: {
      legs: {
        style: 'turned',
        thickness: 3.5,
        turnProfile: 'baluster',
        pommelLength: 6,
      },
      aprons: {
        height: 5.5,
        thickness: 1,
        bottomProfile: 'arched',
        archHeight: 1,
        setback: 0.25,
      },
      top: {
        thickness: 1.25,
        overhang: { front: 1.5, back: 1.5, left: 2, right: 2 },
        edgeProfile: 'square',
        breadboardEnds: true,
      },
      stretchers: {
        enabled: true,
        style: 'H',
        heightFromFloor: 6,
        width: 3,
        thickness: 1,
      },
      joinery: {
        legApronJoint: 'mortise-tenon',
        haunched: true,
        topAttachment: 'buttons',
        stretcherJoint: 'through-tenon',
      },
    },
  },

  'japanese-modern': {
    name: 'japanese-modern',
    displayName: 'Japanese Modern',
    description: 'Square legs, minimal overhang, precise and restrained',
    defaults: {
      legs: {
        style: 'square',
        thickness: 1.5,
        chamfer: 0.0625,
      },
      aprons: {
        height: 2.5,
        thickness: 0.75,
        bottomProfile: 'straight',
        setback: 0,
      },
      top: {
        thickness: 0.75,
        overhang: { front: 0.25, back: 0.25, left: 0.25, right: 0.25 },
        edgeProfile: 'square',
      },
      stretchers: { enabled: false },
      joinery: {
        legApronJoint: 'mortise-tenon',
        haunched: true,
        topAttachment: 'figure-8',
      },
    },
  },
}
```

---

*This style guide provides the visual and dimensional foundation for
creating authentic-looking furniture in each style.*
