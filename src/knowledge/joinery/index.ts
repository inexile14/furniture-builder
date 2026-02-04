/**
 * Woodworking Joinery Knowledge Base
 *
 * Comprehensive rules, formulas, and guidance for furniture joinery.
 * This structured knowledge powers intelligent defaults, validation
 * explanations, and design guidance throughout the platform.
 */

// =============================================================================
// JOINT TYPE DEFINITIONS
// =============================================================================

export type JointCategory =
  | 'frame'           // Leg-to-apron, rail-to-stile
  | 'case'            // Box construction, carcass
  | 'edge'            // Edge-to-edge glue-ups
  | 'panel'           // Panel-to-frame
  | 'stretcher'       // Stretcher-to-leg
  | 'top-attachment'  // Securing tabletops

export type StrengthRating = 'excellent' | 'very-good' | 'good' | 'moderate' | 'weak'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export type ToolCategory = 'hand-tools' | 'power-tools' | 'hybrid' | 'cnc'

export interface JointDefinition {
  id: string
  name: string
  alternateName?: string[]
  category: JointCategory[]

  description: string
  history?: string

  strength: {
    rating: StrengthRating
    tensile: StrengthRating      // Pulling apart
    shear: StrengthRating        // Sliding parallel
    racking: StrengthRating      // Twisting/diagonal
    notes: string
  }

  sizing: {
    formulas: JointFormula[]
    constraints: JointConstraint[]
    tolerances: JointTolerance[]
  }

  whenToUse: string[]
  whenNotToUse: string[]

  advantages: string[]
  disadvantages: string[]

  toolOptions: ToolOption[]

  commonMistakes: Mistake[]

  relatedJoints: string[]

  skillLevel: SkillLevel

  // For UI display
  visualComplexity: 1 | 2 | 3 | 4 | 5  // 1 = simple, 5 = complex
}

export interface JointFormula {
  parameter: string
  formula: string
  description: string
  example?: string
  source?: string
}

export interface JointConstraint {
  rule: string
  reason: string
  minimum?: number
  maximum?: number
  unit?: string
}

export interface JointTolerance {
  fit: 'friction' | 'snug' | 'slip' | 'loose' | 'clamped' | 'tapered'
  description: string
  clearance: string
  whenToUse: string
}

export interface ToolOption {
  method: string
  tools: string[]
  category: ToolCategory
  timeEstimate: string
  notes?: string
}

export interface Mistake {
  mistake: string
  consequence: string
  prevention: string
  fix?: string
}


// =============================================================================
// MORTISE AND TENON JOINTS
// =============================================================================

export const BLIND_MORTISE_TENON: JointDefinition = {
  id: 'blind-mortise-tenon',
  name: 'Blind Mortise & Tenon',
  alternateName: ['Stub Mortise & Tenon', 'Stopped Mortise & Tenon'],
  category: ['frame', 'stretcher'],

  description: `The fundamental joint of furniture making. A rectangular projection (tenon)
fits into a matching rectangular hole (mortise). "Blind" means the tenon doesn't pass
through—it's hidden inside the mortised piece. This joint has been used for thousands
of years and remains the gold standard for frame construction.`,

  history: `Evidence of mortise and tenon joints dates back to ancient Egypt (3000+ BCE)
and has been found in furniture from the tomb of Tutankhamun. The joint became the
foundation of European furniture making and was refined during the Arts & Crafts movement.`,

  strength: {
    rating: 'excellent',
    tensile: 'excellent',
    shear: 'excellent',
    racking: 'very-good',
    notes: `Strength comes from long-grain to long-grain glue surface on tenon cheeks.
The mechanical interlock resists pulling forces, while the shoulders resist racking.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Tenon thickness',
        formula: 'Stock thickness × 1/3',
        description: `The "rule of thirds" - tenon thickness should be approximately
one-third of the stock thickness. This leaves adequate material on both sides of
the mortise (the "cheeks") for strength.`,
        example: '3/4" stock → 1/4" tenon',
        source: 'Traditional rule, validated by Fine Woodworking testing'
      },
      {
        parameter: 'Tenon length',
        formula: 'Mortised stock thickness × 2/3 to 3/4',
        description: `Tenon should penetrate 2/3 to 3/4 of the mortised piece.
Deeper = stronger, but leave at least 1/4" at the bottom of a blind mortise.`,
        example: '2.5" leg → 1-5/8" to 1-7/8" tenon length'
      },
      {
        parameter: 'Tenon width',
        formula: 'Stock width - (2 × shoulder width)',
        description: `Tenon width is the stock width minus shoulders on each edge.
Shoulders help hide gaps and provide racking resistance.`,
        example: '4" apron with 1/4" shoulders → 3-1/2" tenon width'
      },
      {
        parameter: 'Mortise depth',
        formula: 'Tenon length + 1/16"',
        description: `Mortise should be slightly deeper than tenon length to ensure
shoulders seat fully and allow space for excess glue.`,
        example: '1-5/8" tenon → 1-11/16" mortise depth'
      },
      {
        parameter: 'Shoulder width',
        formula: '1/4" to 3/8" typical',
        description: `Shoulders provide visual definition and racking resistance.
Wider shoulders = better racking resistance but smaller tenon.`
      },
      {
        parameter: 'Mortise setback from face',
        formula: '3/16" to 1/4"',
        description: `Setting the mortise back from the face creates a visual reveal
and prevents the apron from being flush with the leg face.`
      }
    ],
    constraints: [
      {
        rule: 'Minimum tenon thickness',
        reason: 'Thinner tenons are weak and prone to breaking during assembly',
        minimum: 0.1875, // 3/16"
        unit: 'inches'
      },
      {
        rule: 'Maximum tenon thickness ratio',
        reason: 'Tenon over 1/2 of stock thickness weakens the mortised piece',
        maximum: 0.5
      },
      {
        rule: 'Minimum mortise wall thickness',
        reason: 'Walls thinner than 1/4" may split during assembly or under load',
        minimum: 0.25,
        unit: 'inches'
      },
      {
        rule: 'Tenon length limit',
        reason: 'Leave at least 1/4" at bottom of blind mortise',
        maximum: 0.75 // as ratio of mortised stock
      }
    ],
    tolerances: [
      {
        fit: 'friction',
        description: 'Tenon requires firm hand pressure or light mallet tap to seat',
        clearance: '0.001" to 0.002" undersize',
        whenToUse: 'Standard for most furniture joints, especially load-bearing'
      },
      {
        fit: 'snug',
        description: 'Tenon slides in with moderate hand pressure',
        clearance: '0.003" to 0.005" undersize',
        whenToUse: 'When multiple joints must align simultaneously during assembly'
      },
      {
        fit: 'slip',
        description: 'Tenon slides freely into mortise',
        clearance: '0.005" to 0.010" undersize',
        whenToUse: 'For knockdown furniture or joints that will be wedged/pinned'
      }
    ]
  },

  whenToUse: [
    'Leg-to-apron connections on tables and chairs',
    'Rail-to-stile joints in frame-and-panel construction',
    'Stretcher-to-leg joints',
    'Any frame joint requiring high strength',
    'When joint must be invisible from outside'
  ],

  whenNotToUse: [
    'When decorative through-tenon is desired',
    'End-grain to end-grain connections (use different joint)',
    'Very thin stock under 1/2" (consider dowels or biscuits)',
    'When disassembly may be needed (unless pinned, not glued)'
  ],

  advantages: [
    'Strongest joint for frame construction',
    'Large long-grain glue surface',
    'Mechanical interlock resists pulling apart',
    'Shoulders resist racking',
    'Hidden from view when assembled',
    'Time-tested over millennia'
  ],

  disadvantages: [
    'Requires accurate layout and cutting',
    'More time-consuming than dowels or pocket screws',
    'Difficult to adjust once cut',
    'Requires mortising tools (chisel, machine, or router)'
  ],

  toolOptions: [
    {
      method: 'Mortise chisel + hand saw',
      tools: ['Mortise chisel (sized to tenon)', 'Back saw or tenon saw', 'Shoulder plane', 'Marking gauge'],
      category: 'hand-tools',
      timeEstimate: '30-45 min per joint',
      notes: 'Traditional method. Quiet, precise, satisfying. Requires sharp tools and practice.'
    },
    {
      method: 'Drill press + chisel, table saw',
      tools: ['Drill press with Forstner bit', 'Chisel to square corners', 'Table saw with dado blade or tenoning jig'],
      category: 'hybrid',
      timeEstimate: '15-20 min per joint',
      notes: 'Common shop method. Drill removes most waste, chisel squares up.'
    },
    {
      method: 'Hollow chisel mortiser + table saw',
      tools: ['Hollow chisel mortiser', 'Table saw with tenoning jig'],
      category: 'power-tools',
      timeEstimate: '10-15 min per joint',
      notes: 'Fastest manual method. Dedicated mortiser cuts square holes directly.'
    },
    {
      method: 'Plunge router + table saw',
      tools: ['Plunge router with spiral upcut bit', 'Edge guide or mortising jig', 'Table saw'],
      category: 'power-tools',
      timeEstimate: '10-15 min per joint',
      notes: 'Clean mortises with rounded ends. Either round tenon corners or square mortise corners.'
    },
    {
      method: 'Domino joiner',
      tools: ['Festool Domino'],
      category: 'power-tools',
      timeEstimate: '2-3 min per joint',
      notes: 'Uses loose tenons. Extremely fast and accurate. High tool cost (~$1000+).'
    },
    {
      method: 'CNC router',
      tools: ['CNC router', 'CAM software'],
      category: 'cnc',
      timeEstimate: '1-2 min per joint (after setup)',
      notes: 'Perfect repeatability. Setup time significant for one-offs.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Mortise too shallow',
      consequence: 'Tenon bottoms out before shoulders seat, leaving visible gap',
      prevention: 'Always cut mortise 1/16" deeper than tenon length',
      fix: 'Trim tenon length or deepen mortise'
    },
    {
      mistake: 'Tenon too tight',
      consequence: 'Splits mortise walls during assembly, especially with glue swelling',
      prevention: 'Test fit dry. Should require firm hand pressure, not hammering.',
      fix: 'Pare tenon cheeks with shoulder plane or chisel'
    },
    {
      mistake: 'Tenon too loose',
      consequence: 'Weak joint, visible gaps, may fail under load',
      prevention: 'Cut tenons slightly fat, sneak up on fit',
      fix: 'Glue veneer or paper shim to tenon cheeks (not ideal)'
    },
    {
      mistake: 'Shoulders not square',
      consequence: 'Gaps visible at joint line',
      prevention: 'Use sharp saw, cut on waste side, clean up with shoulder plane',
      fix: 'Pare shoulders flat with chisel'
    },
    {
      mistake: 'Mortise walls not parallel',
      consequence: 'Tenon rocks, uneven glue squeeze, weak joint',
      prevention: 'Use guide or jig to keep chisel/bit vertical',
      fix: 'Pare walls flat, may need to adjust tenon thickness'
    },
    {
      mistake: 'Glue squeeze-out blocks shoulder',
      consequence: 'Gap at shoulder line',
      prevention: 'Apply glue to mortise walls and tenon cheeks only, not shoulders',
      fix: 'Disassemble quickly if glue is wet; otherwise, live with gap'
    },
    {
      mistake: 'Tenon grain orientation wrong',
      consequence: 'Weak tenon prone to splitting along grain',
      prevention: 'Tenon cheeks should be long-grain faces, never end grain',
      fix: 'Recut from properly oriented stock'
    }
  ],

  relatedJoints: [
    'through-mortise-tenon',
    'haunched-mortise-tenon',
    'wedged-mortise-tenon',
    'twin-mortise-tenon',
    'loose-tenon'
  ],

  skillLevel: 'intermediate',
  visualComplexity: 3
}


