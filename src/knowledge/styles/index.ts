/**
 * Furniture Style Knowledge Base
 *
 * Historical and contemporary furniture styles with characteristics,
 * proportions, and design guidance.
 */

export interface FurnitureStyle {
  id: string
  name: string
  alternateName?: string[]

  period: {
    start: number
    end: number | null  // null = ongoing
    peakYears?: string
  }

  origins: string[]
  influences: string[]

  characteristics: {
    overall: string
    lines: ('straight' | 'curved' | 'mixed')[]
    ornamentation: 'minimal' | 'moderate' | 'elaborate'
    construction: string
  }

  proportions: {
    rules: string[]
    ratios?: Record<string, string>
    notes: string
  }

  materials: {
    primaryWoods: string[]
    secondaryWoods: string[]
    hardware: string
    finish: string[]
  }

  joinery: {
    typical: string[]
    characteristic: string
    notes: string
  }

  legs: {
    typical: string[]
    taperStyle?: string
    turningStyle?: string
    notes: string
  }

  tables: {
    topThickness: string
    overhang: string
    apronHeight: string
    stretchers: string
    notes: string
  }

  keyMakers: string[]
  modernAdaptations: string

  designTips: string[]
  commonMistakes: string[]
}

// =============================================================================
// AMERICAN TRADITIONAL STYLES
// =============================================================================

export const SHAKER: FurnitureStyle = {
  id: 'shaker',
  name: 'Shaker',
  alternateName: ['Shaker Simple', 'United Society of Believers'],

  period: {
    start: 1780,
    end: 1920,
    peakYears: '1820-1860'
  },

  origins: ['United States (New England, New York, Kentucky, Ohio)'],
  influences: ['English country furniture', 'Federal style', 'Religious beliefs in simplicity'],

  characteristics: {
    overall: 'Elegant simplicity achieved through perfect proportions and fine craftsmanship, not ornamentation. "Beauty rests on utility." Form follows function with no superfluous elements.',
    lines: ['straight'],
    ornamentation: 'minimal',
    construction: 'Traditional joinery executed with precision. Function and durability prioritized. Made to last generations.'
  },

  proportions: {
    rules: [
      'Visual lightness through careful dimensioning',
      'Legs taper on inside faces only (maintains square appearance from front)',
      'Generous overhang on tabletops (3" sides, up to 6" ends)',
      'Aprons set back from leg faces for shadow line',
      'Golden ratio often guides overall proportions'
    ],
    ratios: {
      'legToHeight': '0.028-0.032 (leg width as fraction of table height)',
      'apronToLeg': 'Apron height typically 80-90% of leg top width',
      'overhangToThickness': 'Overhang 3-4× top thickness'
    },
    notes: 'Shaker makers were master proportionists. Study original pieces—the relationships between parts create visual harmony without decoration.'
  },

  materials: {
    primaryWoods: ['cherry', 'maple', 'pine', 'birch'],
    secondaryWoods: ['pine', 'poplar'],
    hardware: 'Minimal—wooden knobs (turned or faceted), no metal pulls. Simple brass or iron where necessary.',
    finish: ['shellac', 'oil', 'milk paint (colored)', 'varnish']
  },

  joinery: {
    typical: ['blind-mortise-tenon', 'haunched-mortise-tenon', 'dovetail', 'wooden-pegs'],
    characteristic: 'Mortise and tenon throughout. Joints often pegged for additional strength. Through-tenons occasionally used on utility pieces.',
    notes: 'Joinery is hidden but impeccable. The Shakers believed that making something well was a form of worship. Drawers joined with fine dovetails.'
  },

  legs: {
    typical: ['tapered-square', 'turned'],
    taperStyle: 'Two-sided taper on inside faces only. Taper begins 2-4" below apron, tapers to 60-70% of top dimension.',
    notes: 'The inside-only taper is the most distinctive Shaker leg feature. It creates visual lightness while maintaining structural rigidity and a square appearance from the front.'
  },

  tables: {
    topThickness: '3/4" to 7/8" typical, occasionally 1"',
    overhang: '2-3" on sides, 4-6" on ends',
    apronHeight: '3.5" to 4.5" typical',
    stretchers: 'Used when needed for structure (workstands, trestle tables), never decorative',
    notes: 'Tops often attached with buttons to allow movement. Edges may be slightly rounded or have minimal chamfer—never molded profiles.'
  },

  keyMakers: [
    'Brother Thomas Fisher (Canterbury, NH)',
    'Brother Henry Green (Alfred, ME)',
    'Sister Emeline Hart (Mount Lebanon, NY)',
    'Anonymous community craftsmen (the Shaker way)'
  ],

  modernAdaptations: 'Contemporary Shaker maintains the proportions and simplicity but may use modern joinery (Domino, biscuits) and finishes. The style translates well to modern minimalist interiors. Key is restraint—when in doubt, leave it out.',

  designTips: [
    'Study original Shaker pieces—proportions are everything',
    'Taper legs on inside faces only for authentic look',
    'Use wooden knobs, not metal hardware',
    'Keep edges simple—slight roundover or small chamfer maximum',
    'Cherry and maple are most authentic; cherry develops beautiful patina',
    'Milk paint in traditional colors (blue, red, yellow) is period-appropriate',
    'Generous overhang on tabletops creates visual lift',
    'Set apron back 3/16" to 1/4" from leg face for shadow line'
  ],

  commonMistakes: [
    'Four-sided leg taper (should be inside faces only)',
    'Overly thick tops that look heavy',
    'Metal hardware where wood would be appropriate',
    'Adding decorative elements—the style IS the lack of decoration',
    'Insufficient overhang making table look top-heavy',
    'Flush aprons to leg (should be set back for shadow line)'
  ]
}

