/**
 * Woodworking Knowledge Base
 *
 * Structured domain knowledge for furniture design and construction.
 * This module provides the intelligence layer that powers intelligent defaults,
 * validation explanations, and design guidance throughout the platform.
 */

// Domain exports
export * from './joinery'
export * from './species'
export * from './styles'

// Re-export commonly used items at top level
export {
  // Joinery
  JOINTS_BY_ID,
  JOINTS_BY_CATEGORY,
  ALL_JOINTS,
  calculateTenonThickness,
  calculateMortiseDepth,
  recommendJoint,
  explainJointSizing,
  validateJointParams,
  type JointDefinition,
  type JointCategory,
  type StrengthRating,
  type SkillLevel,
} from './joinery'

export {
  // Species
  SPECIES_BY_ID,
  ALL_SPECIES,
  recommendSpecies,
  calculateMovement,
  compareSpecies,
  type WoodSpecies,
} from './species'

export {
  // Styles
  STYLES_BY_ID,
  ALL_STYLES,
  recommendStyle,
  getStyleDefaults,
  type FurnitureStyle,
} from './styles'

// =============================================================================
// UNIFIED KNOWLEDGE QUERY INTERFACE
// =============================================================================

export type KnowledgeDomain = 'joinery' | 'species' | 'styles' | 'techniques' | 'finishing'

export interface KnowledgeQuery {
  domain: KnowledgeDomain
  topic?: string
  context?: Record<string, unknown>
}

export interface KnowledgeResponse {
  content: string
  sources?: string[]
  relatedTopics?: string[]
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Query the knowledge base for information
 * This is a simple lookup function; RAG integration will enhance this
 */
export function queryKnowledge(query: KnowledgeQuery): KnowledgeResponse | null {
  const { domain, topic } = query

  if (domain === 'joinery' && topic) {
    const { JOINTS_BY_ID } = require('./joinery')
    const joint = JOINTS_BY_ID[topic]
    if (joint) {
      return {
        content: joint.description,
        relatedTopics: joint.relatedJoints,
        confidence: 'high'
      }
    }
  }

  if (domain === 'species' && topic) {
    const { SPECIES_BY_ID } = require('./species')
    const species = SPECIES_BY_ID[topic]
    if (species) {
      return {
        content: species.furnitureNotes,
        relatedTopics: species.similarSpecies,
        confidence: 'high'
      }
    }
  }

  if (domain === 'styles' && topic) {
    const { STYLES_BY_ID } = require('./styles')
    const style = STYLES_BY_ID[topic]
    if (style) {
      return {
        content: style.characteristics.overall,
        relatedTopics: style.influences,
        confidence: 'high'
      }
    }
  }

  return null
}

/**
 * Get contextual explanation for a parameter
 */
export function explainParameter(
  parameterName: string,
  currentValue: unknown,
  context: { style?: string; species?: string }
): string | null {
  const explanations: Record<string, (value: unknown, ctx: typeof context) => string | null> = {
    'legThickness': (value, ctx) => {
      const thickness = value as number
      if (ctx.style === 'shaker') {
        if (thickness < 2.25) return 'Shaker legs are typically 2.25" to 2.75" for visual proportion.'
        if (thickness > 3) return 'This is heavier than typical Shaker—consider reducing for lighter appearance.'
      }
      if (ctx.style === 'mission') {
        if (thickness < 2.5) return 'Mission furniture uses substantial legs—typically 2.5" to 3".'
      }
      if (ctx.style === 'mid-century-modern') {
        if (thickness > 2.5) return 'MCM legs are typically under 2.5" at top, tapering dramatically.'
      }
      return `Leg thickness of ${thickness}" is within normal range.`
    },

    'apronHeight': (value, ctx) => {
      const height = value as number
      const kneeRoom = 30 - height - 1 // Assuming 30" table height, 1" top
      if (kneeRoom < 24) {
        return `Warning: With ${height}" apron, knee clearance is only ${kneeRoom}". Standard is 24"+.`
      }
      if (ctx.style === 'shaker' && height < 3.5) {
        return 'Shaker aprons are typically 3.5" to 4.5" for proper tenon strength.'
      }
      if (ctx.style === 'mid-century-modern' && height > 3) {
        return 'MCM typically uses minimal aprons (2" to 3") for visual lightness.'
      }
      return null
    },

    'topThickness': (value, ctx) => {
      const thickness = value as number
      if (ctx.style === 'farmhouse' && thickness < 1.25) {
        return 'Farmhouse tables traditionally have thick tops (1.5" to 2"+) for visual weight.'
      }
      if (ctx.style === 'mid-century-modern' && thickness > 1) {
        return 'MCM tops are typically 3/4" to 1" with profiled edges for visual lightness.'
      }
      return null
    },

    'splayAngle': (value, ctx) => {
      const angle = value as number
      if (ctx.style === 'mid-century-modern') {
        if (angle < 8) return 'MCM typically uses 8° to 15° splay for visual dynamism.'
        if (angle > 15) return 'Splay over 15° may appear unstable and complicates joinery.'
      }
      if (ctx.style === 'shaker' || ctx.style === 'mission') {
        if (angle > 0) return 'Shaker and Mission styles use vertical legs, not splayed.'
      }
      return null
    }
  }

  const explainer = explanations[parameterName]
  if (!explainer) return null

  return explainer(currentValue, context)
}

/**
 * Get design recommendations based on current parameters
 */
export function getDesignRecommendations(
  params: Record<string, unknown>,
  style?: string
): string[] {
  const recommendations: string[] = []

  // Style-specific recommendations
  if (style === 'shaker') {
    if (params.taperSides !== 'inside') {
      recommendations.push('Shaker: Consider tapering legs on inside faces only for authentic look.')
    }
    if ((params.overhangSides as number) < 2.5) {
      recommendations.push('Shaker: Generous overhang (2.5"+ sides, 4"+ ends) creates visual lightness.')
    }
  }

  if (style === 'mission') {
    if (params.primaryWood !== 'white-oak') {
      recommendations.push('Mission: Quartersawn white oak is the authentic choice for ray fleck figure.')
    }
    if (!params.showSlats) {
      recommendations.push('Mission: Consider adding slat end panels for authentic Arts & Crafts look.')
    }
  }

  if (style === 'mid-century-modern') {
    if (params.legStyle !== 'splayed') {
      recommendations.push('MCM: Splayed, tapered legs are the signature element of this style.')
    }
    if ((params.apronHeight as number) > 3) {
      recommendations.push('MCM: Consider reducing apron height for visual lightness.')
    }
  }

  // General recommendations
  const width = params.width as number
  const legThickness = params.legThickness as number
  if (width && legThickness && width > 30 && legThickness < 2) {
    recommendations.push('Wide tables benefit from legs at least 2" thick for visual stability.')
  }

  return recommendations
}