export const THROUGH_MORTISE_TENON: JointDefinition = {
  id: 'through-mortise-tenon',
  name: 'Through Mortise & Tenon',
  alternateName: ['Through Tenon', 'Exposed Tenon'],
  category: ['frame', 'stretcher'],

  description: `A mortise and tenon where the tenon passes completely through the
mortised piece and is visible (and often proud) on the opposite face. This joint
celebrates the joinery as a design element. Common in Arts & Crafts, Mission, and
contemporary furniture where honest construction is valued.`,

  history: `While blind mortise and tenon was preferred in formal furniture to hide
construction, through tenons were common in vernacular and utilitarian pieces. The
Arts & Crafts movement (1880-1920) elevated through tenons to a design feature,
celebrating the "honest" expression of structure.`,

  strength: {
    rating: 'excellent',
    tensile: 'excellent',
    shear: 'excellent',
    racking: 'excellent',
    notes: `Slightly stronger than blind tenon because full tenon length is supported.
Can be wedged from the exit side for mechanical lock that doesn't rely on glue.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Tenon thickness',
        formula: 'Stock thickness × 1/3',
        description: 'Same rule of thirds as blind tenon',
        example: '7/8" apron → 5/16" tenon (round to nearest standard chisel size)'
      },
      {
        parameter: 'Tenon length',
        formula: 'Mortised stock thickness + 1/16" to 1/8"',
        description: `Through tenon should be slightly proud of exit face.
This allows for trimming flush or leaving proud as design element.`,
        example: '2.5" leg → 2-9/16" to 2-5/8" tenon length'
      },
      {
        parameter: 'Proud amount (if left proud)',
        formula: '1/8" to 1/4" typical',
        description: 'Amount tenon projects past exit face. More = bolder statement.'
      }
    ],
    constraints: [
      {
        rule: 'Exit face must be accessible',
        reason: 'Need to flush-cut or shape the through tenon after assembly'
      },
      {
        rule: 'Consider exit face visibility',
        reason: 'Through tenons are visible—ensure wood match and grain alignment'
      }
    ],
    tolerances: [
      {
        fit: 'friction',
        description: 'Standard fit for glued joints',
        clearance: '0.001" to 0.002" undersize',
        whenToUse: 'Most furniture applications'
      },
      {
        fit: 'slip',
        description: 'Looser fit when wedging will secure the joint',
        clearance: '0.005" to 0.010" undersize',
        whenToUse: 'Wedged through tenons, knockdown joints'
      }
    ]
  },

  whenToUse: [
    'Arts & Crafts or Mission style furniture',
    'When celebrating joinery as design element',
    'Stretcher-to-leg joints on trestle tables',
    'When wedging is desired for extra strength',
    'Workbenches and utilitarian furniture',
    'When maximum strength is needed'
  ],

  whenNotToUse: [
    'Formal furniture where hidden joinery is preferred',
    'When exit face will be against a wall or hidden',
    'If wood species/color differs noticeably between pieces'
  ],

  advantages: [
    'Strongest form of mortise and tenon',
    'Can be wedged for mechanical lock',
    'Visually expressive of construction',
    'Easier to verify joint is fully seated',
    'Can be knocked apart if unglued/wedged'
  ],

  disadvantages: [
    'More visible = more critical to get right',
    'Exit face tear-out possible if not careful',
    'Requires wood selection consideration',
    'Extra step of flush-cutting or shaping'
  ],

  toolOptions: [
    {
      method: 'Mortise chisel through, hand saw',
      tools: ['Mortise chisel', 'Back saw', 'Flush-cut saw', 'Block plane'],
      category: 'hand-tools',
      timeEstimate: '35-50 min per joint',
      notes: 'Chop mortise from both faces meeting in middle to prevent tear-out'
    },
    {
      method: 'Drill through + chisel, table saw',
      tools: ['Drill press with Forstner', 'Chisel', 'Table saw', 'Flush-cut saw'],
      category: 'hybrid',
      timeEstimate: '20-25 min per joint',
      notes: 'Drill from both faces to prevent exit tear-out'
    },
    {
      method: 'Router through with template',
      tools: ['Plunge router', 'Template/jig', 'Spiral bit'],
      category: 'power-tools',
      timeEstimate: '15-20 min per joint',
      notes: 'Clean results, back up exit face to prevent tear-out'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Exit face tear-out',
      consequence: 'Ragged, splintered hole visible on show face',
      prevention: 'Cut mortise from both faces meeting in middle, or back up exit with sacrificial board',
      fix: 'Fill with matching wood plug or dutchman (not ideal)'
    },
    {
      mistake: 'Tenon too short',
      consequence: 'Tenon doesn\'t project, can\'t trim flush cleanly',
      prevention: 'Add 1/8" to mortised stock thickness',
      fix: 'Use contrasting wood cap glued to tenon end (design choice)'
    },
    {
      mistake: 'Misaligned through mortise',
      consequence: 'Entry and exit don\'t align, tenon binds',
      prevention: 'Use marking gauge from same reference face, careful layout',
      fix: 'Pare mortise walls to align (may widen mortise)'
    }
  ],

  relatedJoints: [
    'blind-mortise-tenon',
    'wedged-through-tenon',
    'tusked-tenon',
    'keyed-tenon'
  ],

  skillLevel: 'intermediate',
  visualComplexity: 3
}


export const HAUNCHED_MORTISE_TENON: JointDefinition = {
  id: 'haunched-mortise-tenon',
  name: 'Haunched Mortise & Tenon',
  alternateName: ['Haunched Tenon'],
  category: ['frame', 'panel'],

  description: `A mortise and tenon with a small stepped section (haunch) at the top
of the tenon. The haunch fills the groove for a panel and prevents the rail from
twisting. Essential for frame-and-panel construction and useful wherever a rail
meets a stile at the end.`,

  strength: {
    rating: 'excellent',
    tensile: 'excellent',
    shear: 'excellent',
    racking: 'excellent',
    notes: `The haunch adds twist resistance and fills the panel groove that would
otherwise be exposed at the top of the stile.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Tenon thickness',
        formula: 'Stock thickness × 1/3',
        description: 'Standard rule of thirds'
      },
      {
        parameter: 'Haunch depth',
        formula: 'Equal to panel groove depth',
        description: 'Haunch fills the groove, typically 1/4" to 3/8"',
        example: '1/4" panel groove → 1/4" haunch depth'
      },
      {
        parameter: 'Haunch width',
        formula: '1/3 to 1/2 of tenon width, or equal to rail width minus tenon length',
        description: 'Haunch is shorter than main tenon body',
        example: '4" rail with 2" tenon → 1/2" to 3/4" haunch width'
      },
      {
        parameter: 'Main tenon length',
        formula: 'Standard blind tenon rules apply for main body',
        description: '2/3 to 3/4 of stile thickness'
      }
    ],
    constraints: [
      {
        rule: 'Haunch must match groove',
        reason: 'Haunch exists to fill panel groove and must align perfectly'
      },
      {
        rule: 'Haunch mortise must be cut before groove',
        reason: 'Groove should stop at haunch mortise, not extend beyond'
      }
    ],
    tolerances: [
      {
        fit: 'friction',
        description: 'Standard tight fit',
        clearance: '0.001" to 0.002" undersize',
        whenToUse: 'All frame-and-panel construction'
      }
    ]
  },

  whenToUse: [
    'Frame-and-panel doors and cabinet sides',
    'Any joint where rail meets stile at the end',
    'When panel groove would otherwise be exposed',
    'To add twist resistance to wide rails'
  ],

  whenNotToUse: [
    'Mid-rail joints (use regular M&T)',
    'When no panel groove exists',
    'Simple frame construction without panels'
  ],

  advantages: [
    'Fills panel groove at stile ends',
    'Prevents rail from twisting',
    'Adds mechanical interlock',
    'Traditional, proven joint'
  ],

  disadvantages: [
    'More complex to lay out and cut',
    'Requires matching groove and haunch depth',
    'Extra step in the cutting process'
  ],

  toolOptions: [
    {
      method: 'Hand tools throughout',
      tools: ['Marking gauge', 'Mortise chisel', 'Back saw', 'Router plane for groove'],
      category: 'hand-tools',
      timeEstimate: '40-55 min per joint'
    },
    {
      method: 'Router for groove, power for tenon',
      tools: ['Router with slot cutter or straight bit', 'Table saw for tenon', 'Chisel for haunch mortise'],
      category: 'hybrid',
      timeEstimate: '20-30 min per joint'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Haunch depth doesn\'t match groove',
      consequence: 'Gap at top of stile where haunch should fill groove',
      prevention: 'Set haunch depth from same setup as groove depth',
      fix: 'Shim haunch or deepen haunch mortise'
    },
    {
      mistake: 'Panel groove extends past haunch mortise',
      consequence: 'Groove visible at end of stile',
      prevention: 'Stop groove at haunch mortise or cut groove after mortise',
      fix: 'Plug groove end with matching wood'
    },
    {
      mistake: 'Haunch too wide, weakens tenon',
      consequence: 'Main tenon body too narrow, joint weakened',
      prevention: 'Keep haunch to 1/3 of total tenon width or less',
      fix: 'Recut with wider main tenon'
    }
  ],

  relatedJoints: [
    'blind-mortise-tenon',
    'mitered-mortise-tenon',
    'bridle-joint'
  ],

  skillLevel: 'intermediate',
  visualComplexity: 4
}


