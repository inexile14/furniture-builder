/**
 * Parametric Table Builder - Type Definitions
 *
 * These types define the complete parameter space for generating
 * customizable table designs across multiple styles and table types.
 */

// =============================================================================
// ENUMS AND LITERAL TYPES
// =============================================================================

export type TableType = 'dining' | 'console' | 'end' | 'bedside'

export type Style = 'shaker' | 'mid-century' | 'farmhouse' | 'japanese-modern'

export type LegStyle = 'square' | 'tapered' | 'turned' | 'splayed'

export type TurnProfile = 'baluster' | 'vase' | 'cylinder' | 'spool' | 'cabriole'

export type EdgeProfile = 'square' | 'eased' | 'beveled' | 'bullnose' | 'ogee' | 'chamfered'

export type ApronProfile = 'straight' | 'arched' | 'scalloped' | 'serpentine'

export type StretcherStyle = 'H' | 'box' | 'X' | 'trestle' | 'none'

export type JointType = 'mortise-tenon' | 'domino' | 'dowel' | 'pocket-screw' | 'through-tenon' | 'half-lap'

export type TopAttachmentMethod = 'buttons' | 'figure-8' | 'elongated-holes' | 'z-clips'

export type CornerJointStyle = 'mitered' | 'shortened' | 'stacked'

export type DrawerSlideType = 'wood-runner' | 'side-mount' | 'under-mount' | 'center-mount'

export type DrawerBoxJoinery = 'dovetail' | 'half-blind-dovetail' | 'rabbet' | 'dado' | 'lock-rabbet'

export type LegPosition = 'FL' | 'FR' | 'BL' | 'BR'  // Front-Left, Front-Right, etc.

export type ApronPosition = 'front' | 'back' | 'left' | 'right'

// =============================================================================
// DIMENSION TYPES
// =============================================================================

/** All dimensions are in inches */
export interface Dimensions3D {
  length: number  // X axis (front to back or left to right depending on context)
  width: number   // Z axis (typically depth)
  height: number  // Y axis (vertical)
}

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface Rotation3D {
  x: number  // radians
  y: number
  z: number
}

// =============================================================================
// TOP PARAMETERS
// =============================================================================

export interface TopParams {
  /** Thickness of the table top */
  thickness: number

  /** Overhang beyond aprons/legs on each side */
  overhang: {
    front: number
    back: number
    left: number
    right: number
  }

  /** Edge treatment profile */
  edgeProfile: EdgeProfile

  /** Bevel angle if edgeProfile is 'beveled' (degrees) */
  bevelAngle?: number

  /** Whether to add breadboard ends (common in farmhouse) */
  breadboardEnds: boolean

  /** Breadboard dimensions if enabled */
  breadboard?: {
    width: number      // Width of breadboard piece
    thickness: number  // Same as top or slightly thinner
    tongueDepth: number
    tongueThickness: number
  }
}

// =============================================================================
// LEG PARAMETERS
// =============================================================================

export interface LegParams {
  /** Leg construction style */
  style: LegStyle

  /** Cross-section dimension at thickest point (square legs) */
  thickness: number

  /**
   * Distance from outside edge of top to outside edge of leg
   * Affects visual weight and overhang appearance
   */
  insetFromEdge: number

  /** Small chamfer on leg edges (0 for none) */
  chamfer: number

  // --- Taper parameters (when style === 'tapered') ---

  /** Distance from top of leg where taper begins */
  taperStartFromTop?: number

  /** Leg dimension at floor (tapered end) */
  taperEndDimension?: number

  /** Taper on 2 faces (inside only) or all 4 faces */
  taperSides?: 2 | 4

  // --- Splay parameters (when style === 'splayed') ---

  /** Outward angle in degrees (typically 5-15) */
  splayAngle?: number

  // --- Turned parameters (when style === 'turned') ---

  /** Turning profile shape */
  turnProfile?: TurnProfile

  /** Length of square section at top (pommel) for mortises */
  pommelLength?: number

  /** Maximum diameter of turned portion */
  maxDiameter?: number

  /** Minimum diameter of turned portion */
  minDiameter?: number

  // --- Foot treatment ---

  /** Optional foot detail */
  foot?: 'none' | 'tapered' | 'ball' | 'pad' | 'spade'
}

// =============================================================================
// APRON PARAMETERS
// =============================================================================

export interface ApronParams {
  /** Vertical height of apron */
  height: number

  /** Thickness (depth front-to-back) */
  thickness: number

  /** Bottom edge profile */
  bottomProfile: ApronProfile

  /** Height of arch if bottomProfile is 'arched' */
  archHeight?: number

  /** Setback from face of leg (creates shadow line) */
  setback: number

  /** Which sides have aprons */
  sides: {
    front: boolean
    back: boolean
    left: boolean
    right: boolean
  }

  /**
   * For console tables: apron section below drawers
   * Allows drawer section with apron below
   */
  belowDrawerHeight?: number
}