export const MISSION: FurnitureStyle = {
  id: 'mission',
  name: 'Mission / Arts & Crafts',
  alternateName: ['American Arts & Crafts', 'Craftsman', 'Stickley Style'],

  period: {
    start: 1895,
    end: 1920,
    peakYears: '1900-1916'
  },

  origins: ['United States (primarily New York, Michigan, California)'],
  influences: ['English Arts & Crafts movement', 'William Morris', 'Japanese aesthetics', 'Medieval craft guilds'],

  characteristics: {
    overall: 'Honest expression of construction with exposed joinery as decoration. Celebrating the handmade over machine production. Substantial, masculine forms with strong horizontal lines.',
    lines: ['straight'],
    ornamentation: 'minimal',
    construction: 'Exposed joinery—through-tenons, keyed tenons, expressed corbels. Construction IS the decoration. Heavy, solid forms.'
  },

  proportions: {
    rules: [
      'Heavy, grounded proportions—furniture looks planted',
      'Wide, substantial legs (2.5" to 3" typical for tables)',
      'Low horizontal emphasis',
      'Slats often in groups of odd numbers (3, 5, 7, 11)',
      'Corbels and brackets add visual weight at joints'
    ],
    ratios: {
      'legWidth': '2.5" to 3" for dining tables',
      'slatCount': 'Odd numbers (typically 7-13 per end panel)',
      'slatSpacing': 'Gap equals or is slightly less than slat width'
    },
    notes: 'Mission is about visual weight and substance. Parts should look strong enough to last forever. When in doubt, make it heavier.'
  },

  materials: {
    primaryWoods: ['white-oak', 'red-oak'],
    secondaryWoods: ['oak', 'poplar'],
    hardware: 'Hand-hammered copper or iron. Square-head bolts. Pyramid-head screws.',
    finish: ['fumed oak (ammonia)', 'dark stain', 'shellac', 'lacquer', 'oil']
  },

  joinery: {
    typical: ['through-mortise-tenon', 'keyed-through-tenon', 'wedged-tenon', 'pinned-mortise-tenon'],
    characteristic: 'Exposed through-tenons are the signature. Wedged or keyed through-tenons are both decorative and functional.',
    notes: 'Every joint should look intentional and substantial. Through-tenons should be proud of the surface (1/8" to 1/4"). Keys and wedges are functional and decorative.'
  },

  legs: {
    typical: ['square', 'tapered-square'],
    taperStyle: 'If tapered, very subtle—more of a foot chamfer than true taper',
    notes: 'Legs are substantial—visual weight is key. Chamfered edges (stopped chamfers ending before joinery) add interest. Cloud lift cutout on lower stretchers is authentic Stickley detail.'
  },

  tables: {
    topThickness: '1" to 1.25" typical',
    overhang: '1.5" to 2" typical—less than Shaker',
    apronHeight: '4" to 6" typical',
    stretchers: 'Common—lower stretchers connect legs, often with cloud-lift detail',
    notes: 'Tops are thick and substantial. Breadboard ends are common and appropriate. Through-tenon details at leg-to-apron joints. Corbels under top add visual weight.'
  },

  keyMakers: [
    'Gustav Stickley (Craftsman Workshops)',
    'L. & J.G. Stickley',
    'Charles Limbert',
    'Roycroft community (Elbert Hubbard)',
    'Greene & Greene (California variant)'
  ],

  modernAdaptations: 'Modern Mission often lightens the proportions slightly for contemporary homes. Quartersawn white oak remains essential for authentic look. The exposed joinery aesthetic has influenced much contemporary furniture design.',

  designTips: [
    'Use QUARTERSAWN white oak for authentic ray fleck',
    'Expose through-tenons—they define the style',
    'Fuming with ammonia creates the authentic aged look',
    'Include slats in end panels (odd numbers)',
    'Add corbels under tabletop at legs',
    'Keep hardware hand-hammered looking (copper, iron)',
    'Chamfer edges with stopped chamfers',
    'Lower stretchers with cloud-lift cutout are signature detail'
  ],

  commonMistakes: [
    'Using flat-sawn oak (lacks ray fleck)',
    'Hiding joinery (the opposite of Mission philosophy)',
    'Too-light proportions—Mission should look substantial',
    'Even numbers of slats (odd numbers are traditional)',
    'Shiny brass hardware (should be copper, iron, or wooden)',
    'Staining without fuming—misses the authentic aged look'
  ]
}

