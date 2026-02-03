# Documentation Review & Improvement Recommendations

This document identifies issues, inconsistencies, and areas for improvement across
the parametric table builder documentation.

---

## 1. Inconsistencies Between Documents

### 1.1 Shaker Style Default Values

**SPECIFICATION.md vs STYLE_GUIDE.md:**

| Parameter | SPECIFICATION.md | STYLE_GUIDE.md | Recommendation |
|-----------|------------------|----------------|----------------|
| Apron thickness | 0.875" | 0.875" | ✓ Consistent |
| Apron height | 4.5" | 4.5" | ✓ Consistent |
| Leg thickness | 1.75" | 1.75" | ✓ Consistent |
| Taper end dimension | 1.125" | 1.125" | ✓ Consistent |
| Overhang | 0.75" | 0.75" | ✓ Consistent |

**Mid-Century Modern:**

| Parameter | SPECIFICATION.md | STYLE_GUIDE.md | Issue |
|-----------|------------------|----------------|-------|
| Splay angle | 10° | 10° | ✓ Consistent |
| Leg thickness | 1.5" | 1.5" | ✓ Consistent |
| Top attachment | figure-8 | figure-8 | ✓ Consistent |
| Haunched | true | true | **Questionable** - MCM rarely uses haunched tenons |

**Recommendation:** Review whether MCM style should default to `haunched: false` since the visual lightness goal conflicts with traditional haunching.

### 1.2 Compound Angle Formula Discrepancy

**JOINERY_CONVENTIONS.md (line 462-463):**
```
APRON MITER ANGLE = arctan(tan(θ) × cos(45°))
APRON BEVEL ANGLE = arctan(tan(θ) × sin(45°))
```

**CALCULATION_FORMULAS.md (from research):**
```
miterAngle = arctan(tan(β) / tan(α))
bevelAngle = arccos(cos(α) × cos(β))
```

**Issue:** These formulas are different. The JOINERY_CONVENTIONS.md formula is a simplification for 90° rectangular tables, while the research-derived formula is more general.

**Recommendation:**
- Use the general formula for the engine
- Provide a simplified lookup table for common angles (5°, 8°, 10°, 12°, 15°)
- Add validation that compound angles are only needed when splayAngle > 0

### 1.3 Wood Movement Coefficient Usage

**JOINERY_CONVENTIONS.md (line 414-420):**
```
EXPECTED MOVEMENT = WIDTH × MOISTURE_CHANGE × COEFFICIENT

For 36" wide top with 4% seasonal MC change:
Movement = 36 × 0.04 × 0.00350 ≈ 0.05" = roughly 1/16" per side
```

**Issue:** The calculation `36 × 0.04 × 0.00350` should equal `0.00504"`, but the comment says `0.05"`. This is a factor-of-10 error.

**Correct calculation:**
```
Movement = 36 × 0.00350 × 4 = 0.504" (about 1/2")
```

**Impact:** This error would cause undersized movement allowances and potentially cracked tops.

**Recommendation:** Fix the formula and add unit tests for wood movement calculations.

---

## 2. Missing Information

### 2.1 Turned Leg Geometry Generation

**Open Question from SPECIFICATION.md (line 843-846):**
> "Turned legs: Generate geometry programmatically or use predefined profiles?"

**Current Status:** No implementation guidance provided.

**Recommendation:** Add a section on turned leg geometry covering:
- Lathe-style geometry generation using profile curves
- Pommel transition (square to round) calculation
- Standard profiles (baluster, vase, cylinder) as parametric curves
- Bead/cove/fillet element positioning

**Proposed Approach:**
```typescript
interface TurningElement {
  type: 'cylinder' | 'cove' | 'bead' | 'vase' | 'taper' | 'pommel'
  length: number
  startDiameter: number
  endDiameter: number
  profile?: (t: number) => number  // Parametric curve, 0-1
}

interface TurnedLegProfile {
  elements: TurningElement[]
  totalLength: number
}
```

### 2.2 Drawer Construction Details

**Missing from all documents:**
- Drawer rail dimensions (for console tables with multiple drawers)
- Kicker placement (prevents drawer from tipping)
- Drawer guide/runner construction details
- Web frame construction for furniture drawers

**Recommendation:** Add a DRAWER_CONSTRUCTION.md document or section covering:
- Standard drawer rail dimensions
- Web frame vs solid wood guide systems
- Kicker placement rules
- Drawer stop mechanisms

### 2.3 End Table and Bedside Table Specifics

**SPECIFICATION.md mentions these as "Future" but types.ts includes them:**
- `TableType = 'dining' | 'console' | 'end' | 'bedside'`

**Missing:**
- Dimension limits for end/bedside tables
- Style adjustments for smaller scale
- Proportion rules (end tables often square)
- Bedside table drawer integration rules

