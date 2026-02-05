/**
 * Wood Species Knowledge Base
 *
 * Comprehensive properties, characteristics, and guidance for wood species
 * commonly used in furniture making.
 */

export interface WoodSpecies {
  id: string
  commonName: string
  scientificName: string
  family: string
  origin: string[]

  // Physical Properties
  jankaHardness: number  // lbf
  specificGravity: number
  weight: {
    green: number   // lbs per cubic foot
    dried: number   // lbs per cubic foot at 12% MC
  }

  // Movement Properties (critical for furniture design)
  movement: {
    tangential: number  // % per 1% MC change
    radial: number      // % per 1% MC change
    ratio: number       // T/R ratio
    stability: 'excellent' | 'good' | 'moderate' | 'poor'
    notes: string
  }

  // Working Properties
  workability: {
    handTools: 'easy' | 'moderate' | 'difficult'
    machining: 'easy' | 'moderate' | 'difficult'
    gluing: 'easy' | 'moderate' | 'difficult'
    finishing: 'easy' | 'moderate' | 'difficult'
    notes: string
  }

  // Appearance
  appearance: {
    heartwood: string
    sapwood: string
    grain: 'straight' | 'interlocked' | 'wavy' | 'irregular'
    texture: 'fine' | 'medium' | 'coarse'
    figure: string[]  // 'ray fleck', 'curly', 'quilted', etc.
  }

  // Characteristics
  characteristics: string[]
  commonUses: string[]
  similarSpecies: string[]

  // Practical Considerations
  availability: 'common' | 'moderate' | 'limited' | 'rare'
  sustainability: 'sustainable' | 'moderate' | 'concern' | 'endangered'
  priceRange: 'budget' | 'moderate' | 'premium' | 'exotic'

  // Health & Safety
  allergies: {
    severity: 'none' | 'mild' | 'moderate' | 'severe'
    notes: string
  }

  // Furniture Making Notes
  furnitureNotes: string
}

// =============================================================================
// NORTH AMERICAN HARDWOODS
// =============================================================================

export const WHITE_OAK: WoodSpecies = {
  id: 'white-oak',
  commonName: 'White Oak',
  scientificName: 'Quercus alba',
  family: 'Fagaceae',
  origin: ['Eastern North America'],

  jankaHardness: 1360,
  specificGravity: 0.68,
  weight: {
    green: 63,
    dried: 47
  },

  movement: {
    tangential: 0.365,
    radial: 0.163,
    ratio: 2.24,
    stability: 'good',
    notes: 'More stable than red oak. Quartersawn is exceptionally stable and shows ray fleck.'
  },

  workability: {
    handTools: 'moderate',
    machining: 'moderate',
    gluing: 'moderate',
    finishing: 'easy',
    notes: 'Dense but works well with sharp tools. Pre-drill for screws near edges. Takes stain well but may blotch—use pre-stain conditioner or gel stain.'
  },

  appearance: {
    heartwood: 'Light to medium brown, sometimes with olive cast',
    sapwood: 'Nearly white to light brown',
    grain: 'straight',
    texture: 'coarse',
    figure: ['ray fleck (quartersawn)', 'cathedral pattern (flatsawn)']
  },

  characteristics: [
    'Highly rot resistant due to tyloses blocking pores',
    'Distinctive ray fleck on quartersawn surfaces',
    'Reacts with iron (tannic acid) causing black stains',
    'Can be steam bent',
    'Ages to golden amber color'
  ],

  commonUses: [
    'Fine furniture (especially Mission/Arts & Crafts)',
    'Cabinetry',
    'Flooring',
    'Boat building (rot resistance)',
    'Wine and whiskey barrels',
    'Exterior applications'
  ],

  similarSpecies: ['red-oak', 'english-oak', 'bur-oak'],

  availability: 'common',
  sustainability: 'sustainable',
  priceRange: 'moderate',

  allergies: {
    severity: 'mild',
    notes: 'May cause skin/eye irritation and respiratory issues in sensitive individuals. Dust can be irritating.'
  },

  furnitureNotes: `White oak is the quintessential choice for Mission and Arts & Crafts furniture due to its prominent ray fleck when quartersawn. The wood darkens beautifully with age and ammonia fuming. For authentic Mission pieces, use quartersawn stock exclusively. Allow for moderate movement—use buttons or figure-8 fasteners for top attachment. Avoid contact with iron during glue-up (use stainless steel clamps or protect with paper).`
}

