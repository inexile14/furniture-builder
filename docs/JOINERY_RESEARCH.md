# Mortise & Tenon Joinery Research

Research compiled for parameter limit discussion and future joinery implementations.

---

## Industry Standard Dimensions

### Tenon Thickness

| Rule | Source |
|------|--------|
| **1/3 the thickness of the mortised stock** | Primary rule - ensures mortise walls don't weaken |
| 1/2 the thickness (modern machine work) | Alternative for CNC/Domino |
| Between 1/3 and 1/2 of tenon's own stock | For the rail/apron itself |

**Example:** 3/4" door frame → 1/4" tenon (1/3 rule)

### Tenon Length

| Rule | Formula | Example |
|------|---------|---------|
| Minimum | 5× thickness | 1/4" thick → 1-1/4" min length |
| Alternative | 2× thickness (absolute min) | For shallow joints |
| Blind mortise | 2/3 width of mortised stock | 1.5" leg → 1" mortise depth |
| Through mortise | Full width + proud amount | Extends past leg face |

**Note:** The 5× rule is often violated in antique furniture, especially with wedged through-tenons.

### Tenon Width

| Rule | Formula | Constraint |
|------|---------|------------|
| Standard | 1/2 the rail width | 2" rail → 1" tenon |
| Maximum | 6× tenon thickness | Before splitting required |
| Absolute max | 4" (some sources say 3") | Use multiple tenons above this |

**Split tenon rule:** If width > 6× thickness, divide into multiple tenons.
- Example: 1/4" thick, 6" wide rail → 3" tenon would exceed 6×0.25=1.5", so split into two 1.5" tenons

### Width-to-Tenons Ratio

For rails >10× their thickness, use multiple tenons:
- 3/4" thick rail > 7.5" wide → multiple tenons
- Divide into thirds: 2/3 tenon, 1/3 space

---

## Mortise Positioning

### Distance from Top of Leg

| Concern | Recommendation |
|---------|----------------|
| Structural | Leave adequate wood above mortise to prevent splitting |
| For aprons | Set back at least 1/2" from leg top (more for thick legs) |
| General | "Farther from top when joining thin apron to thick leg" |

**Our current issue:** Mortises are too close to the top edge of legs.

### Distance from Edge (setback)

| Application | Minimum Setback |
|-------------|-----------------|
| Cabinet stile | 1/4" to 1/2" from outer edge |
| Entry door | ~1" from outer edge |
| Pegged joint | Depends on peg diameter + tenon length |

**No universal standard** - depends on stock thickness, expected loads, mortise size.

---

## Corner Joint Collisions

When two aprons meet at a leg corner, their tenons would collide inside the leg.

### Solutions

#### 1. Mitered Tenons (Most Common)
- Cut 45° miter on tenon ends where they meet
- Maximizes glue surface area
- Each tenon: full length on outer edge, shortened on inner edge

```
    Leg (top view)
    ┌─────────┐
    │    ╲    │
    │  ╲  ╲   │ ← Mitered tenons
    │ ╲    ╲  │    meet at 45°
    └─────────┘
```

#### 2. Shortened Tenons
- Simply make tenons shorter to avoid collision
- Less glue surface but simpler
- Works for lighter-duty joints

#### 3. Stacked/Offset Tenons
- Position one mortise higher than the other
- Tenons pass by each other vertically
- Requires deeper leg stock

#### 4. Single Long + Single Short
- One apron gets full-length tenon
- Perpendicular apron gets shortened tenon
- Compromise approach

### Recommended for Tables

