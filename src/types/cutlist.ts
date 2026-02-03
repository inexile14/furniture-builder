/**
 * Parametric Table Builder - Cut List Type Definitions
 */

// =============================================================================
// CUT LIST TYPES
// =============================================================================

export interface JoineryOperation {
  type: 'mortise' | 'tenon' | 'groove' | 'rabbet' | 'dado' | 'taper' | 'chamfer' | 'turn'
  position: string
  dimensions: Record<string, number>
  notes?: string
}

export interface CutListItem {
  id: string
  partName: string
  quantity: number
  lengthWithGrain: number
  widthAcrossGrain: number
  thickness: number
  material: string
  grainDirection: 'length' | 'width' | 'any'
  notes: string[]
  operations: JoineryOperation[]
  boardFeet: number
}

export interface CutList {
  items: CutListItem[]
  totalBoardFeet: number
  byMaterial: Record<string, CutListItem[]>
}
