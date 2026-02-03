/**
 * Parametric Table Builder - Validation Engine
 * Validates table parameters for structural soundness
 */

import type { TableParams, ValidationResult, ValidationError } from '../types'
import { TABLE_TYPE_LIMITS, LEG_LIMITS, APRON_LIMITS, TOP_LIMITS } from '../constants'

// =============================================================================
// MAIN VALIDATION FUNCTION
// =============================================================================

export function validateTableParams(params: TableParams): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Dimension validation
  validateDimensions(params, errors, warnings)

  // Component validation
  validateTop(params, errors, warnings)
  validateLegs(params, errors, warnings)
  validateAprons(params, errors, warnings)
  validateJoinery(params, errors, warnings)

  // Proportional validation
  validateProportions(params, errors, warnings)

  // Structural validation
  validateStructuralIntegrity(params, errors, warnings)

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

// =============================================================================
// DIMENSION VALIDATION
// =============================================================================

function validateDimensions(
  params: TableParams,
  errors: ValidationError[],
  _warnings: ValidationError[]
): void {
  const limits = TABLE_TYPE_LIMITS[params.tableType]

  // Length
  if (params.length < limits.length.min) {
    errors.push({
      field: 'length',
      message: `Length must be at least ${limits.length.min}"`,
      severity: 'error'
    })
  }
  if (params.length > limits.length.max) {
    errors.push({
      field: 'length',
      message: `Length cannot exceed ${limits.length.max}"`,
      severity: 'error'
    })
  }

  // Width
  if (params.width < limits.width.min) {
    errors.push({
      field: 'width',
      message: `Width must be at least ${limits.width.min}"`,
      severity: 'error'
    })
  }
  if (params.width > limits.width.max) {
    errors.push({
      field: 'width',
      message: `Width cannot exceed ${limits.width.max}"`,
      severity: 'error'
    })
  }

  // Height
  if (params.height < limits.height.min) {
    errors.push({
      field: 'height',
      message: `Height must be at least ${limits.height.min}"`,
      severity: 'error'
    })
  }
  if (params.height > limits.height.max) {
    errors.push({
      field: 'height',
      message: `Height cannot exceed ${limits.height.max}"`,
      severity: 'error'
    })
  }
}

// =============================================================================
// TOP VALIDATION
// =============================================================================

function validateTop(
  params: TableParams,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const { top } = params

  // Thickness
  if (top.thickness < TOP_LIMITS.thickness.min) {
    errors.push({
      field: 'top.thickness',
      message: `Top thickness must be at least ${TOP_LIMITS.thickness.min}"`,
      severity: 'error'
    })
  }
  if (top.thickness > TOP_LIMITS.thickness.max) {
    warnings.push({
      field: 'top.thickness',
      message: `Top thickness of ${top.thickness}" is unusually thick`,
      severity: 'warning'
    })
  }

  // Overhang vs table size
  const totalOverhangLength = top.overhang.left + top.overhang.right

  if (totalOverhangLength >= params.width * 0.3) {
    warnings.push({
      field: 'top.overhang',
      message: 'Overhang may make table appear unbalanced',
      severity: 'warning'
    })
  }

  // Breadboard validation
  if (top.breadboardEnds && top.breadboard) {
    if (top.breadboard.width < 2) {
      errors.push({
        field: 'top.breadboard.width',
        message: 'Breadboard width must be at least 2"',
        severity: 'error'
      })
    }
    if (top.breadboard.tongueThickness > top.thickness * 0.4) {
      errors.push({
        field: 'top.breadboard.tongueThickness',
        message: 'Breadboard tongue should not exceed 40% of top thickness',
        severity: 'error'
      })
    }
  }
}

// =============================================================================
// LEG VALIDATION
// =============================================================================

function validateLegs(
  params: TableParams,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const { legs } = params

  // Thickness
  if (legs.thickness < LEG_LIMITS.thickness.min) {
    errors.push({
      field: 'legs.thickness',
      message: `Leg thickness must be at least ${LEG_LIMITS.thickness.min}"`,
      severity: 'error'
    })
  }
  if (legs.thickness > LEG_LIMITS.thickness.max) {
    warnings.push({
      field: 'legs.thickness',
      message: `Leg thickness of ${legs.thickness}" is unusually large`,
      severity: 'warning'
    })
  }

  // Taper validation
  if (legs.style === 'tapered') {
    if (!legs.taperEndDimension) {
      errors.push({
        field: 'legs.taperEndDimension',
        message: 'Tapered legs require end dimension',
        severity: 'error'
      })
    } else if (legs.taperEndDimension >= legs.thickness) {
      errors.push({
        field: 'legs.taperEndDimension',
        message: 'Taper end must be smaller than leg thickness',
        severity: 'error'
      })
    } else if (legs.taperEndDimension < legs.thickness * 0.5) {
      warnings.push({
        field: 'legs.taperEndDimension',
        message: 'Extreme taper may weaken leg',
        severity: 'warning'
      })
    }
  }

  // Splay validation
  if (legs.style === 'splayed') {
    if (!legs.splayAngle) {
      errors.push({
        field: 'legs.splayAngle',
        message: 'Splayed legs require splay angle',
        severity: 'error'
      })
    } else if (legs.splayAngle > 15) {
      warnings.push({
        field: 'legs.splayAngle',
        message: 'Splay angle over 15° may affect stability',
        severity: 'warning'
      })
    }
  }

  // Turned leg validation
  if (legs.style === 'turned') {
    if (!legs.pommelLength || legs.pommelLength < 4) {
      warnings.push({
        field: 'legs.pommelLength',
        message: 'Pommel should be at least 4" for proper mortise depth',
        severity: 'warning'
      })
    }
  }
}

