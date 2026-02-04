/**
 * Parametric Table Builder - Control Panel
 */

import { useState, useEffect, ReactNode } from 'react'
import { useTable } from '../../context/TableContext'
import { STYLE_PRESETS, TABLE_TYPE_LIMITS, WOOD_SPECIES } from '../../constants'
import type { Style, TableType, ChamferEdge } from '../../types'
import NumberInput from './NumberInput'

// =============================================================================
// COLLAPSIBLE SECTION COMPONENT
// =============================================================================

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: () => void
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle
}: CollapsibleSectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)

  // Support both controlled and uncontrolled modes
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const onToggle = controlledOnToggle || (() => setInternalIsOpen(!internalIsOpen))

  return (
    <section className="control-section">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between control-section-title cursor-pointer hover:text-workshop-700 transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 text-workshop-400 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </section>
  )
}

// =============================================================================
// MAIN CONTROL PANEL
// =============================================================================

export default function ControlPanel() {
  const { state, dispatch } = useTable()
  const { params } = state
  const limits = TABLE_TYPE_LIMITS[params.tableType]

  // Track which sections are open (only Style expanded by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    style: true,
    tableType: false,
    dimensions: false,
    top: false,
    legs: false,
    aprons: false,
    stretchers: false,
    material: false
  })

  // Track whether overhang should be kept identical
  const [keepOverhangIdentical, setKeepOverhangIdentical] = useState(
    params.top.overhang.sides === params.top.overhang.ends
  )

  // Sync keepOverhangIdentical when style changes
  useEffect(() => {
    setKeepOverhangIdentical(params.top.overhang.sides === params.top.overhang.ends)
  }, [params.style])

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="p-4 space-y-2">
      {/* Style Selection */}
      <CollapsibleSection
        title="Style"
        isOpen={openSections.style}
        onToggle={() => toggleSection('style')}
      >
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STYLE_PRESETS) as Style[]).map(style => (
            <button
              key={style}
              onClick={() => dispatch({ type: 'SET_STYLE', style })}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-150 ${
                params.style === style
                  ? 'bg-workshop-700 text-white border-workshop-700'
                  : 'bg-workshop-50 text-workshop-700 border-workshop-300 hover:border-workshop-500 hover:bg-workshop-100'
              }`}
            >
              {STYLE_PRESETS[style].displayName}
            </button>
          ))}
        </div>
        {/* Show description for selected style */}
        <p className="text-xs text-workshop-500 mt-2">
          {STYLE_PRESETS[params.style].description}
        </p>
      </CollapsibleSection>

      {/* Table Type */}
      <CollapsibleSection
        title="Table Type"
        isOpen={openSections.tableType}
        onToggle={() => toggleSection('tableType')}
      >
        <select
          value={params.tableType}
          onChange={(e) => dispatch({ type: 'SET_TABLE_TYPE', tableType: e.target.value as TableType })}
          className="input-field"
        >
          <option value="dining">Dining Table</option>
          <option value="console">Console Table</option>
          <option value="end">End Table</option>
          <option value="bedside">Bedside Table</option>
        </select>
      </CollapsibleSection>

      {/* Dimensions */}
      <CollapsibleSection
        title="Dimensions"
        isOpen={openSections.dimensions}
        onToggle={() => toggleSection('dimensions')}
      >
        <div className="space-y-3">
          <NumberInput
            label="Length"
            value={params.length}
            onChange={(v) => dispatch({ type: 'SET_DIMENSION', dimension: 'length', value: v })}
            min={limits.length.min}
            max={limits.length.max}
            step={limits.length.step}
            unit="in"
          />
          <NumberInput
            label="Width"
            value={params.width}
            onChange={(v) => dispatch({ type: 'SET_DIMENSION', dimension: 'width', value: v })}
            min={limits.width.min}
            max={limits.width.max}
            step={limits.width.step}
            unit="in"
          />
          <NumberInput
            label="Height"
            value={params.height}
            onChange={(v) => dispatch({ type: 'SET_DIMENSION', dimension: 'height', value: v })}
            min={limits.height.min}
            max={limits.height.max}
            step={limits.height.step}
            unit="in"
          />
        </div>
      </CollapsibleSection>

      {/* Top Parameters */}
      <CollapsibleSection
        title="Table Top"
        isOpen={openSections.top}
        onToggle={() => toggleSection('top')}
      >
        <div className="space-y-3">
          <NumberInput
            label="Thickness"
            value={params.top.thickness}
            onChange={(v) => dispatch({ type: 'SET_TOP_PARAM', key: 'thickness', value: v })}
            min={0.75}
            max={2}
            step={0.125}
            unit="in"
          />
          {/* Overhang controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="input-label mb-0">Overhang</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="keepOverhangIdentical"
                  checked={keepOverhangIdentical}
                  onChange={(e) => {
                    setKeepOverhangIdentical(e.target.checked)
                    if (e.target.checked) {
                      // Set ends to match sides
                      dispatch({
                        type: 'SET_TOP_PARAM',
                        key: 'overhang',
                        value: { sides: params.top.overhang.sides, ends: params.top.overhang.sides }
                      })
                    }
                  }}
                  className="rounded border-workshop-300 text-workshop-600 focus:ring-workshop-500"
                />
                <label htmlFor="keepOverhangIdentical" className="text-xs text-workshop-500">
                  Keep identical
                </label>
              </div>
            </div>
            <NumberInput
              label="Sides"
              value={params.top.overhang.sides}
              onChange={(v) => {
                dispatch({
                  type: 'SET_TOP_PARAM',
                  key: 'overhang',
                  value: { sides: v, ends: keepOverhangIdentical ? v : params.top.overhang.ends }
                })
              }}
              min={0.5}
              max={4}
              step={0.125}
              unit="in"
            />
            <NumberInput
              label="Ends"
              value={params.top.overhang.ends}
              onChange={(v) => {
                dispatch({
                  type: 'SET_TOP_PARAM',
                  key: 'overhang',
                  value: { sides: keepOverhangIdentical ? v : params.top.overhang.sides, ends: v }
                })
              }}
              min={0.5}
              max={4}
              step={0.125}
              unit="in"
            />
          </div>
          <div>
            <label className="input-label">Edge Profile</label>
            <select
              value={params.top.edgeProfile}
              onChange={(e) => dispatch({ type: 'SET_TOP_PARAM', key: 'edgeProfile', value: e.target.value })}
              className="input-field"
            >
              <option value="square">Square</option>
              <option value="chamfered">Chamfered</option>
              <option value="bullnose">Bullnose</option>
              <option value="ogee">Ogee</option>
            </select>
          </div>

          {/* Chamfer Controls */}
          {params.top.edgeProfile === 'chamfered' && (
            <>
              <div>
                <label className="input-label">Chamfer Location</label>
                <select
                  value={params.top.chamferEdge || 'bottom'}
                  onChange={(e) => dispatch({ type: 'SET_TOP_PARAM', key: 'chamferEdge', value: e.target.value as ChamferEdge })}
                  className="input-field"
                >
                  <option value="bottom">Bottom Edge (under-chamfer)</option>
                  <option value="top">Top Edge</option>
                  <option value="both">Both Edges</option>
                </select>
              </div>
              <NumberInput
                label="Chamfer Size"
                value={params.top.chamferSize || 0.25}
                onChange={(v) => dispatch({ type: 'SET_TOP_PARAM', key: 'chamferSize', value: v })}
                min={0.125}
                max={params.top.thickness}
                step={0.0625}
                unit="in"
              />
              <NumberInput
                label="Chamfer Angle"
                value={params.top.chamferAngle || 45}
                onChange={(v) => dispatch({ type: 'SET_TOP_PARAM', key: 'chamferAngle', value: v })}
                min={30}
                max={60}
                step={5}
                unit="deg"
              />
            </>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="breadboard"
              checked={params.top.breadboardEnds}
              onChange={(e) => dispatch({ type: 'SET_TOP_PARAM', key: 'breadboardEnds', value: e.target.checked })}
              className="rounded border-workshop-300 text-workshop-600 focus:ring-workshop-500"
            />
            <label htmlFor="breadboard" className="text-sm text-workshop-700">
              Breadboard Ends
            </label>
          </div>
        </div>
      </CollapsibleSection>

      {/* Leg Parameters */}
      <CollapsibleSection
        title="Legs"
        isOpen={openSections.legs}
        onToggle={() => toggleSection('legs')}
      >
        <div className="space-y-3">
          {/* Farmhouse has its own leg type selector */}
          {params.style === 'farmhouse' ? (
            <div>
              <label className="input-label">Leg Type</label>
              <select
                value={params.legs.style}
                onChange={(e) => dispatch({ type: 'SET_LEG_PARAM', key: 'style', value: e.target.value })}
                className="input-field"
              >
                <option value="square">Square</option>
                <option value="turned" disabled className="text-workshop-400">Turned (coming soon)</option>
                <option value="ornamental" disabled className="text-workshop-400">Ornamental (coming soon)</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="input-label">Style</label>
              <select
                value={params.legs.style}
                onChange={(e) => dispatch({ type: 'SET_LEG_PARAM', key: 'style', value: e.target.value })}
                className="input-field"
              >
                <option value="square">Square</option>
                <option value="tapered">Tapered</option>
                <option value="turned">Turned</option>
                <option value="splayed">Splayed</option>
              </select>
            </div>
          )}
          <NumberInput
            label="Thickness"
            value={params.legs.thickness}
            onChange={(v) => dispatch({ type: 'SET_LEG_PARAM', key: 'thickness', value: v })}
            min={1.25}
            max={params.style === 'farmhouse' ? 5 : 3}
            step={0.125}
            unit="in"
          />

          {/* Conditional leg parameters based on style */}
          {params.legs.style === 'tapered' && (
            <>
              <NumberInput
                label="Taper End Size"
                value={params.legs.taperEndDimension || 1.125}
                onChange={(v) => dispatch({ type: 'SET_LEG_PARAM', key: 'taperEndDimension', value: v })}
                min={0.75}
                max={params.legs.thickness - 0.25}
                step={0.125}
                unit="in"
              />
              <NumberInput
                label="Taper Starts From Top"
                value={params.legs.taperStartFromTop || 6}
                onChange={(v) => dispatch({ type: 'SET_LEG_PARAM', key: 'taperStartFromTop', value: v })}
                min={4}
                max={10}
                step={0.5}
                unit="in"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="taperInsideOnly"
                  checked={(params.legs.taperSides || 'inside') === 'inside'}
                  onChange={(e) => dispatch({
                    type: 'SET_LEG_PARAM',
                    key: 'taperSides',
                    value: e.target.checked ? 'inside' : 'all'
                  })}
                  className="rounded border-workshop-300 text-workshop-600 focus:ring-workshop-500"
                />
                <label htmlFor="taperInsideOnly" className="text-sm text-workshop-700">
                  Inside faces only (traditional)
                </label>
              </div>
            </>
          )}

          {params.legs.style === 'splayed' && (
            <NumberInput
              label="Splay Angle"
              value={params.legs.splayAngle || 10}
              onChange={(v) => dispatch({ type: 'SET_LEG_PARAM', key: 'splayAngle', value: v })}
              min={5}
              max={15}
              step={1}
              unit="deg"
            />
          )}

          {params.legs.style === 'turned' && (
            <div>
              <label className="input-label">Turn Profile</label>
              <select
                value={params.legs.turnProfile || 'baluster'}
                onChange={(e) => dispatch({ type: 'SET_LEG_PARAM', key: 'turnProfile', value: e.target.value })}
                className="input-field"
              >
                <option value="baluster">Baluster</option>
                <option value="vase">Vase</option>
                <option value="cylinder">Cylinder</option>
                <option value="spool">Spool</option>
              </select>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Apron Parameters */}
      <CollapsibleSection
        title="Aprons"
        isOpen={openSections.aprons}
        onToggle={() => toggleSection('aprons')}
      >
        <div className="space-y-3">
          <NumberInput
            label="Height"
            value={params.aprons.height}
            onChange={(v) => dispatch({ type: 'SET_APRON_PARAM', key: 'height', value: v })}
            min={3}
            max={6}
            step={0.25}
            unit="in"
          />
          <NumberInput
            label="Thickness"
            value={params.aprons.thickness}
            onChange={(v) => dispatch({ type: 'SET_APRON_PARAM', key: 'thickness', value: v })}
            min={0.75}
            max={1}
            step={0.125}
            unit="in"
          />
          <div>
            <label className="input-label">Bottom Profile</label>
            <select
              value={params.aprons.bottomProfile}
              onChange={(e) => dispatch({ type: 'SET_APRON_PARAM', key: 'bottomProfile', value: e.target.value })}
              className="input-field"
            >
              <option value="straight">Straight</option>
              <option value="arched">Arched</option>
              <option value="scalloped">Scalloped</option>
              <option value="serpentine">Serpentine</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Stretchers */}
      <CollapsibleSection
        title="Stretchers"
        isOpen={openSections.stretchers}
        onToggle={() => toggleSection('stretchers')}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="stretchersEnabled"
              checked={params.stretchers.enabled}
              onChange={(e) => dispatch({ type: 'SET_STRETCHER_PARAM', key: 'enabled', value: e.target.checked })}
              className="rounded border-workshop-300 text-workshop-600 focus:ring-workshop-500"
            />
            <label htmlFor="stretchersEnabled" className="text-sm text-workshop-700">
              Include Stretchers
            </label>
          </div>

          {params.stretchers.enabled && (
            <>
              <div>
                <label className="input-label">Configuration</label>
                <select
                  value={params.stretchers.style}
                  onChange={(e) => dispatch({ type: 'SET_STRETCHER_PARAM', key: 'style', value: e.target.value })}
                  className="input-field"
                >
                  <option value="box">Box</option>
                  <option value="H">H-Stretcher</option>
                </select>
              </div>
              <NumberInput
                label={params.stretchers.style === 'box' ? 'Front/Back Height' : 'Height from Floor'}
                value={params.stretchers.heightFromFloor}
                onChange={(v) => dispatch({ type: 'SET_STRETCHER_PARAM', key: 'heightFromFloor', value: v })}
                min={4}
                max={12}
                step={0.5}
                unit="in"
              />
              {/* Side stretcher height option for box style */}
              {params.stretchers.style === 'box' && (
                <NumberInput
                  label="Side Height"
                  value={params.stretchers.sideHeightFromFloor ?? params.stretchers.heightFromFloor}
                  onChange={(v) => dispatch({ type: 'SET_STRETCHER_PARAM', key: 'sideHeightFromFloor', value: v })}
                  min={4}
                  max={14}
                  step={0.5}
                  unit="in"
                />
              )}
              <NumberInput
                label="Stretcher Height"
                value={params.stretchers.width}
                onChange={(v) => dispatch({ type: 'SET_STRETCHER_PARAM', key: 'width', value: v })}
                min={1}
                max={4}
                step={0.25}
                unit="in"
              />
              <NumberInput
                label="Stretcher Thickness"
                value={params.stretchers.thickness}
                onChange={(v) => dispatch({ type: 'SET_STRETCHER_PARAM', key: 'thickness', value: v })}
                min={0.75}
                max={2}
                step={0.125}
                unit="in"
              />
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Material */}
      <CollapsibleSection
        title="Material"
        isOpen={openSections.material}
        onToggle={() => toggleSection('material')}
      >
        <select
          value={params.primaryWood}
          onChange={(e) => dispatch({ type: 'SET_PARAMS', params: { primaryWood: e.target.value } })}
          className="input-field"
        >
          {Object.entries(WOOD_SPECIES).map(([key, species]) => (
            <option key={key} value={key}>
              {species.displayName}
            </option>
          ))}
        </select>
      </CollapsibleSection>
    </div>
  )
}