**Mitered tenons** when leg width allows (1.5"+):
- Target tenon length: 1/2 to 2/3 of leg width
- With mitering: ~1" outer edge, ~3/8" inner edge (for 1.5" leg)

---

## Through Mortise & Tenon

### Characteristics
- Tenon passes completely through mortised piece
- End grain visible on opposite side
- Often chamfered or detailed for aesthetics

### Dimensions
- Width: 1/3 of stock thickness (same as blind)
- Length: Full depth + proud amount (1/8" to 1/4" typical)

### Use Cases
- Arts & Crafts / Mission furniture
- Timber framing
- Design statement showing "honest construction"

### Implementation Notes
- Mortise must be cut cleanly on both faces
- Consider wood movement (slightly oversize mortise width)
- Proud tenon can be trimmed flush or left proud

---

## Wedged Mortise & Tenon

### Concept
- Through-tenon with saw kerfs cut into the end
- Wedges driven into kerfs expand the tenon
- Creates mechanical lock + closes gaps

### Wedge Placement
- Kerfs perpendicular to grain direction of mortised piece
- Prevents splitting along the grain
- 2 wedges typical (one near each edge)

### Kerf Depth
- Should not extend past the mortised piece
- Typically 2/3 to 3/4 of mortise depth

### Benefits
- Stronger than plain through-tenon
- Self-tightening over time
- Decorative with contrasting wood wedges

---

## Tusked (Keyed) Tenon

### Concept
- Extra-long through-tenon with a mortise cut through it
- Wedge/key inserted through tenon mortise
- Creates knockdown joint (no glue needed)

### Key Features
- **Beveled wedge mortise** pulls shoulders tight
- **Removable** - primary advantage
- **Self-tightening** - tap wedge to snug up
- **Accommodates wood movement** seasonally

### Dimensions
- Tenon extends 1-2" past mortise
- Wedge mortise: typically 1/2" to 3/4" wide
- Wedge angle: ~7-10° bevel

### Use Cases
- Knockdown furniture (trestle tables, beds)
- Workbenches (stretchers)
- Craftsman/Arts & Crafts style pieces

### Historical Note
Oldest known mortise & tenon joint (7000 years old, Leipzig) was keyed variety.

---

## Implementation Priority for Our App

### Phase 1 (Current)
- [x] Blind mortise & tenon
- [x] Basic dimensions (1/3 rule)
- [ ] **Parameter limits** (prevent invalid dimensions)

### Phase 2
- [ ] Mitered tenons for corner joints
- [ ] Through mortise & tenon (Farmhouse style)
- [ ] Collision detection/prevention

### Phase 3
- [ ] Wedged through-tenon visualization
- [ ] Tusked tenon for trestle tables
- [ ] Haunched tenons

---

## Parameter Validation Rules (To Implement)

```typescript
interface JoineryValidation {
  // Tenon thickness
  minTenonThickness: (legThickness: number) => number  // legThickness / 4
  maxTenonThickness: (legThickness: number) => number  // legThickness / 2

  // Tenon length (for blind mortise)
  minTenonLength: (tenonThickness: number) => number   // tenonThickness * 5
  maxTenonLength: (legWidth: number) => number         // legWidth * 0.67

  // Mortise from top of leg
  minMortiseSetback: (mortiseHeight: number) => number // mortiseHeight * 0.5 or 0.5"

  // Tenon width
  maxSingleTenonWidth: (tenonThickness: number) => number // tenonThickness * 6
}
```

---

## Sources

- [Popular Woodworking - Tenons Rule](https://www.popularwoodworking.com/techniques/tenons-rule-so-here-are-the-rules-on-tenons/)
- [Fine Woodworking - 11 Mortise-and-Tenon Variations](https://www.finewoodworking.com/2019/02/11/11-mortise-and-tenon-variations)
- [Woodworker's Journal - Real-life Mortise and Tenon Dimensions](https://www.woodworkersjournal.com/real-life-mortise-tenon-dimensions/)
- [Woodcraft - Mortise and Tenon Dimensions](https://www.woodcraft.com/blog_entries/mortise-and-tenon-dimensions)
- [Popular Woodworking - The Wedged Mortise & Tenon](https://www.popularwoodworking.com/techniques/the-wedged-mortise-tenon/)
- [Woodsmith - Loose-Wedge Mortise & Tenon Joints](https://www.woodsmith.com/article/loose-wedge-mortise-tenon-joints-basic-tusk-tenon/)
- [Wood and Shop - Tusk Tenons Strength](https://woodandshop.com/will-myers-tusk-tenonshow-strong-are-they/)
- [Dimensions.com - Through Mortise & Tenon](https://www.dimensions.com/element/wood-joint-mortise-tenon-through)