export const RED_OAK: WoodSpecies = {
  id: 'red-oak',
  commonName: 'Red Oak',
  scientificName: 'Quercus rubra',
  family: 'Fagaceae',
  origin: ['Eastern North America'],

  jankaHardness: 1290,
  specificGravity: 0.63,
  weight: {
    green: 63,
    dried: 44
  },

  movement: {
    tangential: 0.369,
    radial: 0.158,
    ratio: 2.34,
    stability: 'moderate',
    notes: 'Slightly less stable than white oak. More prone to checking if dried too quickly.'
  },

  workability: {
    handTools: 'moderate',
    machining: 'easy',
    gluing: 'easy',
    finishing: 'moderate',
    notes: 'Open pores require filling for smooth finish. May blotch with stain—use pre-stain conditioner.'
  },

  appearance: {
    heartwood: 'Light to medium reddish brown',
    sapwood: 'Nearly white to light brown',
    grain: 'straight',
    texture: 'coarse',
    figure: ['ray fleck (quartersawn, less prominent than white oak)']
  },

  characteristics: [
    'Open pores (not watertight like white oak)',
    'Pink to red undertones',
    'Less rot resistant than white oak',
    'Very common and economical',
    'Strong and stiff'
  ],

  commonUses: [
    'Furniture',
    'Cabinetry',
    'Flooring',
    'Interior trim',
    'Plywood veneer'
  ],

  similarSpecies: ['white-oak', 'pin-oak', 'black-oak'],

  availability: 'common',
  sustainability: 'sustainable',
  priceRange: 'budget',

  allergies: {
    severity: 'mild',
    notes: 'Similar to white oak. Dust may cause irritation.'
  },

  furnitureNotes: `Red oak is the most common and economical hardwood in North America. It's an excellent choice for painted furniture or when budget matters. For clear finishes, the pink undertones may not suit all projects—consider white oak for warmer, more neutral tones. Fill open pores with paste filler before finishing for a smooth surface.`
}

export const HARD_MAPLE: WoodSpecies = {
  id: 'hard-maple',
  commonName: 'Hard Maple',
  scientificName: 'Acer saccharum',
  family: 'Sapindaceae',
  origin: ['Northeastern North America'],

  jankaHardness: 1450,
  specificGravity: 0.63,
  weight: {
    green: 56,
    dried: 44
  },

  movement: {
    tangential: 0.353,
    radial: 0.165,
    ratio: 2.14,
    stability: 'moderate',
    notes: 'Moderate movement. Seasonal changes can cause drawer sticking in humid climates.'
  },

  workability: {
    handTools: 'difficult',
    machining: 'moderate',
    gluing: 'moderate',
    finishing: 'moderate',
    notes: 'Very hard—dulls tools quickly. Burns easily with router. May blotch with oil-based stain; water-based or dye stain works better.'
  },

  appearance: {
    heartwood: 'Creamy white to light reddish brown',
    sapwood: 'Nearly white (sapwood is preferred)',
    grain: 'straight',
    texture: 'fine',
    figure: ['curly/tiger', 'quilted', "bird's eye", 'spalted']
  },

  characteristics: [
    'One of the hardest domestic woods',
    'Excellent wear resistance',
    'Creamy white color prized',
    'Figured specimens highly valued',
    'Resists denting and abrasion'
  ],

  commonUses: [
    'Fine furniture',
    'Cutting boards and butcher blocks',
    'Flooring (gym floors, bowling alleys)',
    'Musical instruments',
    'Workbench tops'
  ],

  similarSpecies: ['soft-maple', 'european-sycamore'],

  availability: 'common',
  sustainability: 'sustainable',
  priceRange: 'moderate',

  allergies: {
    severity: 'mild',
    notes: 'Generally well tolerated. Dust may cause minor irritation.'
  },

  furnitureNotes: `Hard maple's pale color and fine grain make it ideal for Scandinavian, Shaker, and contemporary furniture. The sapwood (white portion) is typically preferred over heartwood for consistency. Figured maple (curly, quilted, bird's eye) commands premium prices and makes stunning tabletops. For finishing, consider water-based products to preserve the light color—oil-based finishes amber significantly over time.`
}