// =============================================================================
// STRETCHER PARAMETERS
// =============================================================================

export interface StretcherParams {
  /** Whether stretchers are included */
  enabled: boolean

  /** Stretcher configuration style */
  style: StretcherStyle

  /** Height of stretcher center from floor */
  heightFromFloor: number

  /** Width of stretcher pieces */
  width: number

  /** Thickness of stretcher pieces */
  thickness: number

  /** For H-stretcher: include center cross piece */
  centerStretcher?: boolean

  /** For trestle: vertical support dimensions */
  trestleWidth?: number
  trestleThickness?: number
}

// =============================================================================
// DRAWER PARAMETERS (Console tables, etc.)
// =============================================================================

export interface DrawerParams {
  /** Number of drawers (0 = no drawers) */
  count: 0 | 1 | 2 | 3

  /** Total height of drawer opening(s) */
  openingHeight: number

  /** Depth of drawer box */
  boxDepth: number

  /** Slide/runner system */
  slideType: DrawerSlideType

  /** Drawer box corner joinery */
  boxJoinery: DrawerBoxJoinery

  /** Front style relative to opening */
  frontStyle: 'inset' | 'overlay' | 'partial-overlay'

  /** Gap around inset drawer front */
  reveal?: number

  /** Overlay amount for overlay fronts */
  overlay?: number

  /** Gap between multiple drawers */
  gapBetween: number

  /** Drawer box material thickness */
  boxMaterialThickness: number

  /** Drawer bottom panel thickness */
  bottomThickness: number
}

// =============================================================================
// JOINERY PARAMETERS
// =============================================================================

export interface JoineryParams {
  /** Primary joint type for leg-to-apron connection */
  legApronJoint: JointType

  /** How to handle tenons meeting at corners */
  cornerJoint: CornerJointStyle

  /** Include haunch on apron tenons (fills gap at top of leg) */
  haunched: boolean

  /** Tenon thickness as ratio of stock thickness (default: 0.333 = 1/3) */
  tenonThicknessRatio: number

  /** Tenon length as ratio of leg thickness (default: 0.65) */
  tenonLengthRatio: number

  /** Shoulder width on tenons */
  tenonShoulderWidth: number

  /** Setback of mortise from outside leg face */
  mortiseSetback: number

  /** Method for attaching top */
  topAttachment: TopAttachmentMethod

  /** Spacing between top attachment points */
  topAttachmentSpacing: number

  /** Joint type for stretchers (if applicable) */
  stretcherJoint?: JointType

  /** Show joinery details in 3D preview */
  showJoineryInPreview: boolean
}

// =============================================================================
// SHELF PARAMETERS (Console tables)
// =============================================================================

export interface ShelfParams {
  /** Whether lower shelf is included */
  enabled: boolean

  /** Height of shelf surface from floor */
  heightFromFloor: number

  /** Thickness of shelf */
  thickness: number

  /** Inset from legs/aprons */
  inset: number

  /** Whether shelf has gallery rail */
  galleryRail: boolean

  /** Gallery rail height if enabled */
  galleryRailHeight?: number
}

// =============================================================================
// COMBINED TABLE PARAMETERS
// =============================================================================

export interface TableParams {
  /** Type of table */
  tableType: TableType

  /** Design style */
  style: Style

  /** Overall dimensions */
  length: number
  width: number
  height: number

  /** Component parameters */
  top: TopParams
  legs: LegParams
  aprons: ApronParams
  stretchers: StretcherParams
  drawers?: DrawerParams    // Optional - only for console/bedside tables
  shelf?: ShelfParams       // Optional - only when lower shelf is desired
  joinery: JoineryParams

  /** Material for display/cut list */
  primaryWood: string
  secondaryWood?: string
}

// =============================================================================
// GEOMETRY OUTPUT TYPES
// =============================================================================

export interface PartGeometry {
  /** Dimensions of the part */
  width: number
  height: number
  depth: number

  /** Position in 3D space (center point) */
  position: Point3D

  /** Rotation (Euler angles in radians) */
  rotation?: Rotation3D

  /** For custom geometry (tapered legs, etc.) */
  vertices?: number[]
  indices?: number[]
}

export interface LegGeometry extends PartGeometry {
  /** Which corner this leg is at */
  legPosition: LegPosition

  /** For splayed legs: compound angles needed for joinery */
  compoundAngles?: {
    miterAngle: number
    bevelAngle: number
  }
}

export interface ApronGeometry extends PartGeometry {
  position: ApronPosition
}

export interface TableGeometry {
  top: PartGeometry
  legs: LegGeometry[]
  aprons: ApronGeometry[]
  stretchers: PartGeometry[]
  drawers: DrawerGeometry[]
  shelf?: PartGeometry
}