export const LOOSE_TENON: JointDefinition = {
  id: 'loose-tenon',
  name: 'Loose Tenon',
  alternateName: ['Floating Tenon', 'Domino Joint', 'Slip Tenon'],
  category: ['frame', 'edge', 'case'],

  description: `Instead of cutting an integral tenon on one piece, mortises are cut
in both pieces and a separate (loose) tenon bridges them. This joint is particularly
efficient with a Festool Domino, but can be made with any mortising method and
shop-made tenon stock.`,

  strength: {
    rating: 'very-good',
    tensile: 'very-good',
    shear: 'very-good',
    racking: 'good',
    notes: `Slightly less strong than integral tenon due to two glue lines instead
of one, but difference is negligible in most furniture applications. Grain direction
of loose tenon is critical—must run along tenon length.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Loose tenon thickness',
        formula: 'Mortised stock thickness × 1/3',
        description: 'Same rule as integral tenon',
        example: '3/4" stock → 1/4" tenon (or 8mm Domino)'
      },
      {
        parameter: 'Loose tenon length',
        formula: 'Total of both mortise depths',
        description: 'Tenon should nearly bottom out in both mortises',
        example: 'Two 1" deep mortises → 1-15/16" tenon (leave 1/32" gap each side)'
      },
      {
        parameter: 'Mortise depth (each piece)',
        formula: '1" to 1.5" typical, or half the tenon length',
        description: 'Deeper = stronger, but limited by stock thickness'
      },
      {
        parameter: 'Loose tenon width',
        formula: 'Match mortise width, typically 1" to 2"',
        description: 'Wider = more glue surface and racking resistance'
      }
    ],
    constraints: [
      {
        rule: 'Grain direction critical',
        reason: 'Loose tenon grain must run lengthwise, or tenon will split',
      },
      {
        rule: 'Both mortises must align',
        reason: 'Misaligned mortises cause joint to rack during assembly'
      }
    ],
    tolerances: [
      {
        fit: 'snug',
        description: 'Should slide in with hand pressure',
        clearance: '0.003" to 0.005" undersize',
        whenToUse: 'Standard for loose tenon joints'
      }
    ]
  },

  whenToUse: [
    'When integral tenon cutting is impractical (e.g., curves, miters)',
    'For production work (faster than integral tenons)',
    'Joining wide boards edge-to-edge with reinforcement',
    'When you have a Festool Domino',
    'Repair work where integral tenon would require reconstruction'
  ],

  whenNotToUse: [
    'When joint will be visible (unless desired aesthetic)',
    'When only hand tools available (integral tenon may be faster)',
    'For historical reproductions where loose tenons are anachronistic'
  ],

  advantages: [
    'Very fast with Domino or router jig',
    'Both pieces can be cut identically',
    'Works on curved or mitered pieces',
    'Easy to align and clamp',
    'Can use strong species for tenon (e.g., white oak tenon in pine)'
  ],

  disadvantages: [
    'Two glue lines instead of one',
    'Requires precision alignment of two mortises',
    'Domino system is expensive',
    'Shop-made tenons require extra step',
    'Not traditional (matters for period pieces)'
  ],

  toolOptions: [
    {
      method: 'Festool Domino',
      tools: ['Domino DF 500 or DF 700', 'Domino tenons (various sizes)'],
      category: 'power-tools',
      timeEstimate: '2-3 min per joint',
      notes: 'Purpose-built for this joint. Expensive but extremely fast and accurate.'
    },
    {
      method: 'Plunge router + jig',
      tools: ['Plunge router', 'Mortising jig', 'Spiral upcut bit', 'Shop-made tenon stock'],
      category: 'power-tools',
      timeEstimate: '10-15 min per joint',
      notes: 'Cut mortises in both pieces, make tenon stock on table saw'
    },
    {
      method: 'Drill press + chisel',
      tools: ['Drill press', 'Forstner bit', 'Chisel', 'Shop-made tenons'],
      category: 'hybrid',
      timeEstimate: '15-20 min per joint',
      notes: 'Mortise method similar to traditional, add loose tenon'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Loose tenon grain runs wrong direction',
      consequence: 'Tenon splits along grain, joint fails',
      prevention: 'Always orient grain along tenon length',
      fix: 'Replace with correctly oriented tenon'
    },
    {
      mistake: 'Mortises misaligned',
      consequence: 'Joint won\'t assemble or racks when clamped',
      prevention: 'Use consistent reference face, mark carefully, use jig',
      fix: 'Pare mortises to align (weakens joint) or recut'
    },
    {
      mistake: 'Tenon too tight',
      consequence: 'Difficult assembly, may split mortise walls',
      prevention: 'Size tenon for snug fit, not friction fit',
      fix: 'Sand or plane tenon thinner'
    }
  ],

  relatedJoints: [
    'blind-mortise-tenon',
    'dowel-joint',
    'biscuit-joint'
  ],

  skillLevel: 'beginner',
  visualComplexity: 2
}


// =============================================================================
// DOVETAIL JOINTS
// =============================================================================

export const THROUGH_DOVETAIL: JointDefinition = {
  id: 'through-dovetail',
  name: 'Through Dovetail',
  alternateName: ['English Dovetail', 'Common Dovetail'],
  category: ['case'],

  description: `The quintessential joint for box and drawer construction. Interlocking
wedge-shaped "tails" and "pins" create a mechanical lock that resists pulling apart.
The joint is visible from both faces—a mark of quality craftsmanship.`,

  history: `Dovetails have been used since ancient Egypt. The joint became the standard
for drawer construction by the 17th century and remains the benchmark of quality
furniture making. Hand-cut dovetails are prized for their slight irregularities
that indicate handwork.`,

  strength: {
    rating: 'excellent',
    tensile: 'excellent',
    shear: 'good',
    racking: 'good',
    notes: `Exceptional resistance to being pulled apart due to wedge shape. Weaker
in shear (sliding) and racking because end grain is involved. Glue is secondary
to mechanical interlock.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Dovetail angle',
        formula: '1:6 for softwood, 1:8 for hardwood',
        description: `Angle determines mechanical lock vs. strength. Steeper angle
(1:6) locks better but has weaker short grain. Shallower (1:8) stronger in hardwood.`,
        example: 'Softwood (pine): 1:6 = 9.5°. Hardwood (oak): 1:8 = 7°'
      },
      {
        parameter: 'Pin width (narrowest)',
        formula: '1/8" to 1/4" typical',
        description: `Narrow pins are visually appealing and traditional. Very narrow
pins require skill to cut without breaking.`,
        example: '1/8" pins = delicate look, 1/4" pins = robust'
      },
      {
        parameter: 'Tail width',
        formula: '2× to 3× pin width, or spaced evenly',
        description: 'Tails are typically wider than pins for visual balance'
      },
      {
        parameter: 'Tail spacing',
        formula: 'Divide board width evenly, adjust half-pins at ends',
        description: 'Start with half-pin at each end for strength'
      },
      {
        parameter: 'Depth of cut',
        formula: 'Equals mating board thickness',
        description: 'Tails and pins are cut to depth equal to adjoining piece'
      },
      {
        parameter: 'Half-pin width',
        formula: '1/4" to 1/2" typical',
        description: 'Half-pins at edges should be wide enough not to break'
      }
    ],
    constraints: [
      {
        rule: 'Grain orientation',
        reason: 'Tails on drawer sides (long grain bridges end grain), pins on front/back'
      },
      {
        rule: 'Minimum half-pin width',
        reason: 'Half-pins too narrow will split',
        minimum: 0.25,
        unit: 'inches'
      }
    ],
    tolerances: [
      {
        fit: 'friction',
        description: 'Should require firm mallet taps to fully seat',
        clearance: 'Zero to 0.001" undersize',
        whenToUse: 'Standard for case construction'
      }
    ]
  },

  whenToUse: [
    'Drawer construction (gold standard)',
    'Box and case corners',
    'Blanket chests and tool chests',
    'Where joint visibility is desired as quality indicator',
    'When maximum pull-apart resistance is needed'
  ],

  whenNotToUse: [
    'Plywood or MDF (no long grain)',
    'When speed is priority (use rabbets or box joints)',
    'Hidden joints (use half-blind or rabbeted)'
  ],

  advantages: [
    'Strongest joint for box corners',
    'Self-aligning during assembly',
    'Mechanical interlock doesn\'t rely solely on glue',
    'Visual indicator of quality',
    'Historic authenticity'
  ],

  disadvantages: [
    'Time-consuming, especially by hand',
    'Requires skill and practice',
    'Visible from both sides (can\'t hide mistakes)',
    'Router jigs produce uniform, "machine-made" look'
  ],

  toolOptions: [
    {
      method: 'Hand-cut (tails first)',
      tools: ['Dovetail saw', 'Coping saw or fret saw', 'Chisels (1/4", 1/2", 3/4")', 'Dovetail marker', 'Marking gauge'],
      category: 'hand-tools',
      timeEstimate: '30-60 min per corner',
      notes: 'Traditional method. Tails cut first, used to mark pins. Satisfying but slow.'
    },
    {
      method: 'Hand-cut (pins first)',
      tools: ['Same as above'],
      category: 'hand-tools',
      timeEstimate: '30-60 min per corner',
      notes: 'Some prefer pins first for easier saw entry. Matter of preference.'
    },
    {
      method: 'Router with jig (e.g., Leigh)',
      tools: ['Router', 'Dovetail bit', 'Leigh or similar jig'],
      category: 'power-tools',
      timeEstimate: '10-15 min per corner',
      notes: 'Fast and consistent. Produces uniform spacing that looks machine-made.'
    },
    {
      method: 'Bandsaw + cleanup',
      tools: ['Bandsaw with narrow blade', 'Chisels'],
      category: 'hybrid',
      timeEstimate: '20-30 min per corner',
      notes: 'Bandsaw cuts cheeks, chisel cleans waste. Faster than pure hand work.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Gaps between pins and tails',
      consequence: 'Visible gaps, weakened joint, unsightly',
      prevention: 'Mark directly from mating piece, cut to the line',
      fix: 'Fill gaps with matching wood shavings and glue, or wedge'
    },
    {
      mistake: 'Baseline overcut',
      consequence: 'Visible line on show face',
      prevention: 'Stop chisel work at baseline, pare carefully',
      fix: 'Cannot be fixed, sand and finish to minimize'
    },
    {
      mistake: 'Tails/pins split during assembly',
      consequence: 'Broken joint, unusable',
      prevention: 'Don\'t force too-tight joint, pare for proper fit',
      fix: 'Glue split carefully, may need to recut'
    },
    {
      mistake: 'Wrong angle for wood species',
      consequence: 'Weak short grain (too steep) or loose joint (too shallow)',
      prevention: 'Use 1:6 for softwood, 1:8 for hardwood',
      fix: 'May work but suboptimal'
    }
  ],

  relatedJoints: [
    'half-blind-dovetail',
    'sliding-dovetail',
    'box-joint'
  ],

  skillLevel: 'advanced',
  visualComplexity: 5
}