export const BLACK_WALNUT: WoodSpecies = {
  id: 'black-walnut',
  commonName: 'Black Walnut',
  scientificName: 'Juglans nigra',
  family: 'Juglandaceae',
  origin: ['Eastern North America'],

  jankaHardness: 1010,
  specificGravity: 0.55,
  weight: {
    green: 58,
    dried: 38
  },

  movement: {
    tangential: 0.274,
    radial: 0.190,
    ratio: 1.44,
    stability: 'excellent',
    notes: 'One of the most stable domestic hardwoods. Low T/R ratio means minimal warping.'
  },

  workability: {
    handTools: 'easy',
    machining: 'easy',
    gluing: 'easy',
    finishing: 'easy',
    notes: 'A pleasure to work. Carves beautifully, takes finish exceptionally well. Oily nature may require sealing before water-based finishes.'
  },

  appearance: {
    heartwood: 'Light brown to dark chocolate brown, sometimes with purple hues',
    sapwood: 'Pale yellowish gray (usually removed or steamed)',
    grain: 'straight',
    texture: 'medium',
    figure: ['crotch figure', 'burl', 'curly (rare)']
  },

  characteristics: [
    'Rich, warm brown color',
    'Exceptional stability',
    'Easy to work',
    'Moderately hard but not brittle',
    'Natural luster'
  ],

  commonUses: [
    'Fine furniture',
    'Cabinetry',
    'Gunstocks',
    'Musical instruments',
    'Turning',
    'Carving'
  ],

  similarSpecies: ['claro-walnut', 'english-walnut', 'butternut'],

  availability: 'moderate',
  sustainability: 'sustainable',
  priceRange: 'premium',

  allergies: {
    severity: 'moderate',
    notes: 'Can cause skin irritation and respiratory issues. Sawdust may be sensitizing with repeated exposure.'
  },

  furnitureNotes: `Black walnut is America's premier furniture wood—the only dark-colored domestic hardwood. Its exceptional stability makes it ideal for large tabletops and precision work like drawers. The wood requires minimal finishing to look stunning—a simple oil finish brings out the depth. For contemporary pieces, the contrast between dark heartwood and pale sapwood can be used as a design element. Steamed walnut has more uniform color but loses some depth.`
}