export interface DrawerGeometry {
  front: PartGeometry
  box: {
    left: PartGeometry
    right: PartGeometry
    back: PartGeometry
    bottom: PartGeometry
  }
  position: Point3D
}

// =============================================================================
// JOINERY GEOMETRY TYPES
// =============================================================================

export interface TenonGeometry {
  thickness: number
  width: number
  length: number
  shoulderWidth: number

  /** Position relative to apron end */
  offset: Point3D

  /** Haunch dimensions if applicable */
  haunch?: {
    width: number
    depth: number
  }

  /** For mitered tenons: miter angle */
  miterAngle?: number
}

export interface MortiseGeometry {
  width: number
  height: number
  depth: number

  /** Position relative to leg */
  position: Point3D

  /** Distance from outside face of leg */
  setbackFromFace: number

  /** Distance from top of leg to top of mortise */
  distanceFromTop: number
}

export interface JoineryGeometry {
  tenon: TenonGeometry
  mortise: MortiseGeometry

  /** For through tenons: wedge slot */
  wedgeSlot?: {
    width: number
    depth: number
    angle: number
  }
}

// =============================================================================
// CUT LIST TYPES
// =============================================================================

export interface CutListItem {
  /** Unique identifier */
  id: string

  /** Human-readable part name */
  partName: string

  /** Number of this part needed */
  quantity: number

  /** Dimension along the grain */
  lengthWithGrain: number

  /** Dimension across the grain */
  widthAcrossGrain: number

  /** Material thickness */
  thickness: number

  /** Material/species */
  material: string

  /** Grain direction note */
  grainDirection: 'length' | 'width' | 'any'

  /** Special notes (miter angles, tapers, etc.) */
  notes: string[]

  /** Joinery operations needed */
  operations: JoineryOperation[]

  /** Board feet calculation */
  boardFeet: number
}

export interface JoineryOperation {
  type: 'mortise' | 'tenon' | 'groove' | 'rabbet' | 'dado' | 'taper' | 'chamfer' | 'turn'
  position: string  // e.g., "both ends", "inside faces", "centered"
  dimensions: Record<string, number>
  notes?: string
}

export interface CutList {
  items: CutListItem[]
  totalBoardFeet: number
  byMaterial: Record<string, CutListItem[]>
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

// =============================================================================
// DEFAULTS AND LIMITS
// =============================================================================

export interface DimensionLimits {
  min: number
  max: number
  step?: number  // For UI sliders
}

export interface TableTypeLimits {
  length: DimensionLimits
  width: DimensionLimits
  height: DimensionLimits
}

export interface AllLimits {
  dining: TableTypeLimits
  console: TableTypeLimits
  end: TableTypeLimits
  bedside: TableTypeLimits

  legThickness: DimensionLimits
  apronHeight: DimensionLimits
  topThickness: DimensionLimits
  splayAngle: DimensionLimits
  // ... etc
}

// =============================================================================
// STYLE PRESET TYPE
// =============================================================================

export interface StylePreset {
  name: Style
  displayName: string
  description: string

  defaults: {
    top: Partial<TopParams>
    legs: Partial<LegParams>
    aprons: Partial<ApronParams>
    stretchers: Partial<StretcherParams>
    joinery: Partial<JoineryParams>
  }

  /** Dimension adjustments based on table type */
  tableTypeAdjustments: {
    dining?: Partial<TableParams>
    console?: Partial<TableParams>
    end?: Partial<TableParams>
    bedside?: Partial<TableParams>
  }
}

// =============================================================================
// CONTEXT/STATE TYPES
// =============================================================================

export interface TableBuilderState {
  params: TableParams
  geometry: TableGeometry | null
  cutList: CutList | null
  validation: ValidationResult

  // UI state
  selectedComponent: string | null
  isExploded: boolean
  showJoinery: boolean
  previewQuality: 'low' | 'medium' | 'high'
}

export type TableBuilderAction =
  | { type: 'SET_TABLE_TYPE'; tableType: TableType }
  | { type: 'SET_STYLE'; style: Style }
  | { type: 'SET_DIMENSION'; dimension: 'length' | 'width' | 'height'; value: number }
  | { type: 'SET_TOP_PARAM'; key: keyof TopParams; value: unknown }
  | { type: 'SET_LEG_PARAM'; key: keyof LegParams; value: unknown }
  | { type: 'SET_APRON_PARAM'; key: keyof ApronParams; value: unknown }
  | { type: 'SET_STRETCHER_PARAM'; key: keyof StretcherParams; value: unknown }
  | { type: 'SET_DRAWER_PARAM'; key: keyof DrawerParams; value: unknown }
  | { type: 'SET_JOINERY_PARAM'; key: keyof JoineryParams; value: unknown }
  | { type: 'APPLY_PRESET'; preset: StylePreset }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'TOGGLE_EXPLODED' }
  | { type: 'TOGGLE_JOINERY_PREVIEW' }
  | { type: 'SELECT_COMPONENT'; component: string | null }