**Recommendation:** Either:
1. Remove from types.ts and defer to Phase 2, OR
2. Add complete specifications now for consistency

### 2.4 Low/Floor Table Support (Japanese Style)

**Research identified chabudai dimensions:**
- Height: 6-14" (traditional), 12-16" (modern accessible)
- Common sizes: 60-90cm diameter or equivalent rectangle

**Current types don't support this:**
- Height limits assume Western seating (28-36")
- No `tableType: 'low'` or `tableType: 'chabudai'`

**Recommendation:** Add support for low tables:
```typescript
type TableType = 'dining' | 'console' | 'end' | 'bedside' | 'coffee' | 'low'

const LOW_TABLE_LIMITS = {
  height: { min: 6, max: 18, default: 12 }
}
```

### 2.5 Trestle Base Configuration

**StretcherStyle includes 'trestle' but no configuration details:**
- Trestle post dimensions
- Trestle foot shape/dimensions
- Through-wedged tenon specifications
- Knockdown vs permanent construction

**Recommendation:** Add TrestleParams interface:
```typescript
interface TrestleParams {
  postWidth: number
  postThickness: number
  footLength: number
  footHeight: number
  footStyle: 'chamfered' | 'curved' | 'square'
  throughWedged: boolean
}
```

---

## 3. Technical Issues

### 3.1 Type Definition Problems

**Issue 1: LegGeometry extends PartGeometry incorrectly (types.ts:369-377)**

```typescript
export interface LegGeometry extends PartGeometry {
  position: LegPosition  // This overrides Point3D from PartGeometry
  // ...
}
```

The `position` field in `PartGeometry` is `Point3D`, but `LegGeometry` overrides it with `LegPosition` (string literal). This is a type conflict.

**Fix:**
```typescript
export interface LegGeometry extends PartGeometry {
  legPosition: LegPosition  // Rename to avoid conflict
  compoundAngles?: { ... }
}
```

**Issue 2: Dimensions3D axis naming confusion (types.ts:45-49)**

```typescript
export interface Dimensions3D {
  length: number  // X axis (front to back or left to right depending on context)
  width: number   // Z axis (typically depth)
  height: number  // Y axis (vertical)
}
```

The comment says "depending on context" which introduces ambiguity. `length` and `width` swap meaning between table-level and part-level.

**Fix:** Use consistent terminology:
```typescript
export interface Dimensions3D {
  x: number  // Left-right (table width)
  y: number  // Vertical (height)
  z: number  // Front-back (table depth)
}

// OR use semantic names consistently:
export interface TableDimensions {
  lengthX: number   // Long dimension (front-to-back for dining)
  widthZ: number    // Short dimension (side-to-side)
  heightY: number   // Vertical
}
```

**Issue 3: DrawerParams and ShelfParams always required (types.ts:339-341)**

```typescript
export interface TableParams {
  // ...
  drawers: DrawerParams  // Required even for dining tables
  shelf: ShelfParams     // Required even when no shelf
  // ...
}
```

**Fix:** Make optional or use discriminated unions:
```typescript
export interface TableParams {
  // ...
  drawers?: DrawerParams
  shelf?: ShelfParams
}

// OR use discriminated union:
type TableConfig =
  | { tableType: 'dining'; drawers?: never; shelf?: never }
  | { tableType: 'console'; drawers: DrawerParams; shelf?: ShelfParams }
  // ...
```

### 3.2 Validation Gap: Maximum Tenon Width Rule

**JOINERY_CONVENTIONS.md mentions the rule:**
> "Max width = 6 × thickness" (use double tenons if exceeded)

**But types.ts and validation code don't enforce this:**

```typescript
// Missing validation
function validateTenonDimensions(tenon: TenonGeometry): ValidationError[] {
  const errors: ValidationError[] = []

  // This check is missing!
  if (tenon.width > tenon.thickness * 6) {
    errors.push({
      field: 'tenon.width',
      message: 'Tenon width exceeds 6× thickness - consider double tenons',
      severity: 'warning'
    })
  }

  return errors
}
```

### 3.3 Missing Minimum Tenon Length Validation

**Rule from research:** `minTenonLength = tenonThickness × 5`

**Current JOINERY_CONVENTIONS.md only mentions:**
```
tenon_length = leg_thickness * 0.6 to 0.75
```

**Recommendation:** Add absolute minimum check:
```typescript
const minTenonLength = Math.max(
  legThickness * 0.6,      // Proportional rule
  tenonThickness * 5,      // Absolute minimum
  1.25                     // Never less than 1.25"
)
```

---

## 4. Structural/Architectural Issues

### 4.1 No Clear Separation of Concerns

**Current structure mixes:**
- Style presets (visual defaults)
- Construction rules (joinery conventions)
- Validation rules (structural constraints)
- UI defaults (slider steps, etc.)

**Recommendation:** Organize into clear layers:
```
/docs
  /specifications
    SPECIFICATION.md       (overall project spec)
    TABLE_TYPES.md         (dining, console, etc.)
    STYLE_PRESETS.md       (shaker, MCM, etc.)
  /engineering
    JOINERY_CONVENTIONS.md (construction rules)
    CALCULATION_FORMULAS.md (math/geometry)
    WOOD_PROPERTIES.md     (movement, strength)
    VALIDATION_RULES.md    (structural checks)
  /reference
    DEFAULTS.md            (all default values)
    STYLE_GUIDE.md         (visual reference)
```

### 4.2 No Versioning Strategy

**Open question from SPECIFICATION.md (line 854):**
> "Save/Load: Local storage or backend for saved designs?"

**Additional concern:** No parameter version tracking for backwards compatibility.

**Recommendation:** Add version field:
```typescript
interface SavedDesign {
  version: '1.0.0'
  timestamp: string
  params: TableParams
  // ...
}
```

### 4.3 Missing Error Recovery Strategy

**No guidance on what happens when:**
- Style preset conflicts with user modifications
- Validation fails after parameter change
- 3D geometry generation fails

**Recommendation:** Add error handling section covering:
- Graceful degradation
- User notification strategy
- Auto-correction suggestions

---

## 5. Content Improvements

### 5.1 Add Visual Diagrams

**Documents would benefit from:**
- Mortise/tenon dimension diagram (ASCII art exists but could be clearer)
- Compound angle diagram for splayed legs
- Wood movement direction diagram
- Drawer slide clearance diagram

### 5.2 Add Unit Tests/Verification Section

**No test cases documented for:**
- Joinery calculation correctness
- Wood movement formula accuracy
- Style preset completeness
- Validation rule coverage

**Recommendation:** Add VERIFICATION.md with test cases:
```typescript
// Test case: Standard Shaker dining table
const testCase = {
  input: {
    style: 'shaker',
    tableType: 'dining',
    length: 72,
    width: 36,
    height: 30
  },
  expectedJoinery: {
    tenonThickness: 0.25,    // 0.75" apron / 3
    tenonLength: 1.14,       // 1.75" leg × 0.65
    mortiseDepth: 1.2        // tenonLength + 1/16"
  }
}
```

### 5.3 Add Glossary

**Terms used without definition:**
- Pommel
- Haunch
- Setback
- Reveal
- Kerf
- Drawbore
- Web frame

**Recommendation:** Add GLOSSARY.md with woodworking term definitions.

---

## 6. Priority Fixes

### Critical (Must fix before implementation):

1. ~~**Wood movement formula error** (JOINERY_CONVENTIONS.md:417) - Factor of 10 error~~ ✅ FIXED
2. ~~**LegGeometry type conflict** (types.ts:369) - Position type override~~ ✅ FIXED
3. **Add minimum tenon length validation** - Structural integrity (implement during Phase 2)

### High Priority:

4. Clarify Dimensions3D axis naming
5. ~~Make DrawerParams/ShelfParams optional~~ ✅ FIXED
6. Add maximum tenon width (6×) validation
7. Document turned leg geometry approach

### Medium Priority:

8. Add trestle base configuration
9. Add low table support
10. Create verification test cases
11. Add visual diagrams

### Low Priority:

12. Reorganize documentation structure
13. Add glossary
14. Add versioning strategy

---

## 7. Research Gaps Identified

The following areas need additional research before implementation:

### 7.1 Turned Leg Manufacturing Constraints

- What is the minimum practical pommel length for standard mortise dimensions?
- How does turning profile affect perceived visual weight?
- Standard CNC lathe capabilities for automated turning?

### 7.2 Splayed Leg Stability

- At what splay angle does stability become a concern?
- Should base footprint calculation be added to validation?
- Relationship between splay angle and table height?

### 7.3 Multi-Material Tables

- How to handle different wood species for different components?
- Movement calculations when mixing species?
- Visual contrast recommendations by style?

---

## Summary Action Items

| # | Item | File(s) Affected | Priority |
|---|------|-----------------|----------|
| 1 | Fix wood movement formula | JOINERY_CONVENTIONS.md | Critical |
| 2 | Fix LegGeometry type | types.ts | Critical |
| 3 | Add min tenon length validation | types.ts, validation | Critical |
| 4 | Clarify Dimensions3D | types.ts | High |
| 5 | Optional DrawerParams/ShelfParams | types.ts | High |
| 6 | Add 6× tenon width validation | validation | High |
| 7 | Document turned legs | SPECIFICATION.md | High |
| 8 | Add TrestleParams | types.ts | Medium |
| 9 | Add low table support | types.ts, DEFAULTS.md | Medium |
| 10 | Verify compound angle formulas | JOINERY_CONVENTIONS.md | Medium |

---

*Document created: [Current Date]*
*Purpose: Track issues for resolution before implementation phase*