export const CHERRY: WoodSpecies = {
  id: 'cherry',
  commonName: 'American Black Cherry',
  scientificName: 'Prunus serotina',
  family: 'Rosaceae',
  origin: ['Eastern North America'],

  jankaHardness: 950,
  specificGravity: 0.50,
  weight: {
    green: 45,
    dried: 35
  },

  movement: {
    tangential: 0.274,
    radial: 0.125,
    ratio: 2.19,
    stability: 'good',
    notes: 'Relatively stable with good dimensional consistency.'
  },

  workability: {
    handTools: 'easy',
    machining: 'easy',
    gluing: 'easy',
    finishing: 'easy',
    notes: 'One of the best woods to work. Finishes beautifully with minimal effort. Burns easily with dull tools.'
  },

  appearance: {
    heartwood: 'Light pinkish brown when fresh, darkens to medium reddish brown',
    sapwood: 'Pale yellowish (usually excluded from furniture)',
    grain: 'straight',
    texture: 'fine',
    figure: ['curly (rare)', 'crotch figure']
  },

  characteristics: [
    'Darkens significantly with light exposure',
    'Fine, uniform texture',
    'Natural luster',
    'May have gum pockets and mineral streaks',
    'Ages beautifully over decades'
  ],

  commonUses: [
    'Fine furniture (especially Federal and Shaker)',
    'Cabinetry',
    'Millwork',
    'Turning',
    'Musical instruments'
  ],

  similarSpecies: ['european-cherry', 'birch (when stained)'],

  availability: 'common',
  sustainability: 'sustainable',
  priceRange: 'premium',

  allergies: {
    severity: 'mild',
    notes: 'Generally well tolerated. Minor irritation possible.'
  },

  furnitureNotes: `Cherry is the classic American furniture wood, prized for Federal and Shaker pieces. Fresh cherry is disappointingly pink—the magic happens over months and years as it darkens to rich reddish brown. Resist the temptation to stain; let the wood develop naturally or speed the process with UV exposure. For immediate dark color, some makers use lye treatment. Gum pockets and mineral streaks are common and considered character marks in fine furniture. Oil finishes showcase cherry's natural beauty.`
}

export const ASH: WoodSpecies = {
  id: 'ash',
  commonName: 'White Ash',
  scientificName: 'Fraxinus americana',
  family: 'Oleaceae',
  origin: ['Eastern North America'],

  jankaHardness: 1320,
  specificGravity: 0.60,
  weight: {
    green: 48,
    dried: 42
  },

  movement: {
    tangential: 0.274,
    radial: 0.163,
    ratio: 1.68,
    stability: 'good',
    notes: 'Good stability with moderate movement characteristics.'
  },

  workability: {
    handTools: 'moderate',
    machining: 'easy',
    gluing: 'easy',
    finishing: 'moderate',
    notes: 'Machines well but may tear when planing figured grain. Open pores may need filling. Steam bends excellently.'
  },

  appearance: {
    heartwood: 'Light to medium brown',
    sapwood: 'Beige to light brown (wide band)',
    grain: 'straight',
    texture: 'coarse',
    figure: ['cathedral pattern (flatsawn)', 'olive ash (spalted)']
  },

  characteristics: [
    'Excellent shock resistance',
    'Outstanding steam bending',
    'Similar appearance to oak but without ray fleck',
    'Strong and flexible',
    'Wide sapwood band'
  ],

  commonUses: [
    'Furniture',
    'Tool handles',
    'Baseball bats',
    'Steam-bent work (chairs, baskets)',
    'Flooring'
  ],

  similarSpecies: ['red-oak', 'hickory'],

  availability: 'moderate',
  sustainability: 'concern',
  priceRange: 'moderate',

  allergies: {
    severity: 'moderate',
    notes: 'Can cause respiratory sensitization. Good dust collection recommended.'
  },

  furnitureNotes: `Ash is underrated for furniture—it offers the bold grain of oak without the tannin issues and at lower cost. Its exceptional flexibility when steam bent makes it the choice for Windsor chair parts. Note: Emerald ash borer has devastated ash populations; availability may decrease and prices increase. Olive ash (partially spalted) has beautiful dark streaks and is prized for decorative pieces. For light Scandinavian-style furniture, ash is an excellent alternative to oak.`
}

