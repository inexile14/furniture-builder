/**
 * Hook for accessing joinery knowledge in React components
 *
 * Provides easy access to joint definitions, explanations, and calculations
 * for use in tooltips, validation messages, and the UI.
 */

import { useMemo } from 'react'
import {
  JOINTS_BY_ID,
  JOINTS_BY_CATEGORY,
  JointDefinition,
  JointCategory,
  SkillLevel,
  calculateTenonThickness,
  calculateMortiseDepth,
  recommendJoint
} from '../knowledge/joinery'
import type { JointType, TopAttachmentMethod } from '../types'

/**
 * Map from our app's joint type names to knowledge base IDs
 */
const JOINT_TYPE_TO_KNOWLEDGE_ID: Record<JointType, string> = {
  'mortise-tenon': 'blind-mortise-tenon',
  'through-tenon': 'through-mortise-tenon',
  'domino': 'loose-tenon',
  'dowel': 'dowel-joint',
  'pocket-screw': 'pocket-screw',
  'half-lap': 'box-joint' // Closest approximation in current knowledge base
}

const TOP_ATTACHMENT_TO_KNOWLEDGE_ID: Record<TopAttachmentMethod, string> = {
  'buttons': 'button-attachment',
  'figure-8': 'figure-8-fastener',
  'elongated-holes': 'figure-8-fastener', // Similar concept
  'z-clips': 'figure-8-fastener' // Similar concept
}

/**
 * Hook for accessing joinery knowledge
 */
export function useJoineryKnowledge() {
  /**
   * Get full definition for a joint type
   */
  const getJointDefinition = useMemo(() => {
    return (jointType: JointType): JointDefinition | null => {
      const knowledgeId = JOINT_TYPE_TO_KNOWLEDGE_ID[jointType]
      return JOINTS_BY_ID[knowledgeId] || null
    }
  }, [])

  /**
   * Get a brief description suitable for a tooltip
   */
  const getJointTooltip = useMemo(() => {
    return (jointType: JointType): string => {
      const def = getJointDefinition(jointType)
      if (!def) return ''

      // Return first sentence of description + strength rating
      const firstSentence = def.description.split('.')[0] + '.'
      return `${firstSentence} Strength: ${def.strength.rating}.`
    }
  }, [getJointDefinition])

  /**
   * Get detailed explanation for why a joint is appropriate
   */
  const getJointExplanation = useMemo(() => {
    return (jointType: JointType): string => {
      const def = getJointDefinition(jointType)
      if (!def) return ''

      const reasons = def.whenToUse.slice(0, 3).join('; ')
      return `${def.name}: ${def.description.split('.')[0]}. Best used for: ${reasons}.`
    }
  }, [getJointDefinition])

  /**
   * Get top attachment method explanation
   */
  const getTopAttachmentTooltip = useMemo(() => {
    return (method: TopAttachmentMethod): string => {
      const knowledgeId = TOP_ATTACHMENT_TO_KNOWLEDGE_ID[method]
      const def = JOINTS_BY_ID[knowledgeId]
      if (!def) return ''

      return `${def.description.split('.')[0]}. ${def.advantages[0]}.`
    }
  }, [])

  /**
   * Calculate and explain tenon dimensions
   */
  const getTenonSizing = useMemo(() => {
    return (stockThickness: number, mortisedStockThickness: number) => {
      const tenonThickness = calculateTenonThickness(stockThickness)
      const mortiseDepth = calculateMortiseDepth(mortisedStockThickness)

      return {
        tenonThickness,
        mortiseDepth,
        tenonLength: mortiseDepth - 0.0625, // Minus the clearance
        explanation: `Using the rule of thirds: ${stockThickness}" stock → ${tenonThickness}" tenon. ` +
          `Mortise depth: ${mortiseDepth.toFixed(3)}" (tenon length + 1/16" clearance).`
      }
    }
  }, [])

  /**
   * Recommend joints for a specific use case
   */
  const getRecommendedJoints = useMemo(() => {
    return (
      category: 'leg-apron' | 'stretcher' | 'drawer' | 'top-attachment',
      skillLevel: SkillLevel = 'intermediate'
    ): JointDefinition[] => {
      const categoryMap: Record<string, JointCategory> = {
        'leg-apron': 'frame',
        'stretcher': 'stretcher',
        'drawer': 'case',
        'top-attachment': 'top-attachment'
      }

      return recommendJoint(categoryMap[category], skillLevel, 'good')
    }
  }, [])

  /**
   * Get common mistakes for a joint (useful for validation messages)
   */
  const getCommonMistakes = useMemo(() => {
    return (jointType: JointType) => {
      const def = getJointDefinition(jointType)
      if (!def) return []

      return def.commonMistakes.map(m => ({
        mistake: m.mistake,
        consequence: m.consequence,
        prevention: m.prevention
      }))
    }
  }, [getJointDefinition])

  /**
   * Get tool options for a joint
   */
  const getToolOptions = useMemo(() => {
    return (jointType: JointType) => {
      const def = getJointDefinition(jointType)
      if (!def) return []

      return def.toolOptions.map(t => ({
        method: t.method,
        tools: t.tools,
        timeEstimate: t.timeEstimate,
        notes: t.notes
      }))
    }
  }, [getJointDefinition])

  return {
    getJointDefinition,
    getJointTooltip,
    getJointExplanation,
    getTopAttachmentTooltip,
    getTenonSizing,
    getRecommendedJoints,
    getCommonMistakes,
    getToolOptions,
    // Direct access to knowledge base
    allJoints: JOINTS_BY_ID,
    jointsByCategory: JOINTS_BY_CATEGORY
  }
}