export const HALF_BLIND_DOVETAIL: JointDefinition = {
  id: 'half-blind-dovetail',
  name: 'Half-Blind Dovetail',
  alternateName: ['Lapped Dovetail', 'Single-Lap Dovetail'],
  category: ['case'],

  description: `A dovetail joint where the pins don't go all the way through—they're
hidden by a "lap" of wood on the front face. Used where you want dovetail strength
but only want to see the joint from one direction (typically the side of a drawer).`,

  strength: {
    rating: 'excellent',
    tensile: 'excellent',
    shear: 'good',
    racking: 'good',
    notes: 'Same strength as through dovetails. The lap doesn\'t reduce joint integrity.'
  },

  sizing: {
    formulas: [
      {
        parameter: 'Lap thickness',
        formula: '1/8" to 1/4", or 1/4 to 1/3 of pin board thickness',
        description: `The lap hides the joint from the front. Thicker lap = more
hidden but shorter pins. 1/8" minimum to prevent break-through.`,
        example: '3/4" drawer front → 3/16" to 1/4" lap'
      },
      {
        parameter: 'Socket depth',
        formula: 'Pin board thickness minus lap',
        description: 'Depth the tails fit into',
        example: '3/4" front - 1/4" lap = 1/2" socket depth'
      },
      {
        parameter: 'Dovetail angle',
        formula: '1:6 softwood, 1:8 hardwood (same as through)',
        description: 'Standard angles apply'
      }
    ],
    constraints: [
      {
        rule: 'Lap must survive chopping',
        reason: 'Too-thin lap will break through during socket cutting',
        minimum: 0.125,
        unit: 'inches'
      }
    ],
    tolerances: [
      {
        fit: 'friction',
        description: 'Firm mallet taps to seat',
        clearance: 'Zero to 0.001" undersize',
        whenToUse: 'All half-blind applications'
      }
    ]
  },

  whenToUse: [
    'Drawer front-to-side joints (most common use)',
    'When you need dovetail strength but clean front face',
    'Traditional drawer construction'
  ],

  whenNotToUse: [
    'When full through dovetails are acceptable',
    'Very thin stock (lap becomes too fragile)'
  ],

  advantages: [
    'Hides joint from front face',
    'Same strength as through dovetails',
    'Traditional drawer construction method',
    'Clean front appearance'
  ],

  disadvantages: [
    'More difficult to cut than through dovetails',
    'Socket chopping requires care',
    'Limited socket depth with thin stock'
  ],

  toolOptions: [
    {
      method: 'Hand tools',
      tools: ['Dovetail saw', 'Chisels', 'Marking gauge', 'Router plane (optional)'],
      category: 'hand-tools',
      timeEstimate: '45-75 min per corner',
      notes: 'Tails cut first on side piece, sockets chopped in front. More difficult than through.'
    },
    {
      method: 'Router with half-blind jig',
      tools: ['Router', 'Dovetail bit', 'Half-blind jig (Leigh, Porter-Cable, etc.)'],
      category: 'power-tools',
      timeEstimate: '10-15 min per corner',
      notes: 'Common jig setup. Both pieces cut simultaneously.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Break through lap',
      consequence: 'Visible hole or chip on front face',
      prevention: 'Keep lap at least 1/8" thick, chop carefully',
      fix: 'Plug with matching wood, or use as back and cut new front'
    },
    {
      mistake: 'Sockets not flat',
      consequence: 'Tails don\'t seat fully, gaps visible',
      prevention: 'Use router plane or carefully pare flat with wide chisel',
      fix: 'Re-pare sockets flat'
    }
  ],

  relatedJoints: [
    'through-dovetail',
    'full-blind-dovetail',
    'sliding-dovetail'
  ],

  skillLevel: 'advanced',
  visualComplexity: 5
}