export const MID_CENTURY_MODERN: FurnitureStyle = {
  id: 'mid-century-modern',
  name: 'Mid-Century Modern',
  alternateName: ['MCM', 'Danish Modern', 'Scandinavian Modern'],

  period: {
    start: 1945,
    end: 1970,
    peakYears: '1950-1965'
  },

  origins: ['Denmark', 'United States', 'Italy', 'Finland'],
  influences: ['Bauhaus', 'Scandinavian design', 'Post-war optimism', 'New materials (plywood, plastic)'],

  characteristics: {
    overall: 'Organic forms meeting functional design. Clean lines with sculptural elements. Optimistic, forward-looking aesthetic celebrating new materials and manufacturing.',
    lines: ['curved', 'mixed'],
    ornamentation: 'minimal',
    construction: 'Often combines traditional joinery with new techniques. Bent plywood, sculptural solid wood, metal and wood combinations.'
  },

  proportions: {
    rules: [
      'Visual lightness through splayed legs and thin profiles',
      'Low, horizontal orientation',
      'Compound angles create dynamic forms',
      'Floating appearance—furniture seems to hover',
      'Negative space is as important as mass'
    ],
    ratios: {
      'splayAngle': '8° to 15° outward',
      'taperRatio': 'Often 50% reduction (2" to 1")',
      'topProfile': 'Thin edges (under 1") that thicken toward center'
    },
    notes: 'MCM achieves lightness through angles and tapers. The splayed, tapered leg is the signature element—both functional (stability) and aesthetic (dynamic tension).'
  },

  materials: {
    primaryWoods: ['walnut', 'teak', 'rosewood', 'oak'],
    secondaryWoods: ['birch-plywood', 'maple'],
    hardware: 'Minimal—integral wooden pulls, recessed finger pulls, thin brass or aluminum',
    finish: ['oil (teak oil, Danish oil)', 'lacquer', 'satin polyurethane']
  },

  joinery: {
    typical: ['blind-mortise-tenon', 'dowel', 'compound-angle-joinery'],
    characteristic: 'Hidden joinery—seamless appearance. Compound angles at leg-to-apron joints require careful engineering.',
    notes: 'Joinery is invisible—the focus is on form, not construction. Compound angle joints (splayed legs meeting aprons) are technically challenging and require precise geometry.'
  },

  legs: {
    typical: ['splayed-tapered', 'turned-tapered', 'sculptural'],
    taperStyle: 'Dramatic four-sided taper, often from 2"+ at top to 1" at floor. Combined with 10-15° outward splay.',
    notes: 'The leg is the most important element. Splayed AND tapered creates the signature silhouette. Compound angles where legs meet aprons require careful calculation.'
  },

  tables: {
    topThickness: '3/4" to 1" with thin profiled edge',
    overhang: '1" to 1.5" typical',
    apronHeight: '2" to 3" typical—minimal, often eliminated',
    stretchers: 'Rarely used—clean lines preferred',
    notes: 'Tops often have sculpted edges—thin at perimeter, thickening toward center. Some designs eliminate aprons entirely, attaching top directly to legs. Surfboard and boomerang shapes common.'
  },

  keyMakers: [
    'Hans Wegner',
    'Finn Juhl',
    'Arne Jacobsen',
    'Charles & Ray Eames',
    'George Nakashima',
    'Jens Risom',
    'Børge Mogensen'
  ],

  modernAdaptations: 'MCM never went away—it remains the dominant style of contemporary furniture. Modern reproductions range from authentic to inspired-by. Original pieces command high prices; quality reproductions are widely available.',

  designTips: [
    'Walnut is the signature MCM wood',
    'Splay legs outward 10-15° for authentic look',
    'Combine splay with taper for visual lightness',
    'Profile top edges—thin at edge, thicker at center',
    'Minimize or eliminate aprons where possible',
    'Use oil finish to enhance grain',
    'Compound angle joinery is complex—plan carefully',
    'Sculptural forms over applied decoration'
  ],

  commonMistakes: [
    'Legs too vertical (need splay)',
    'Legs too thick (need aggressive taper)',
    'Heavy aprons that contradict the light aesthetic',
    'Standard 90° joinery where compound angles are needed',
    'Wrong wood choice (MCM is primarily walnut/teak)',
    'Ornate hardware (should be minimal or integral)'
  ]
}