// =============================================================================
// APRON VALIDATION
// =============================================================================

function validateAprons(
  params: TableParams,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const { aprons, legs, height, top } = params

  // Height
  if (aprons.height < APRON_LIMITS.height.min) {
    errors.push({
      field: 'aprons.height',
      message: `Apron height must be at least ${APRON_LIMITS.height.min}"`,
      severity: 'error'
    })
  }

  // Knee clearance (for dining tables)
  if (params.tableType === 'dining') {
    const kneeClearance = height - top.thickness - aprons.height
    if (kneeClearance < 24) {
      errors.push({
        field: 'aprons.height',
        message: `Knee clearance of ${kneeClearance.toFixed(1)}" is below minimum 24"`,
        severity: 'error'
      })
    } else if (kneeClearance < 25) {
      warnings.push({
        field: 'aprons.height',
        message: `Knee clearance of ${kneeClearance.toFixed(1)}" is tight`,
        severity: 'warning'
      })
    }
  }

  // Apron vs leg relationship
  if (aprons.height > legs.thickness * 3) {
    warnings.push({
      field: 'aprons.height',
      message: 'Apron height exceeds typical proportion to leg thickness',
      severity: 'warning'
    })
  }
}

// =============================================================================
// JOINERY VALIDATION
// =============================================================================

function validateJoinery(
  params: TableParams,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const { joinery, aprons, legs } = params

  // Calculate tenon dimensions
  const tenonThickness = aprons.thickness * joinery.tenonThicknessRatio
  const tenonLength = legs.thickness * joinery.tenonLengthRatio
  const tenonWidth = aprons.height - (joinery.tenonShoulderWidth * 2)

  // Minimum tenon thickness
  if (tenonThickness < 0.25) {
    errors.push({
      field: 'joinery.tenonThicknessRatio',
      message: 'Tenon thickness would be less than 1/4"',
      severity: 'error'
    })
  }

  // Minimum tenon length
  const minTenonLength = Math.max(tenonThickness * 5, 1.25)
  if (tenonLength < minTenonLength) {
    warnings.push({
      field: 'joinery.tenonLengthRatio',
      message: `Tenon length of ${tenonLength.toFixed(2)}" is below recommended ${minTenonLength.toFixed(2)}"`,
      severity: 'warning'
    })
  }

  // Maximum tenon width rule (6× thickness)
  if (tenonWidth > tenonThickness * 6) {
    warnings.push({
      field: 'joinery',
      message: 'Tenon width exceeds 6× thickness - consider using double tenons',
      severity: 'warning'
    })
  }

  // Mortise depth vs leg thickness
  if (tenonLength > legs.thickness * 0.75) {
    errors.push({
      field: 'joinery.tenonLengthRatio',
      message: 'Tenon length would exceed safe mortise depth',
      severity: 'error'
    })
  }

  // Through tenon validation
  if (joinery.legApronJoint === 'through-tenon' && tenonLength < legs.thickness) {
    errors.push({
      field: 'joinery',
      message: 'Through tenon must extend full leg thickness',
      severity: 'error'
    })
  }
}

// =============================================================================
// PROPORTION VALIDATION
// =============================================================================

function validateProportions(
  params: TableParams,
  _errors: ValidationError[],
  warnings: ValidationError[]
): void {
  // Length to width ratio
  const ratio = params.length / params.width

  if (params.tableType === 'dining' && ratio > 3.5) {
    warnings.push({
      field: 'dimensions',
      message: 'Table is very long and narrow - consider adding a center stretcher',
      severity: 'warning'
    })
  }

  // Height proportions
  const legHeight = params.height - params.top.thickness
  const legRatio = legHeight / params.legs.thickness

  if (legRatio > 20) {
    warnings.push({
      field: 'legs.thickness',
      message: 'Legs may appear too slender for table height',
      severity: 'warning'
    })
  }
}

// =============================================================================
// STRUCTURAL INTEGRITY VALIDATION
// =============================================================================

function validateStructuralIntegrity(
  params: TableParams,
  _errors: ValidationError[],
  warnings: ValidationError[]
): void {
  // Check if stretchers recommended for long tables
  if (params.tableType === 'dining' && params.length > 72 && !params.stretchers.enabled) {
    warnings.push({
      field: 'stretchers',
      message: 'Consider adding stretchers for tables over 72" long',
      severity: 'warning'
    })
  }

  // Check leg inset vs stability
  const baseWidth = params.width - (params.legs.insetFromEdge * 2) - params.legs.thickness
  const baseLength = params.length - (params.legs.insetFromEdge * 2) - params.legs.thickness

  if (baseWidth < params.width * 0.5 || baseLength < params.length * 0.5) {
    warnings.push({
      field: 'legs.insetFromEdge',
      message: 'Large leg inset may affect stability',
      severity: 'warning'
    })
  }

  // Splayed leg footprint check
  if (params.legs.style === 'splayed' && params.legs.splayAngle) {
    const legHeight = params.height - params.top.thickness
    const splayOffset = Math.tan(params.legs.splayAngle * Math.PI / 180) * legHeight
    const footprintWidth = params.width + (splayOffset * 2)
    const footprintLength = params.length + (splayOffset * 2)

    if (footprintWidth > params.width * 1.3 || footprintLength > params.length * 1.3) {
      warnings.push({
        field: 'legs.splayAngle',
        message: `Splayed legs extend ${splayOffset.toFixed(1)}" beyond table edge`,
        severity: 'warning'
      })
    }
  }
}