/**
 * Get a validation message with explanation
 */
export function getJoineryValidationMessage(
  jointType: JointType,
  issue: 'too-thin' | 'too-thick' | 'too-short' | 'too-long' | 'weak-for-application'
): string {
  const knowledgeId = JOINT_TYPE_TO_KNOWLEDGE_ID[jointType]
  const def = JOINTS_BY_ID[knowledgeId]

  if (!def) return 'Invalid joint configuration'

  const messages: Record<string, string> = {
    'too-thin': `Tenon may be too thin. ${def.sizing.constraints.find(c =>
      c.rule.toLowerCase().includes('minimum'))?.reason || 'Thin tenons are prone to breaking.'}`,
    'too-thick': `Tenon may be too thick. ${def.sizing.constraints.find(c =>
      c.rule.toLowerCase().includes('maximum'))?.reason || 'Thick tenons weaken the mortised piece.'}`,
    'too-short': `Tenon may be too short for adequate strength. Standard is 2/3 to 3/4 of mortised stock thickness.`,
    'too-long': `Tenon may be too long. Leave at least 1/4" at bottom of blind mortise.`,
    'weak-for-application': `${def.name} may not provide adequate strength. ` +
      `Consider: ${def.whenNotToUse[0] || 'a stronger joint for this application.'}`
  }

  return messages[issue] || 'Check joint configuration.'
}

/**
 * Format joint info for display in export/plans
 */
export function formatJointForPlan(
  jointType: JointType,
  params: {
    stockThickness?: number
    mortisedStockThickness?: number
    tenonThickness?: number
    tenonLength?: number
  }
): string {
  const knowledgeId = JOINT_TYPE_TO_KNOWLEDGE_ID[jointType]
  const def = JOINTS_BY_ID[knowledgeId]

  if (!def) return ''

  let output = `## ${def.name}\n\n`
  output += `${def.description.split('.').slice(0, 2).join('.')}.\n\n`

  if (params.tenonThickness && params.tenonLength) {
    output += `### Dimensions\n`
    output += `- Tenon thickness: ${params.tenonThickness}"\n`
    output += `- Tenon length: ${params.tenonLength}"\n`
    output += `- Mortise depth: ${(params.tenonLength + 0.0625).toFixed(3)}"\n\n`
  }

  output += `### Cutting Sequence\n`
  const tool = def.toolOptions.find(t => t.category === 'hybrid') || def.toolOptions[0]
  if (tool) {
    output += `Method: ${tool.method}\n`
    output += `Tools needed: ${tool.tools.join(', ')}\n\n`
  }

  output += `### Common Mistakes to Avoid\n`
  def.commonMistakes.slice(0, 3).forEach(m => {
    output += `- **${m.mistake}**: ${m.prevention}\n`
  })

  return output
}