// =============================================================================
// OTHER STYLES (abbreviated for space)
// =============================================================================

export const FARMHOUSE: FurnitureStyle = {
  id: 'farmhouse',
  name: 'Farmhouse / Country',
  alternateName: ['Rustic', 'Country French', 'Primitive'],

  period: {
    start: 1700,
    end: null,
    peakYears: '1750-1850 (original), 2010-present (revival)'
  },

  origins: ['Rural Europe', 'Colonial America'],
  influences: ['Necessity', 'Available materials', 'Traditional construction'],

  characteristics: {
    overall: 'Sturdy, practical furniture made from local materials. Celebrates wood character—knots, grain variation, natural edges. Built to last with honest construction.',
    lines: ['straight'],
    ornamentation: 'minimal',
    construction: 'Simple but strong. Through-tenons, breadboard ends, thick tops, substantial legs.'
  },

  proportions: {
    rules: [
      'Heavy, grounded proportions',
      'Thick tops (1.5" to 2"+)',
      'Substantial turned legs',
      'Large overhang',
      'Lower stretchers for strength'
    ],
    notes: 'Farmhouse furniture should look like it could survive another century. Err on the side of heavy.'
  },

  materials: {
    primaryWoods: ['pine', 'oak', 'maple', 'cherry'],
    secondaryWoods: ['pine', 'poplar'],
    hardware: 'Hand-forged iron, wooden knobs',
    finish: ['milk paint', 'oil', 'wax', 'distressed paint']
  },

  joinery: {
    typical: ['through-mortise-tenon', 'breadboard-ends', 'pegged-joints'],
    characteristic: 'Visible, honest construction. Through-tenons and wooden pegs.',
    notes: 'Exposed joinery tells the story of how the piece was made.'
  },

  legs: {
    typical: ['turned', 'square-chamfered', 'tapered'],
    turningStyle: 'Simple country turnings—vase, baluster, pommel',
    notes: 'Legs should look hand-turned. Slight irregularity is authentic.'
  },

  tables: {
    topThickness: '1.5" to 2"+ (thick is better)',
    overhang: '3" to 4" or more',
    apronHeight: '4" to 6"',
    stretchers: 'Common—adds visual weight and structural strength',
    notes: 'Breadboard ends are signature farmhouse. Tops may be planked with visible joints.'
  },

  keyMakers: ['Anonymous country craftsmen', 'Regional traditions'],

  modernAdaptations: 'Modern farmhouse often mixes rustic wood with painted bases, metal accents, or cleaner lines. The "modern farmhouse" aesthetic has broadened significantly.',

  designTips: [
    'Use thick stock for tops (1.5"+ minimum)',
    'Include breadboard ends on tabletops',
    'Consider turned legs with pommel detail',
    'Distressed finish adds authenticity',
    'Wood character (knots, grain) is desirable',
    'Lower stretchers add visual weight'
  ],

  commonMistakes: [
    'Too thin tops',
    'Too refined/perfect finish',
    'Lacking visual weight',
    'No breadboard ends on plank tops',
    'Using MCM-style splayed legs'
  ]
}

