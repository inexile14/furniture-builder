/**
 * Parametric Table Builder - Table Type Definitions
 */

// =============================================================================
// ENUMS AND LITERAL TYPES
// =============================================================================

export type TableType = 'dining' | 'console' | 'end' | 'bedside'

export type Style = 'shaker' | 'mid-century' | 'farmhouse' | 'japandi' | 'trestle' | 'mission'

export type LegStyle = 'square' | 'tapered' | 'turned' | 'splayed'

export type TurnProfile = 'baluster' | 'vase' | 'cylinder' | 'spool' | 'cabriole'

export type EdgeProfile = 'square' | 'bullnose' | 'ogee' | 'chamfered'

export type ChamferEdge = 'top' | 'bottom' | 'both'

export type ApronProfile = 'straight' | 'arched' | 'scalloped' | 'serpentine'

export type StretcherStyle = 'box' | 'H' | 'none'

export type JointType = 'mortise-tenon' | 'domino' | 'dowel' | 'pocket-screw' | 'through-tenon' | 'half-lap'

export type TopAttachmentMethod = 'buttons' | 'figure-8' | 'elongated-holes' | 'z-clips'

export type CornerJointStyle = 'mitered' | 'shortened' | 'stacked'

export type DrawerSlideType = 'wood-runner' | 'side-mount' | 'under-mount' | 'center-mount'

export type DrawerBoxJoinery = 'dovetail' | 'half-blind-dovetail' | 'rabbet' | 'dado' | 'lock-rabbet'

export type LegPosition = 'FL' | 'FR' | 'BL' | 'BR'

export type ApronPosition = 'front' | 'back' | 'left' | 'right'

// =============================================================================
// TOP PARAMETERS
// =============================================================================

export interface TopParams {
  thickness: number
  overhang: {
    front: number
    back: number
    left: number
    right: number
  }
  edgeProfile: EdgeProfile
  cornerRadius?: number  // Radius for rounded corners (0 = sharp corners)
  breadboardEnds: boolean
  breadboard?: {
    width: number
    thickness: number
    tongueDepth: number
    tongueThickness: number
  }
  // Chamfer parameters (when edgeProfile === 'chamfered')
  chamferEdge?: ChamferEdge  // Which edge(s) to chamfer: 'top', 'bottom', or 'both'
  chamferSize?: number       // Size of chamfer in inches (default 0.25)
  chamferAngle?: number      // Angle in degrees (default 45)
}

// =============================================================================
// LEG PARAMETERS
// =============================================================================

export interface LegParams {
  style: LegStyle
  thickness: number
  insetFromEdge: number
  chamfer: number

  // Taper parameters (when style === 'tapered')
  taperStartFromTop?: number
  taperEndDimension?: number
  taperSides?: 'inside' | 'all'  // 'inside' = traditional Shaker (2 faces), 'all' = all 4 faces

  // Splay parameters (when style === 'splayed')
  splayAngle?: number

  // Turned parameters (when style === 'turned')
  turnProfile?: TurnProfile
  pommelLength?: number
  maxDiameter?: number
  minDiameter?: number

  // Foot treatment
  foot?: 'none' | 'tapered' | 'ball' | 'pad' | 'spade'
}

// =============================================================================
// APRON PARAMETERS
// =============================================================================

export interface ApronParams {
  height: number
  thickness: number
  bottomProfile: ApronProfile
  archHeight?: number
  setback: number
  sides: {
    front: boolean
    back: boolean
    left: boolean
    right: boolean
  }
  belowDrawerHeight?: number
}

// =============================================================================
// STRETCHER PARAMETERS
// =============================================================================

export interface StretcherParams {
  enabled: boolean
  style: StretcherStyle
  heightFromFloor: number
  sideHeightFromFloor?: number  // For box style: side stretchers can be at different height
  width: number
  thickness: number
  centerStretcher?: boolean
  trestleWidth?: number
  trestleThickness?: number
}

// =============================================================================
// DRAWER PARAMETERS
// =============================================================================

export interface DrawerParams {
  count: 0 | 1 | 2 | 3
  openingHeight: number
  boxDepth: number
  slideType: DrawerSlideType
  boxJoinery: DrawerBoxJoinery
  frontStyle: 'inset' | 'overlay' | 'partial-overlay'
  reveal?: number
  overlay?: number
  gapBetween: number
  boxMaterialThickness: number
  bottomThickness: number
}

// =============================================================================
// JOINERY PARAMETERS
// =============================================================================

export interface JoineryParams {
  legApronJoint: JointType
  cornerJoint: CornerJointStyle
  haunched: boolean
  tenonThicknessRatio: number
  tenonLengthRatio: number
  tenonShoulderWidth: number
  mortiseSetback: number
  topAttachment: TopAttachmentMethod
  topAttachmentSpacing: number
  stretcherJoint?: JointType
  showJoineryInPreview: boolean
}

// =============================================================================
// SHELF PARAMETERS
// =============================================================================

export interface ShelfParams {
  enabled: boolean
  heightFromFloor: number
  thickness: number
  inset: number
  galleryRail: boolean
  galleryRailHeight?: number
}

// =============================================================================
// TRESTLE PARAMETERS
// =============================================================================

export interface TrestleParams {
  // Leg (vertical piece)
  legWidth: number           // Width of leg (along table length) - wider dimension
  legThickness: number       // Thickness of leg (along table width) - thinner dimension
  legInset: number           // How far leg center is inset from table end

  // Foot (bottom piece, runs along table width)
  footLength: number         // Length of foot (along table width)
  footHeight: number         // Height of foot
  footWidth: number          // Width of foot (along table length)
  footBevelAngle: number     // Angle of bevel on foot sides (degrees)
  footDadoDepth: number      // Depth of dado underneath foot
  footDadoInset: number      // How far dado starts from each end

  // Head (top piece, supports table top)
  headLength: number         // Length of head (along table width)
  headHeight: number         // Height of head
  headWidth: number          // Width of head (along table length)
  headBevelAngle: number     // Angle of bevel on head sides (degrees)

  // Stretcher (connects the two leg assemblies)
  stretcherHeight: number    // Height of stretcher (vertical dimension)
  stretcherThickness: number // Thickness of stretcher
  stretcherHeightFromFloor: number // Height from floor to bottom of stretcher
}

// =============================================================================
// COMBINED TABLE PARAMETERS
// =============================================================================

export interface TableParams {
  tableType: TableType
  style: Style
  length: number
  width: number
  height: number
  top: TopParams
  legs: LegParams
  aprons: ApronParams
  stretchers: StretcherParams
  trestle?: TrestleParams
  drawers?: DrawerParams
  shelf?: ShelfParams
  joinery: JoineryParams
  primaryWood: string
  secondaryWood?: string
}