// =============================================================================
// SIMPLER JOINTS
// =============================================================================

export const DOWEL_JOINT: JointDefinition = {
  id: 'dowel-joint',
  name: 'Dowel Joint',
  alternateName: ['Dowel Reinforced Joint'],
  category: ['frame', 'edge', 'case'],

  description: `Round wooden pegs (dowels) inserted into matching holes in both pieces.
Simpler than mortise and tenon but weaker. Useful for alignment and edge joints,
and acceptable for light-duty frames when convenience matters.`,

  strength: {
    rating: 'good',
    tensile: 'good',
    shear: 'moderate',
    racking: 'moderate',
    notes: `Weaker than mortise and tenon due to less glue surface and no shoulders.
Adequate for many applications but not heavy-duty tables or chairs.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Dowel diameter',
        formula: '1/3 to 1/2 of stock thickness',
        description: 'Larger dowels = stronger, but leave enough wall material',
        example: '3/4" stock → 1/4" to 3/8" dowels'
      },
      {
        parameter: 'Dowel length',
        formula: 'Depth in each piece × 2',
        description: 'Typically penetrate 1" to 1.5" into each piece',
        example: '1" depth each side → 2" dowel'
      },
      {
        parameter: 'Number of dowels',
        formula: '2 minimum, add more for wider pieces',
        description: 'Two dowels minimum to prevent rotation. Space 2-3" apart for wider stock.'
      },
      {
        parameter: 'Hole depth',
        formula: 'Half dowel length + 1/16"',
        description: 'Slightly deeper than half dowel to allow for glue and ensure seating'
      }
    ],
    constraints: [
      {
        rule: 'Minimum dowel spacing from edge',
        reason: 'Too close to edge risks blow-out',
        minimum: 0.375,
        unit: 'inches'
      },
      {
        rule: 'Minimum wall thickness around dowel',
        reason: 'Prevents splitting',
        minimum: 0.1875,
        unit: 'inches'
      }
    ],
    tolerances: [
      {
        fit: 'snug',
        description: 'Dowel should slide in with hand pressure',
        clearance: '0.002" to 0.004" oversize hole',
        whenToUse: 'Standard dowel joints'
      }
    ]
  },

  whenToUse: [
    'Edge-to-edge glue-ups (alignment aid)',
    'Light-duty frame construction',
    'When speed and simplicity matter',
    'Beginning woodworkers not ready for M&T'
  ],

  whenNotToUse: [
    'Chairs and stools (high racking stress)',
    'Heavy tables (use mortise and tenon)',
    'When maximum strength is needed',
    'Critical structural joints'
  ],

  advantages: [
    'Simpler than mortise and tenon',
    'Fast with doweling jig',
    'Good for alignment in edge joints',
    'Off-the-shelf dowels available'
  ],

  disadvantages: [
    'Weaker than mortise and tenon',
    'Alignment of holes is critical',
    'No shoulders to resist racking',
    'Less glue surface'
  ],

  toolOptions: [
    {
      method: 'Doweling jig',
      tools: ['Self-centering doweling jig (Dowelmax, JessEm, etc.)', 'Drill', 'Brad point bit'],
      category: 'hybrid',
      timeEstimate: '5-10 min per joint',
      notes: 'Jig ensures alignment. Most practical method.'
    },
    {
      method: 'Dowel centers',
      tools: ['Drill', 'Brad point bit', 'Dowel centers', 'Combination square'],
      category: 'hand-tools',
      timeEstimate: '10-15 min per joint',
      notes: 'Drill one piece, insert centers, press to mark mating holes. Works but less accurate.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Holes misaligned',
      consequence: 'Joint won\'t assemble or goes together skewed',
      prevention: 'Use doweling jig, mark reference faces',
      fix: 'Plug holes with dowels and re-drill (not ideal)'
    },
    {
      mistake: 'Holes too shallow',
      consequence: 'Dowels bottom out, joint doesn\'t close',
      prevention: 'Use depth stop on drill, check depth',
      fix: 'Deepen holes or trim dowels'
    },
    {
      mistake: 'No glue escape route',
      consequence: 'Hydraulic lock prevents full seating',
      prevention: 'Use fluted dowels or cut shallow groove',
      fix: 'Withdraw and add relief groove to dowel'
    }
  ],

  relatedJoints: [
    'biscuit-joint',
    'loose-tenon',
    'blind-mortise-tenon'
  ],

  skillLevel: 'beginner',
  visualComplexity: 1
}


export const POCKET_SCREW: JointDefinition = {
  id: 'pocket-screw',
  name: 'Pocket Screw Joint',
  alternateName: ['Pocket Hole Joint', 'Kreg Joint'],
  category: ['frame', 'case'],

  description: `An angled hole drilled through one piece allows a screw to pull the
joint tight. Fast, strong enough for many applications, and requires minimal skill.
Not a traditional joint but extremely practical for shop furniture, face frames,
and projects where speed matters.`,

  strength: {
    rating: 'good',
    tensile: 'good',
    shear: 'moderate',
    racking: 'moderate',
    notes: `Strength depends on screw threads in end grain (weaker than long grain).
Adequate for face frames, cabinets, and moderate-duty furniture. Not recommended
for chairs or high-stress joints.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Screw length',
        formula: 'Match to material thickness',
        description: '3/4" stock → 1-1/4" screw. 1-1/2" stock → 2-1/2" screw.'
      },
      {
        parameter: 'Pocket hole spacing',
        formula: '6" to 8" for face frames, closer for structural',
        description: 'More screws = stronger but diminishing returns'
      },
      {
        parameter: 'Distance from edge',
        formula: '3/4" minimum to center of pocket',
        description: 'Prevents blow-out at edge'
      }
    ],
    constraints: [
      {
        rule: 'Minimum stock thickness',
        reason: 'Too thin and screw angle causes blow-out',
        minimum: 0.5,
        unit: 'inches'
      }
    ],
    tolerances: [
      {
        fit: 'clamped',
        description: 'Parts held in alignment while screwing',
        clearance: 'N/A - mechanical fastener',
        whenToUse: 'All pocket screw applications'
      }
    ]
  },

  whenToUse: [
    'Face frames for cabinets',
    'Shop furniture and jigs',
    'Joining aprons to table tops',
    'Quick projects where speed matters',
    'When joints will be hidden'
  ],

  whenNotToUse: [
    'Chairs or stools (stress concentration)',
    'Outdoor furniture (screws may rust, holes collect water)',
    'When traditional joinery is expected',
    'Highly visible locations'
  ],

  advantages: [
    'Extremely fast',
    'No clamping required (screw pulls tight)',
    'Minimal skill needed',
    'Strong enough for many applications',
    'Easily disassembled'
  ],

  disadvantages: [
    'Visible pocket holes (usually on back/inside)',
    'Not traditional',
    'Screw into end grain is weaker',
    'Metal fastener may be undesirable'
  ],

  toolOptions: [
    {
      method: 'Pocket hole jig (Kreg, etc.)',
      tools: ['Pocket hole jig', 'Stepped drill bit', 'Square-drive screws', 'Driver'],
      category: 'power-tools',
      timeEstimate: '1-2 min per joint',
      notes: 'Kreg is industry standard. K4 or K5 for occasional use, Foreman for production.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Wrong screw length',
      consequence: 'Too short = weak, too long = pokes through',
      prevention: 'Match screw to jig settings for material thickness',
      fix: 'Remove and use correct screw'
    },
    {
      mistake: 'Parts shift during driving',
      consequence: 'Misaligned joint',
      prevention: 'Clamp parts or use face clamp accessory',
      fix: 'Back out screw, realign, redrive'
    },
    {
      mistake: 'Blow-out at pocket',
      consequence: 'Ragged hole, weakened joint',
      prevention: 'Use sharp bit, don\'t force, back up exit if needed',
      fix: 'Fill with wood filler or plug (cosmetic fix)'
    }
  ],

  relatedJoints: [
    'dowel-joint',
    'biscuit-joint'
  ],

  skillLevel: 'beginner',
  visualComplexity: 1
}


