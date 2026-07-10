import { useState, useEffect } from 'react'

/**
 * Returns the current Date, updated every second.
 * Uses a single interval and cleans up on unmount.
 */
export function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}
