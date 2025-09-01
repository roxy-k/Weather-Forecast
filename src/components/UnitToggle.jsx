import React from 'react'

export default function UnitToggle({ units, onChange }) {
  return (
    <div className="unit-toggle" role="radiogroup" aria-label="Units">
      <button
        className={units === 'metric' ? 'active' : ''}
        onClick={() => onChange('metric')}
        aria-pressed={units === 'metric'}
      >
        °C
      </button>
      <button
        className={units === 'imperial' ? 'active' : ''}
        onClick={() => onChange('imperial')}
        aria-pressed={units === 'imperial'}
      >
        °F
      </button>
    </div>
  )
}
