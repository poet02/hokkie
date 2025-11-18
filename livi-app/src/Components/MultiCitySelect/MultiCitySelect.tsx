import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Input, SearchAdress } from '../../Pages/styles'

const CITY_OPTIONS = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
]

export default function MultiCitySelect({
  value,
  onChange,
}: {
  value: string[]
  onChange: (v: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocClick)
    return () => document.removeEventListener('mousedown', handleDocClick)
  }, [])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return CITY_OPTIONS
    return CITY_OPTIONS.filter((c) => c.toLowerCase().includes(q))
  }, [filter])

  function toggleCity(city: string) {
    if (value.includes(city)) onChange(value.filter((c) => c !== city))
    else onChange([...value, city])
  }

  return (
    <div ref={containerRef}>
      <div style={{ position: 'relative' }}>
        {/* small blue clear text above the textbox, aligned to the right */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            onClick={() => {
              onChange([])
              setFilter('')
            }}
            style={{ color: '#1976d2', cursor: 'pointer', fontSize: 11, lineHeight: '12px', textAlign: 'right', marginBottom: 4 }}
          >
            Clear
          </div>
          <div>
            <Input
              placeholder="Search or select cities"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onFocus={() => setOpen(true)}
            />
          </div>

        </div>


        {open && (
          <div
            style={{
              position: 'absolute',
              zIndex: 40,
              top: 44,
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: 8,
              maxHeight: 220,
              overflow: 'auto',
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
            }}
          >
            {filtered.map((city) => (
              <label
                key={city}
                style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 12px', cursor: 'pointer' }}
              >
                <input type="checkbox" checked={value.includes(city)} onChange={() => toggleCity(city)} />
                <span>{city}</span>
              </label>
            ))}
            {filtered.length === 0 && <div style={{ padding: 12, color: '#666' }}>No cities match</div>}
          </div>
        )}
      </div>
    </div>
  )
}
