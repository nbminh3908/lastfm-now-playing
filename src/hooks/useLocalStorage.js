import { useState, useCallback } from 'react'

/**
 * A useState-compatible hook backed by localStorage.
 * Reads once on mount and writes through on every update.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (err) {
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        try {
          if (resolved === undefined || resolved === null) {
            window.localStorage.removeItem(key)
          } else {
            window.localStorage.setItem(key, JSON.stringify(resolved))
          }
        } catch (err) {
          // localStorage may be unavailable (private browsing, quota exceeded, etc).
          // We silently ignore persistence failures rather than crashing the app.
        }
        return resolved
      })
    },
    [key],
  )

  return [value, setStoredValue]
}