export const POPLAR: WoodSpecies = {
  id: 'poplar',
  commonName: 'Yellow Poplar (Tulipwood)',
  scientificName: 'Liriodendron tulipifera',
  family: 'Magnoliaceae',
  origin: ['Eastern North America'],

  jankaHardness: 540,
  specificGravity: 0.42,
  weight: {
    green: 51,
    dried: 29
  },

  movement: {
    tangential: 0.282,
    radial: 0.156,
    ratio: 1.81,
    stability: 'good',
    notes: 'Stable for a softwood. Good choice for painted work.'
  },

  workability: {
    handTools: 'easy',
    machining: 'easy',
    gluing: 'easy',
    finishing: 'moderate',
    notes: 'Very easy to work. May fuzz when sanded—raise grain with water and re-sand. Takes paint beautifully.'
  },

  appearance: {
    heartwood: 'Light cream to yellowish brown with green/purple streaks',
    sapwood: 'Creamy white',
    grain: 'straight',
    texture: 'medium',
    figure: ['rainbow poplar (mineral streaks)']
  },

  characteristics: [
    'Soft but not weak',
    'Often has green/purple streaks (mineral)',
    'Inexpensive and widely available',
    'Good secondary wood',
    'Takes paint exceptionally well'
  ],

  commonUses: [
    'Painted furniture',
    'Secondary wood (drawer sides, backboards)',
    'Millwork and trim',
    'Plywood core',
    'Economy furniture'
  ],

  similarSpecies: ['basswood', 'soft-maple'],

  availability: 'common',
  sustainability: 'sustainable',
  priceRange: 'budget',

  allergies: {
    severity: 'mild',
    notes: 'Generally well tolerated with minimal issues.'
  },

  furnitureNotes: `Poplar is the workhorse of the furniture shop—inexpensive, stable, and easy to work. It's the traditional choice for painted furniture and secondary applications (drawer sides, dust panels, backboards). The green/purple streaks (rainbow poplar) can be used decoratively or will eventually fade to uniform tan. For painted work, poplar takes primer and paint better than almost any wood. It's also excellent for learning—mistakes are cheap!`
}

// =============================================================================
// IMPORTS & SPECIALTY WOODS
// =============================================================================

export const SAPELE: WoodSpecies = {
  id: 'sapele',
  commonName: 'Sapele',
  scientificName: 'Entandrophragma cylindricum',
  family: 'Meliaceae',
  origin: ['West Africa'],

  jankaHardness: 1410,
  specificGravity: 0.62,
  weight: {
    green: 62,
    dried: 42
  },

  movement: {
    tangential: 0.261,
    radial: 0.181,
    ratio: 1.44,
    stability: 'good',
    notes: 'Good stability. Interlocked grain may cause surface checking if dried too quickly.'
  },

  workability: {
    handTools: 'moderate',
    machining: 'moderate',
    gluing: 'moderate',
    finishing: 'easy',
    notes: 'Interlocked grain tears easily—use very sharp tools and light passes. Finishes to high luster.'
  },

  appearance: {
    heartwood: 'Golden to dark reddish brown',
    sapwood: 'Pale yellowish (narrow)',
    grain: 'interlocked',
    texture: 'medium',
    figure: ['ribbon stripe (quartersawn)', 'pommele', 'quilted']
  },

  characteristics: [
    'Mahogany family with similar appearance',
    'Distinctive ribbon stripe figure',
    'Darkens with age',
    'Strong cedar-like scent when cut',
    'More available than genuine mahogany'
  ],

  commonUses: [
    'Fine furniture',
    'Cabinetry',
    'Musical instruments',
    'Boat building',
    'Architectural millwork'
  ],

  similarSpecies: ['genuine-mahogany', 'utile', 'khaya'],

  availability: 'moderate',
  sustainability: 'moderate',
  priceRange: 'moderate',

  allergies: {
    severity: 'moderate',
    notes: 'Can cause respiratory sensitization. Work in well-ventilated area.'
  },

  furnitureNotes: `Sapele is the practical alternative to increasingly rare genuine mahogany. The ribbon stripe figure on quartersawn surfaces is stunning—each band reflects light differently, creating a three-dimensional effect. For furniture, the interlocked grain can be challenging; plane at a low angle or use a scraper for final surfacing. Sapele ages beautifully, deepening to rich reddish brown over years.`
}