export const BISCUIT_JOINT: JointDefinition = {
  id: 'biscuit-joint',
  name: 'Biscuit Joint',
  alternateName: ['Plate Joint'],
  category: ['edge', 'case', 'frame'],

  description: `Football-shaped compressed wood wafers (biscuits) fit into matching
slots cut by a biscuit joiner. The biscuit swells when glue is applied, creating a
tight joint. Primarily used for alignment in edge joints rather than structural strength.`,

  strength: {
    rating: 'moderate',
    tensile: 'moderate',
    shear: 'moderate',
    racking: 'weak',
    notes: `Biscuits add minimal strength to edge joints—glue alone would be nearly
as strong. Main value is alignment. Not suitable for frame joints under stress.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Biscuit size',
        formula: '#0 (1-7/8"), #10 (2-1/8"), #20 (2-3/8")',
        description: 'Choose size based on stock width. Use largest that fits.',
        example: '3/4" stock → #20 typical'
      },
      {
        parameter: 'Slot depth',
        formula: 'Set by biscuit joiner (matches biscuit)',
        description: 'Typically about 1/2" into each piece'
      },
      {
        parameter: 'Biscuit spacing',
        formula: '4" to 8" apart along joint',
        description: 'More biscuits = better alignment, diminishing strength returns'
      }
    ],
    constraints: [
      {
        rule: 'Minimum stock thickness',
        reason: 'Slot may blow out on thin stock',
        minimum: 0.5,
        unit: 'inches'
      }
    ],
    tolerances: [
      {
        fit: 'slip',
        description: 'Biscuit should drop into slot easily dry',
        clearance: 'Swelling provides final fit',
        whenToUse: 'All biscuit applications'
      }
    ]
  },

  whenToUse: [
    'Edge-to-edge panel glue-ups (alignment aid)',
    'Miter joints (alignment)',
    'Quick case construction',
    'When alignment matters more than strength'
  ],

  whenNotToUse: [
    'Structural frame joints',
    'Anywhere mortise and tenon is appropriate',
    'Very thin stock (under 1/2")',
    'When joint strength is critical'
  ],

  advantages: [
    'Fast and easy',
    'Great for panel alignment',
    'Invisible when assembled',
    'Relatively inexpensive tool'
  ],

  disadvantages: [
    'Minimal strength addition',
    'Requires special tool (biscuit joiner)',
    'Not suitable for structural joints',
    'Biscuits can telegraph through thin stock'
  ],

  toolOptions: [
    {
      method: 'Biscuit joiner',
      tools: ['Biscuit joiner (plate joiner)', 'Biscuits (#0, #10, #20)'],
      category: 'power-tools',
      timeEstimate: '2-5 min per joint',
      notes: 'Purpose-built tool. DeWalt, Makita, Porter-Cable all work well.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Using biscuits for structural strength',
      consequence: 'Joint fails under load',
      prevention: 'Use mortise and tenon for frames and structural joints',
      fix: 'Reinforce with additional joinery'
    },
    {
      mistake: 'Slots misaligned',
      consequence: 'Biscuit doesn\'t fit or joint is skewed',
      prevention: 'Mark reference faces, use joiner fence consistently',
      fix: 'Leave out biscuit in problem slot, add new slot if possible'
    }
  ],

  relatedJoints: [
    'dowel-joint',
    'loose-tenon',
    'spline-joint'
  ],

  skillLevel: 'beginner',
  visualComplexity: 1
}


// =============================================================================
// SPECIALTY JOINTS
// =============================================================================

export const BOX_JOINT: JointDefinition = {
  id: 'box-joint',
  name: 'Box Joint',
  alternateName: ['Finger Joint'],
  category: ['case'],

  description: `Interlocking rectangular fingers, like a simplified dovetail with
straight cuts instead of angled. Easier to cut than dovetails but lacks their
mechanical interlock. Good glue surface makes it strong for boxes and drawers.`,

  strength: {
    rating: 'very-good',
    tensile: 'good',
    shear: 'very-good',
    racking: 'good',
    notes: `Large long-grain glue surface provides good strength. Lacks dovetail's
mechanical lock but compensates with more glue area. Better shear resistance than dovetails.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Finger width',
        formula: 'Typically equal to stock thickness, or 1/4" to 3/8"',
        description: 'Equal-width fingers are traditional. Smaller = more fingers, more glue surface.',
        example: '1/2" stock → 1/4" or 1/2" fingers'
      },
      {
        parameter: 'Finger depth',
        formula: 'Equal to mating stock thickness',
        description: 'Fingers go full depth to meet other piece'
      }
    ],
    constraints: [
      {
        rule: 'Fingers must divide evenly',
        reason: 'Need full finger at top and bottom, even count in between'
      }
    ],
    tolerances: [
      {
        fit: 'friction',
        description: 'Should tap together with mallet',
        clearance: '0.001" to 0.002" undersize',
        whenToUse: 'Standard for box joints'
      }
    ]
  },

  whenToUse: [
    'Boxes and small cases',
    'Drawer construction (simpler than dovetails)',
    'When dovetail skill isn\'t available',
    'Projects where modern/uniform look is desired'
  ],

  whenNotToUse: [
    'When traditional dovetail aesthetic is expected',
    'Where mechanical interlock is critical'
  ],

  advantages: [
    'Easier to cut than dovetails',
    'Large glue surface',
    'Uniform, modern appearance',
    'Easy to jig for table saw'
  ],

  disadvantages: [
    'Lacks dovetail mechanical lock',
    'May appear "machine-made"',
    'Not traditional for fine furniture'
  ],

  toolOptions: [
    {
      method: 'Table saw with box joint jig',
      tools: ['Table saw', 'Dado blade', 'Box joint jig (shop-made or commercial)'],
      category: 'power-tools',
      timeEstimate: '5-10 min per corner',
      notes: 'Fast and consistent. Indexing jig makes spacing automatic.'
    },
    {
      method: 'Router table with jig',
      tools: ['Router table', 'Straight bit', 'Indexing jig'],
      category: 'power-tools',
      timeEstimate: '5-10 min per corner',
      notes: 'Alternative to table saw method.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Indexing pin wrong size',
      consequence: 'Fingers don\'t align, cumulative error',
      prevention: 'Index pin must exactly equal finger width',
      fix: 'Adjust jig, test on scrap'
    },
    {
      mistake: 'Too tight or too loose',
      consequence: 'Assembly difficulty or gaps',
      prevention: 'Test on scrap, sneak up on fit',
      fix: 'Light sanding for too tight, shim for too loose'
    }
  ],

  relatedJoints: [
    'through-dovetail',
    'rabbet-joint',
    'dado-joint'
  ],

  skillLevel: 'intermediate',
  visualComplexity: 3
}


