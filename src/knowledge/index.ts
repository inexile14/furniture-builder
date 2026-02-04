/**
 * Woodworking Knowledge Base
 *
 * Structured domain knowledge for furniture design and construction.
 * This module provides the intelligence layer that powers intelligent defaults,
 * validation explanations, and design guidance throughout the platform.
 */

// Joinery knowledge
export * from './joinery'

// Re-export commonly used items at top level
export {
  JOINTS_BY_ID,
  JOINTS_BY_CATEGORY,
  ALL_JOINTS,
  calculateTenonThickness,
  calculateMortiseDepth,
  recommendJoint,
  explainJointSizing,
  validateJointParams
} from './joinery'

// Knowledge module types
export interface KnowledgeQuery {
  domain: 'joinery' | 'wood-science' | 'design' | 'finishing' | 'tools'
  topic?: string
  context?: Record<string, unknown>
}

export interface KnowledgeResponse {
  content: string
  sources?: string[]
  relatedTopics?: string[]
  confidence: 'high' | 'medium' | 'low'
}