export const JAPANDI: FurnitureStyle = {
  id: 'japandi',
  name: 'Japandi',
  alternateName: ['Japanese-Scandinavian', 'Zen Minimal'],

  period: {
    start: 2015,
    end: null,
    peakYears: '2018-present'
  },

  origins: ['Japan', 'Scandinavia', 'Contemporary fusion'],
  influences: ['Wabi-sabi', 'Hygge', 'Minimalism', 'Natural materials'],

  characteristics: {
    overall: 'Fusion of Japanese and Scandinavian aesthetics. Minimalist, natural, calm. Celebrates imperfection (wabi-sabi) and comfort (hygge).',
    lines: ['straight', 'curved'],
    ornamentation: 'minimal',
    construction: 'Clean, simple, with attention to craft. Mix of traditional and contemporary joinery.'
  },

  proportions: {
    rules: [
      'Low, grounded forms (Japanese influence)',
      'Clean lines with subtle curves (Scandinavian)',
      'Negative space is essential',
      'Balanced asymmetry'
    ],
    notes: 'Less is more. Every element should be intentional.'
  },

  materials: {
    primaryWoods: ['white-oak', 'ash', 'maple', 'walnut'],
    secondaryWoods: ['pine', 'plywood'],
    hardware: 'Minimal—hidden or integral',
    finish: ['soap finish', 'whitewash', 'matte oil', 'natural']
  },

  joinery: {
    typical: ['blind-mortise-tenon', 'box-joint', 'half-lap'],
    characteristic: 'Simple, refined joinery. May be hidden or subtly expressed.',
    notes: 'Joinery should be well-executed but not showy.'
  },

  legs: {
    typical: ['square', 'slightly-tapered', 'cylindrical'],
    notes: 'Simple geometry. May be slightly tapered or perfectly straight.'
  },

  tables: {
    topThickness: '3/4" to 1"',
    overhang: '1" to 2"',
    apronHeight: '2" to 3" or eliminated',
    stretchers: 'Box stretchers (lower shelf) common in Japanese style',
    notes: 'Clean lines, natural materials. Box stretcher at floor level is typical of Japanese influence.'
  },

  keyMakers: [
    'Contemporary designers blending traditions',
    'Japanese craft traditions',
    'Scandinavian designers'
  ],

  modernAdaptations: 'Japandi is inherently contemporary—a modern synthesis rather than historical revival.',

  designTips: [
    'Embrace natural wood tones',
    'Consider low forms (Japanese influence)',
    'Use light woods (Scandinavian influence)',
    'Include negative space in design',
    'Slight imperfections are welcome (wabi-sabi)',
    'Box stretchers add function and Japanese aesthetic'
  ],

  commonMistakes: [
    'Too much ornamentation',
    'Too dark/heavy (should feel light and airy)',
    'Cluttered design',
    'Overly perfect/sterile'
  ]
}