export const SLIDING_DOVETAIL: JointDefinition = {
  id: 'sliding-dovetail',
  name: 'Sliding Dovetail',
  alternateName: ['French Dovetail', 'Housed Dovetail'],
  category: ['case', 'panel'],

  description: `A dovetail-shaped groove (socket) houses a matching dovetail-shaped
tongue. The joint slides together from one end and locks mechanically. Excellent for
shelves, drawer dividers, and joining solid wood panels to cases.`,

  strength: {
    rating: 'very-good',
    tensile: 'excellent',
    shear: 'good',
    racking: 'good',
    notes: `Mechanical interlock resists pulling apart in one direction. Long-grain
glue surface in socket walls. Often glued only at front to allow wood movement.`
  },

  sizing: {
    formulas: [
      {
        parameter: 'Socket depth',
        formula: '1/3 to 1/2 of material thickness',
        description: 'Deeper = stronger but leaves less material in case side',
        example: '3/4" case side → 1/4" to 3/8" socket depth'
      },
      {
        parameter: 'Socket width',
        formula: '1/2 to 3/4 of shelf thickness',
        description: 'Narrower than shelf allows shoulders on shelf piece'
      },
      {
        parameter: 'Dovetail angle',
        formula: '7° to 14° (same as regular dovetails)',
        description: 'More angle = more lock but harder to slide. 9° is common.'
      }
    ],
    constraints: [
      {
        rule: 'Fit must be snug but slidable',
        reason: 'Too tight prevents assembly, too loose is weak'
      },
      {
        rule: 'Taper for long joints',
        reason: 'Full-length tight fit may seize. Taper last few inches only.'
      }
    ],
    tolerances: [
      {
        fit: 'snug',
        description: 'Should slide with firm hand pressure',
        clearance: '0.002" to 0.003" undersize tongue',
        whenToUse: 'Short sockets (under 6")'
      },
      {
        fit: 'tapered',
        description: 'Slightly loose for first portion, snug at end',
        clearance: 'Varies along length',
        whenToUse: 'Long sockets (over 6") to prevent seizing'
      }
    ]
  },

  whenToUse: [
    'Fixed shelves in bookcases/cabinets',
    'Drawer dividers',
    'Breadboard ends (with special provisions for movement)',
    'Attaching solid wood tops to cases'
  ],

  whenNotToUse: [
    'When adjustable shelves are needed',
    'Cross-grain situations without movement provisions',
    'Very long joints (friction makes assembly difficult)'
  ],

  advantages: [
    'Strong mechanical interlock',
    'Self-supporting (shelf holds itself)',
    'No visible fasteners',
    'Resists shelf sag'
  ],

  disadvantages: [
    'Must fit precisely (hard to adjust)',
    'Long joints difficult to assemble',
    'Cross-grain issues if not designed for movement',
    'Requires router or specialized plane'
  ],

  toolOptions: [
    {
      method: 'Router with dovetail bit',
      tools: ['Router (handheld with guide or table)', 'Dovetail bit', 'Straight edge/fence'],
      category: 'power-tools',
      timeEstimate: '10-15 min per joint',
      notes: 'Most common method. Cut socket first, then fit tongue to socket.'
    },
    {
      method: 'Hand plane (dovetail plane)',
      tools: ['Dovetail plane or moving fillister', 'Chisel', 'Router plane'],
      category: 'hand-tools',
      timeEstimate: '30-45 min per joint',
      notes: 'Traditional but slow. Rarely done today except for authenticity.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Joint seizes halfway',
      consequence: 'Can\'t complete assembly, can\'t remove',
      prevention: 'Fit must slide freely until final few inches. Wax helps.',
      fix: 'May need to carefully chisel apart (high damage risk)'
    },
    {
      mistake: 'Socket depth varies',
      consequence: 'Shelf not flat, gaps',
      prevention: 'Use guide/fence, maintain consistent depth',
      fix: 'Shim low spots with veneer'
    },
    {
      mistake: 'Cross-grain without movement allowance',
      consequence: 'Case sides split as shelf expands/contracts',
      prevention: 'Glue only front 2-3", let back float',
      fix: 'May need to cut relief, re-engineer joint'
    }
  ],

  relatedJoints: [
    'dado-joint',
    'through-dovetail',
    'half-blind-dovetail'
  ],

  skillLevel: 'intermediate',
  visualComplexity: 3
}


// =============================================================================
// TOP ATTACHMENT METHODS
// =============================================================================

export const BUTTON_ATTACHMENT: JointDefinition = {
  id: 'button-attachment',
  name: 'Wooden Buttons',
  alternateName: ['Table Buttons', 'Desktop Fasteners'],
  category: ['top-attachment'],

  description: `Small wooden blocks with a rabbet (tongue) that fits into a groove
cut in the apron. The button is screwed to the tabletop. This allows the top to
expand and contract with humidity changes while staying securely attached.`,

  strength: {
    rating: 'very-good',
    tensile: 'good',
    shear: 'excellent',
    racking: 'good',
    notes: 'Excellent for holding top flat while allowing movement. Button can break if top moves and button is too tight.'
  },

  sizing: {
    formulas: [
      {
        parameter: 'Button length',
        formula: '1-1/2" to 2" typical',
        description: 'Long enough for screw and groove engagement'
      },
      {
        parameter: 'Button width',
        formula: '1" to 1-1/2" typical',
        description: 'Width provides bearing surface'
      },
      {
        parameter: 'Rabbet depth',
        formula: '3/8" to 1/2"',
        description: 'Creates tongue that hooks into apron groove'
      },
      {
        parameter: 'Groove in apron',
        formula: '3/8" to 1/2" deep, 1/16" wider than tongue',
        description: 'Positioned 1/8" to 1/4" below top of apron'
      },
      {
        parameter: 'Button spacing',
        formula: '10" to 14" apart',
        description: 'Closer = more holding power but more work'
      }
    ],
    constraints: [
      {
        rule: 'Groove must allow movement',
        reason: 'Button slides in groove as top expands/contracts'
      },
      {
        rule: 'Grain direction',
        reason: 'Button grain runs perpendicular to top—allows flex'
      }
    ],
    tolerances: [
      {
        fit: 'slip',
        description: 'Button tongue should slide freely in groove',
        clearance: '1/16" wider than tongue',
        whenToUse: 'All button applications'
      }
    ]
  },

  whenToUse: [
    'Solid wood tabletops',
    'Traditional furniture',
    'Shaker and Arts & Crafts style'
  ],

  whenNotToUse: [
    'Plywood or MDF tops (no movement needed)',
    'When groove in apron is objectionable',
    'Extremely thin aprons'
  ],

  advantages: [
    'Allows wood movement',
    'Traditional, authentic method',
    'Strong attachment',
    'Can be shop-made from scrap'
  ],

  disadvantages: [
    'Requires groove in apron',
    'Time to make buttons',
    'More pieces to manage during assembly'
  ],

  toolOptions: [
    {
      method: 'Table saw + hand work',
      tools: ['Table saw (rabbet cut or dado)', 'Drill', 'Countersink'],
      category: 'hybrid',
      timeEstimate: '2-3 min per button after setup',
      notes: 'Cut rabbet on table saw, drill and countersink, cut to length.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Button too tight in groove',
      consequence: 'Button breaks or restricts top movement',
      prevention: 'Test fit, should slide freely',
      fix: 'Pare tongue thinner or widen groove'
    },
    {
      mistake: 'Screw too long',
      consequence: 'Screw pokes through tabletop',
      prevention: 'Measure carefully, use short #8 screws',
      fix: 'Remove screw, fill hole, use shorter screw'
    }
  ],

  relatedJoints: [
    'figure-8-fastener',
    'elongated-screw-hole',
    'z-clip'
  ],

  skillLevel: 'beginner',
  visualComplexity: 2
}