// =============================================================================
// COLLECTION & UTILITIES
// =============================================================================

export const ALL_SPECIES: WoodSpecies[] = [
  WHITE_OAK,
  RED_OAK,
  HARD_MAPLE,
  BLACK_WALNUT,
  CHERRY,
  ASH,
  POPLAR,
  SAPELE,
]

export const SPECIES_BY_ID: Record<string, WoodSpecies> = Object.fromEntries(
  ALL_SPECIES.map(species => [species.id, species])
)

/**
 * Get species recommendations based on criteria
 */
export function recommendSpecies(criteria: {
  stability?: 'excellent' | 'good' | 'moderate' | 'poor'
  hardness?: 'soft' | 'medium' | 'hard'
  priceRange?: 'budget' | 'moderate' | 'premium' | 'exotic'
  finish?: 'paint' | 'clear' | 'stain'
}): WoodSpecies[] {
  let candidates = [...ALL_SPECIES]

  if (criteria.stability) {
    const stabilityOrder = { excellent: 4, good: 3, moderate: 2, poor: 1 }
    candidates = candidates.filter(s =>
      stabilityOrder[s.movement.stability] >= stabilityOrder[criteria.stability!]
    )
  }

  if (criteria.hardness) {
    const ranges = {
      soft: [0, 900],
      medium: [900, 1300],
      hard: [1300, Infinity]
    }
    const [min, max] = ranges[criteria.hardness]
    candidates = candidates.filter(s =>
      s.jankaHardness >= min && s.jankaHardness < max
    )
  }

  if (criteria.priceRange) {
    candidates = candidates.filter(s => s.priceRange === criteria.priceRange)
  }

  if (criteria.finish === 'paint') {
    // Prefer softer, closed-grain woods for paint
    candidates = candidates.filter(s =>
      s.jankaHardness < 1200 && s.appearance.texture !== 'coarse'
    )
  }

  return candidates
}

/**
 * Calculate wood movement for a given width
 */
export function calculateMovement(
  speciesId: string,
  width: number,
  moistureChange: number = 4 // typical seasonal change
): { tangential: number; radial: number } | null {
  const species = SPECIES_BY_ID[speciesId]
  if (!species) return null

  return {
    tangential: width * (species.movement.tangential / 100) * moistureChange,
    radial: width * (species.movement.radial / 100) * moistureChange
  }
}

/**
 * Get species comparison for selection
 */
export function compareSpecies(speciesIds: string[]): string {
  const species = speciesIds.map(id => SPECIES_BY_ID[id]).filter(Boolean)
  if (species.length < 2) return 'Need at least 2 species to compare'

  const comparisons: string[] = []

  // Hardness comparison
  const hardest = species.reduce((a, b) => a.jankaHardness > b.jankaHardness ? a : b)
  const softest = species.reduce((a, b) => a.jankaHardness < b.jankaHardness ? a : b)
  comparisons.push(`Hardness: ${hardest.commonName} (${hardest.jankaHardness}) is hardest, ${softest.commonName} (${softest.jankaHardness}) is softest`)

  // Stability comparison
  const mostStable = species.reduce((a, b) => {
    const order = { excellent: 4, good: 3, moderate: 2, poor: 1 }
    return order[a.movement.stability] > order[b.movement.stability] ? a : b
  })
  comparisons.push(`Stability: ${mostStable.commonName} is most stable (${mostStable.movement.stability})`)

  // Price comparison
  const priceOrder = { budget: 1, moderate: 2, premium: 3, exotic: 4 }
  const cheapest = species.reduce((a, b) =>
    priceOrder[a.priceRange] < priceOrder[b.priceRange] ? a : b
  )
  comparisons.push(`Price: ${cheapest.commonName} is most economical (${cheapest.priceRange})`)

  return comparisons.join('\n')
}