// =============================================================================
// COLLECTION & UTILITIES
// =============================================================================

export const ALL_STYLES: FurnitureStyle[] = [
  SHAKER,
  MISSION,
  MID_CENTURY_MODERN,
  FARMHOUSE,
  JAPANDI
]

export const STYLES_BY_ID: Record<string, FurnitureStyle> = Object.fromEntries(
  ALL_STYLES.map(style => [style.id, style])
)

/**
 * Get style recommendation based on preferences
 */
export function recommendStyle(preferences: {
  aesthetic?: 'minimal' | 'traditional' | 'rustic' | 'modern'
  era?: 'historical' | 'mid-century' | 'contemporary'
}): FurnitureStyle[] {
  let candidates = [...ALL_STYLES]

  if (preferences.aesthetic === 'minimal') {
    candidates = candidates.filter(s =>
      s.characteristics.ornamentation === 'minimal'
    )
  }

  if (preferences.aesthetic === 'rustic') {
    candidates = candidates.filter(s =>
      s.id === 'farmhouse' || s.id === 'mission'
    )
  }

  if (preferences.era === 'mid-century') {
    candidates = candidates.filter(s =>
      s.period.start >= 1940 && s.period.start <= 1970
    )
  }

  return candidates
}

/**
 * Get style-appropriate defaults for table parameters
 */
export function getStyleDefaults(styleId: string): Record<string, unknown> | null {
  const style = STYLES_BY_ID[styleId]
  if (!style) return null

  // Return style-appropriate parameter suggestions
  const defaults: Record<string, Record<string, unknown>> = {
    'shaker': {
      legStyle: 'tapered',
      taperSides: 'inside',
      legThickness: 2.5,
      topThickness: 0.875,
      overhangSides: 3,
      overhangEnds: 5,
      apronHeight: 4,
      stretcherStyle: 'none',
      primaryWood: 'cherry'
    },
    'mission': {
      legStyle: 'square',
      legThickness: 2.75,
      topThickness: 1.125,
      overhangSides: 1.5,
      overhangEnds: 1.5,
      apronHeight: 5,
      stretcherStyle: 'box',
      showSlats: true,
      primaryWood: 'white-oak'
    },
    'mid-century-modern': {
      legStyle: 'splayed',
      splayAngle: 12,
      taperSides: 'all',
      legThickness: 2.25,
      legEndDimension: 1.125,
      topThickness: 0.875,
      overhangSides: 1.25,
      overhangEnds: 1.25,
      apronHeight: 2.5,
      stretcherStyle: 'none',
      primaryWood: 'walnut'
    },
    'farmhouse': {
      legStyle: 'turned',
      legThickness: 3.5,
      topThickness: 1.5,
      overhangSides: 4,
      overhangEnds: 6,
      apronHeight: 5,
      stretcherStyle: 'h',
      useBreadboards: true,
      primaryWood: 'pine'
    },
    'japandi': {
      legStyle: 'square',
      legThickness: 2,
      topThickness: 0.875,
      overhangSides: 1.5,
      overhangEnds: 1.5,
      apronHeight: 2.5,
      stretcherStyle: 'box',
      stretcherPosition: 'low',
      primaryWood: 'white-oak'
    }
  }

  return defaults[styleId] || null
}