export const FIGURE_8_FASTENER: JointDefinition = {
  id: 'figure-8-fastener',
  name: 'Figure-8 Fasteners',
  alternateName: ['Desktop Fasteners', 'Table Top Fasteners'],
  category: ['top-attachment'],

  description: `Metal figure-8 shaped hardware with one end recessed into the apron
and one end screwed to the tabletop. The fastener can rotate slightly to accommodate
wood movement. Quick to install but visible hardware.`,

  strength: {
    rating: 'good',
    tensile: 'good',
    shear: 'good',
    racking: 'moderate',
    notes: 'Adequate for most tables. Metal may be stronger than wood buttons.'
  },

  sizing: {
    formulas: [
      {
        parameter: 'Recess depth',
        formula: 'Match fastener thickness (typically 1/8" to 3/16")',
        description: 'Fastener sits flush with apron top'
      },
      {
        parameter: 'Spacing',
        formula: '12" to 18" apart',
        description: 'Similar to button spacing'
      }
    ],
    constraints: [
      {
        rule: 'Apron must be thick enough',
        reason: 'Recess weakens thin apron',
        minimum: 0.625,
        unit: 'inches'
      }
    ],
    tolerances: [
      {
        fit: 'friction',
        description: 'Fastener should fit snugly in recess',
        clearance: 'Match Forstner bit to fastener',
        whenToUse: 'All applications'
      }
    ]
  },

  whenToUse: [
    'Mid-century modern tables',
    'When speed matters',
    'When groove in apron is undesirable',
    'Production furniture'
  ],

  whenNotToUse: [
    'Traditional/period furniture (hardware is anachronistic)',
    'When all-wood construction is desired',
    'Very thin aprons'
  ],

  advantages: [
    'Fast to install',
    'No groove needed',
    'Allows wood movement',
    'Strong and reliable'
  ],

  disadvantages: [
    'Visible metal hardware',
    'Not traditional',
    'Requires Forstner bit recess'
  ],

  toolOptions: [
    {
      method: 'Forstner bit recess',
      tools: ['Drill press or handheld drill', 'Forstner bit (3/4" typical)', 'Screwdriver'],
      category: 'power-tools',
      timeEstimate: '2-3 min per fastener',
      notes: 'Drill recess, insert fastener, screw to apron and top.'
    }
  ],

  commonMistakes: [
    {
      mistake: 'Recess too deep',
      consequence: 'Fastener sits below apron, doesn\'t contact top',
      prevention: 'Use depth stop, match fastener thickness',
      fix: 'Shim under fastener with washer'
    }
  ],

  relatedJoints: [
    'button-attachment',
    'z-clip',
    'elongated-screw-hole'
  ],

  skillLevel: 'beginner',
  visualComplexity: 1
}


// =============================================================================
// JOINT COLLECTION & UTILITIES
// =============================================================================

export const ALL_JOINTS: JointDefinition[] = [
  BLIND_MORTISE_TENON,
  THROUGH_MORTISE_TENON,
  HAUNCHED_MORTISE_TENON,
  LOOSE_TENON,
  THROUGH_DOVETAIL,
  HALF_BLIND_DOVETAIL,
  DOWEL_JOINT,
  POCKET_SCREW,
  BISCUIT_JOINT,
  BOX_JOINT,
  SLIDING_DOVETAIL,
  BUTTON_ATTACHMENT,
  FIGURE_8_FASTENER
]

export const JOINTS_BY_ID: Record<string, JointDefinition> = Object.fromEntries(
  ALL_JOINTS.map(joint => [joint.id, joint])
)

export const JOINTS_BY_CATEGORY: Record<JointCategory, JointDefinition[]> = {
  'frame': ALL_JOINTS.filter(j => j.category.includes('frame')),
  'case': ALL_JOINTS.filter(j => j.category.includes('case')),
  'edge': ALL_JOINTS.filter(j => j.category.includes('edge')),
  'panel': ALL_JOINTS.filter(j => j.category.includes('panel')),
  'stretcher': ALL_JOINTS.filter(j => j.category.includes('stretcher')),
  'top-attachment': ALL_JOINTS.filter(j => j.category.includes('top-attachment'))
}


// =============================================================================
// JOINERY CALCULATION HELPERS
// =============================================================================

/**
 * Calculate optimal tenon thickness using rule of thirds
 */
export function calculateTenonThickness(stockThickness: number): number {
  const ideal = stockThickness / 3
  // Round to nearest standard chisel size
  const chiselSizes = [0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75]
  return chiselSizes.reduce((prev, curr) =>
    Math.abs(curr - ideal) < Math.abs(prev - ideal) ? curr : prev
  )
}

/**
 * Calculate mortise depth for blind mortise
 */
export function calculateMortiseDepth(
  mortisedStockThickness: number,
  tenonLengthRatio: number = 0.67
): number {
  const tenonLength = mortisedStockThickness * tenonLengthRatio
  return tenonLength + 0.0625 // Add 1/16" clearance
}

/**
 * Get joint recommendation based on application
 */
export function recommendJoint(
  category: JointCategory,
  skillLevel: SkillLevel = 'intermediate',
  strengthRequired: StrengthRating = 'good'
): JointDefinition[] {
  const candidates = JOINTS_BY_CATEGORY[category]

  const skillOrder: Record<SkillLevel, number> = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3
  }

  const strengthOrder: Record<StrengthRating, number> = {
    'weak': 1,
    'moderate': 2,
    'good': 3,
    'very-good': 4,
    'excellent': 5
  }

  return candidates
    .filter(j => skillOrder[j.skillLevel] <= skillOrder[skillLevel])
    .filter(j => strengthOrder[j.strength.rating] >= strengthOrder[strengthRequired])
    .sort((a, b) => strengthOrder[b.strength.rating] - strengthOrder[a.strength.rating])
}

/**
 * Get explanation for why a joint sizing is what it is
 */
export function explainJointSizing(
  jointId: string,
  parameter: string
): string | null {
  const joint = JOINTS_BY_ID[jointId]
  if (!joint) return null

  const formula = joint.sizing.formulas.find(f =>
    f.parameter.toLowerCase() === parameter.toLowerCase()
  )

  if (!formula) return null

  return `${formula.description}${formula.example ? `\n\nExample: ${formula.example}` : ''}`
}

/**
 * Validate joint parameters against constraints
 */
export interface JointValidationResult {
  valid: boolean
  warnings: string[]
  errors: string[]
}

export function validateJointParams(
  jointId: string,
  params: Record<string, number>
): JointValidationResult {
  const joint = JOINTS_BY_ID[jointId]
  const result: JointValidationResult = {
    valid: true,
    warnings: [],
    errors: []
  }

  if (!joint) {
    result.valid = false
    result.errors.push(`Unknown joint type: ${jointId}`)
    return result
  }

  for (const constraint of joint.sizing.constraints) {
    if (constraint.minimum !== undefined) {
      // Check each param that might relate to this constraint
      for (const [key, value] of Object.entries(params)) {
        if (constraint.rule.toLowerCase().includes(key.toLowerCase())) {
          if (value < constraint.minimum) {
            result.warnings.push(
              `${key} (${value}") is below recommended minimum (${constraint.minimum}"). ` +
              `Reason: ${constraint.reason}`
            )
          }
        }
      }
    }

    if (constraint.maximum !== undefined) {
      for (const [key, value] of Object.entries(params)) {
        if (constraint.rule.toLowerCase().includes(key.toLowerCase())) {
          if (value > constraint.maximum) {
            result.warnings.push(
              `${key} (${value}") exceeds recommended maximum (${constraint.maximum}"). ` +
              `Reason: ${constraint.reason}`
            )
          }
        }
      }
    }
  }

  return result
}
