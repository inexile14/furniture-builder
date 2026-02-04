/**
 * Parametric Table Builder - Number Input Component
 */

import { useState, useEffect } from 'react'
import { toFraction } from '../../utils'

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  showFraction?: boolean
}

export default function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.125,
  unit = '',
  showFraction = true
}: NumberInputProps) {
  // Format value consistently (fraction or decimal)
  const formatValue = (v: number) => showFraction ? toFraction(v) : v.toFixed(2)

  const [inputValue, setInputValue] = useState(formatValue(value))
  const [isFocused, setIsFocused] = useState(false)

  // Update input when value prop changes (and not focused)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatValue(value))
    }
  }, [value, isFocused, showFraction])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    setIsFocused(false)
    const parsed = parseFloat(inputValue)
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, min), max)
      const stepped = Math.round(clamped / step) * step
      onChange(stepped)
      setInputValue(formatValue(stepped))
    } else {
      setInputValue(formatValue(value))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newValue = Math.min(value + step, max)
      onChange(newValue)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newValue = Math.max(value - step, min)
      onChange(newValue)
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    onChange(newValue)
  }

  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="flex-1"
        />
        <div className="w-24 flex items-center gap-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-16 input-field text-center text-xs py-1"
          />
          {unit && <span className="text-xs text-workshop-400">{unit}</span>}
        </div>
      </div>
    </div>
  )
}
