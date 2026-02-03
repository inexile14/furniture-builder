/**
 * Parametric Table Builder - Export Panel
 */

import { useState } from 'react'
import { useTable } from '../../context/TableContext'
import { calculateJoinery } from '../../engine/calculations'
import { toFraction, formatBoardFeet } from '../../utils'
import { calculateBoardFeet } from '../../utils/math'
import type { TableParams, CalculatedJoinery } from '../../types'

interface ExportPanelProps {
  onClose: () => void
}

export default function ExportPanel({ onClose }: ExportPanelProps) {
  const { state } = useTable()
  const { params } = state
  const [activeTab, setActiveTab] = useState<'cutlist' | 'joinery' | 'assembly'>('cutlist')

  // Calculate joinery dimensions
  const joinery = calculateJoinery(params)

  // Generate cut list items
  const cutList = generateCutList(params, joinery)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-workshop-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-workshop-800">Build Package</h2>
        <button
          onClick={onClose}
          className="text-workshop-400 hover:text-workshop-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-workshop-200">
        {(['cutlist', 'joinery', 'assembly'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-workshop-700 border-b-2 border-workshop-600'
                : 'text-workshop-400 hover:text-workshop-600'
            }`}
          >
            {tab === 'cutlist' ? 'Cut List' : tab === 'joinery' ? 'Joinery' : 'Assembly'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'cutlist' && (
          <CutListContent cutList={cutList} />
        )}
        {activeTab === 'joinery' && (
          <JoineryContent joinery={joinery} params={params} />
        )}
        {activeTab === 'assembly' && (
          <AssemblyContent params={params} />
        )}
      </div>

      {/* Export Buttons */}
      <div className="p-4 border-t border-workshop-200 space-y-2">
        <button className="btn-primary w-full">
          Download Build Package (ZIP)
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-secondary text-sm">
            PDF Cut List
          </button>
          <button className="btn-secondary text-sm">
            CSV Export
          </button>
        </div>
      </div>
    </div>
  )
}

// Cut List Content
interface CutListItem {
  name: string
  qty: number
  length: number
  width: number
  thickness: number
  material: string
  notes: string
}

function CutListContent({ cutList }: { cutList: CutListItem[] }) {
  const totalBF = cutList.reduce(
    (sum, item) => sum + calculateBoardFeet(item.thickness, item.width, item.length) * item.qty,
    0
  )

  return (
    <div className="space-y-4">
      <div className="text-sm text-workshop-500">
        Total Board Feet: <span className="text-workshop-700 font-medium">{formatBoardFeet(totalBF)}</span>
      </div>

      <div className="space-y-2">
        {cutList.map((item, i) => (
          <div key={i} className="bg-workshop-50 rounded-lg p-3 border border-workshop-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-workshop-800">{item.name}</div>
                <div className="text-xs text-workshop-500 mt-1">
                  {toFraction(item.length)}" × {toFraction(item.width)}" × {toFraction(item.thickness)}"
                </div>
              </div>
              <div className="text-right">
                <div className="text-workshop-700 font-medium">×{item.qty}</div>
                <div className="text-xs text-workshop-500">
                  {formatBoardFeet(calculateBoardFeet(item.thickness, item.width, item.length) * item.qty)}
                </div>
              </div>
            </div>
            {item.notes && (
              <div className="text-xs text-workshop-500 mt-2 border-t border-workshop-200 pt-2">
                {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Joinery Content
function JoineryContent({ joinery, params }: { joinery: CalculatedJoinery; params: TableParams }) {
  return (
    <div className="space-y-4">
      <div className="bg-workshop-50 rounded-lg p-3 border border-workshop-200">
        <h4 className="font-medium text-workshop-800 mb-2">Mortise & Tenon Dimensions</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-workshop-500">Tenon Thickness</div>
            <div className="text-workshop-700 font-mono">{toFraction(joinery.tenonThickness)}"</div>
          </div>
          <div>
            <div className="text-workshop-500">Tenon Width</div>
            <div className="text-workshop-700 font-mono">{toFraction(joinery.tenonWidth)}"</div>
          </div>
          <div>
            <div className="text-workshop-500">Tenon Length</div>
            <div className="text-workshop-700 font-mono">{toFraction(joinery.tenonLength)}"</div>
          </div>
          <div>
            <div className="text-workshop-500">Shoulder Width</div>
            <div className="text-workshop-700 font-mono">{toFraction(joinery.shoulderWidth)}"</div>
          </div>
        </div>
      </div>

      <div className="bg-workshop-50 rounded-lg p-3 border border-workshop-200">
        <h4 className="font-medium text-workshop-800 mb-2">Mortise Dimensions</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-workshop-500">Mortise Width</div>
            <div className="text-workshop-700 font-mono">{toFraction(joinery.mortiseWidth)}"</div>
          </div>
          <div>
            <div className="text-workshop-500">Mortise Height</div>
            <div className="text-workshop-700 font-mono">{toFraction(joinery.mortiseHeight)}"</div>
          </div>
          <div>
            <div className="text-workshop-500">Mortise Depth</div>
            <div className="text-workshop-700 font-mono">{toFraction(joinery.mortiseDepth)}"</div>
          </div>
        </div>
      </div>

      {params.joinery.haunched && (
        <div className="bg-workshop-50 rounded-lg p-3 border border-workshop-200">
          <h4 className="font-medium text-workshop-800 mb-2">Haunch Dimensions</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-workshop-500">Haunch Width</div>
              <div className="text-workshop-700 font-mono">{toFraction(joinery.haunchWidth)}"</div>
            </div>
            <div>
              <div className="text-workshop-500">Haunch Depth</div>
              <div className="text-workshop-700 font-mono">{toFraction(joinery.haunchDepth)}"</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Assembly Content
function AssemblyContent({ params }: { params: TableParams }) {
  const steps = [
    {
      title: 'Mill Leg Stock',
      description: `Mill 4 leg blanks to ${toFraction(params.legs.thickness)}" × ${toFraction(params.legs.thickness)}" × ${toFraction(params.height - params.top.thickness + 1)}" (add 1" for waste).`
    },
    {
      title: 'Cut Mortises',
      description: 'Mark and cut mortises on inside faces of each leg. Use mortising machine or chisel technique.'
    },
    {
      title: 'Mill Apron Stock',
      description: `Mill aprons to ${toFraction(params.aprons.thickness)}" × ${toFraction(params.aprons.height)}" final dimensions.`
    },
    {
      title: 'Cut Tenons',
      description: 'Cut tenons on apron ends. Test fit each joint before glue-up.'
    },
    {
      title: 'Dry Fit Assembly',
      description: 'Assemble without glue to verify all joints fit properly and table is square.'
    },
    {
      title: 'Glue-Up Base',
      description: 'Glue long aprons to legs first, then connect with short aprons. Use clamps and check for square.'
    },
    {
      title: 'Prepare Table Top',
      description: `Glue up top panels and flatten to ${toFraction(params.top.thickness)}" thickness.`
    },
    {
      title: 'Attach Top',
      description: `Install ${params.joinery.topAttachment} fasteners to allow for wood movement.`
    }
  ]

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="bg-workshop-50 rounded-lg p-3 border border-workshop-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-workshop-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div>
              <div className="font-medium text-workshop-800">{step.title}</div>
              <div className="text-sm text-workshop-500 mt-1">{step.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Generate cut list from params
function generateCutList(params: TableParams, joinery: CalculatedJoinery): CutListItem[] {
  const items: CutListItem[] = []
  const legHeight = params.height - params.top.thickness

  // Legs
  items.push({
    name: 'Legs',
    qty: 4,
    length: legHeight,
    width: params.legs.thickness,
    thickness: params.legs.thickness,
    material: params.primaryWood,
    notes: params.legs.style === 'tapered' ? 'Taper inside faces' :
           params.legs.style === 'turned' ? 'Turn after mortising' : ''
  })

  // Aprons
  const longApronLength = params.length - (params.legs.thickness * 2)
  const shortApronLength = params.width - (params.legs.thickness * 2)

  if (params.aprons.sides.front || params.aprons.sides.back) {
    items.push({
      name: 'Long Aprons (Front/Back)',
      qty: (params.aprons.sides.front ? 1 : 0) + (params.aprons.sides.back ? 1 : 0),
      length: longApronLength,
      width: params.aprons.height,
      thickness: params.aprons.thickness,
      material: params.primaryWood,
      notes: `Tenons: ${toFraction(joinery.tenonLength)}" long`
    })
  }

  if (params.aprons.sides.left || params.aprons.sides.right) {
    items.push({
      name: 'Short Aprons (Sides)',
      qty: (params.aprons.sides.left ? 1 : 0) + (params.aprons.sides.right ? 1 : 0),
      length: shortApronLength,
      width: params.aprons.height,
      thickness: params.aprons.thickness,
      material: params.primaryWood,
      notes: `Tenons: ${toFraction(joinery.tenonLength)}" long`
    })
  }

  // Table Top
  items.push({
    name: 'Table Top',
    qty: 1,
    length: params.length,
    width: params.width,
    thickness: params.top.thickness,
    material: params.primaryWood,
    notes: `Edge profile: ${params.top.edgeProfile}`
  })

  return items
}
