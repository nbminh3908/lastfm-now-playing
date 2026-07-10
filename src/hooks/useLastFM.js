import { useState, useEffect, useRef, useCallback } from 'react'

const API_URL = 'https://ws.audioscrobbler.com/2.0/'
const API_KEY = import.meta.env.VITE_LASTFM_API_KEY
const POLL_INTERVAL_MS = 10000

/**
 * Picks the largest available artwork URL from Last.fm's image array,
 * which is ordered small -> extralarge (and sometimes a 'mega' size).
 */
function getBestImage(imageArray) {
  if (!Array.isArray(imageArray) || imageArray.length === 0) return ''
  const preferredOrder = ['mega', 'extralarge', 'large', 'medium', 'small']
  for (const size of preferredOrder) {
    const match = imageArray.find((img) => img.size === size && img['#text'])
    if (match) return match['#text']
  }
  const fallback = imageArray.find((img) => img['#text'])
  return fallback ? fallback['#text'] : ''
}

/**
 * Normalizes a raw Last.fm track object into the shape the UI consumes.
 */
function normalizeTrack(raw) {
  if (!raw) return null
  const nowPlaying = raw['@attr']?.nowplaying === 'true'
  return {
    key: `${raw.mbid || ''}-${raw.name}-${raw.date?.uts || 'now'}`,
    name: raw.name || 'Unknown track',
    artist: raw.artist?.name || raw.artist?.['#text'] || 'Unknown artist',
    album: raw.album?.['#text'] || '',
    url: raw.url || '',
    image: getBestImage(raw.image),
    nowPlaying,
    loved: raw.loved === '1',
    playedAt: raw.date?.uts ? Number(raw.date.uts) : null,
  }
}

/**
 * Returns true if two normalized tracks represent the same "state" so we can
 * skip a state update (and the animations it would trigger) when polling
 * returns identical data.
 */
function tracksAreEqual(a, b) {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.key === b.key &&
    a.nowPlaying === b.nowPlaying &&
    a.loved === b.loved &&
    a.playedAt === b.playedAt
  )
}

function classifyError(err, httpStatus, apiErrorCode) {
  if (!navigator.onLine) {
    return {
      type: 'offline',
      message: "You're offline. Reconnect to keep the dashboard live.",
    }
  }
  if (apiErrorCode === 6) {
    return {
      type: 'invalid-user',
      message: "We couldn't find that Last.fm username.",
    }
  }
  if (apiErrorCode === 10 || apiErrorCode === 26) {
    return {
      type: 'api-key',
      message: 'The Last.fm API key is missing or invalid.',
    }
  }
  if (apiErrorCode === 29 || httpStatus === 429) {
    return {
      type: 'rate-limited',
      message: "Last.fm is rate-limiting us. We'll try again shortly.",
    }
  }
  if (httpStatus && httpStatus >= 500) {
    return {
      type: 'server-error',
      message: 'Last.fm is having trouble right now. Retrying soon.',
    }
  }
  if (err?.name === 'TypeError') {
    // Browsers throw a generic TypeError for DNS/CORS/connection failures.
    return {
      type: 'unknown',
      message: "We couldn't reach Last.fm. Check your connection and try again.",
    }
  }
  return {
    type: 'unknown',
    message: err?.message || 'Something went wrong fetching your scrobbles.',
  }
}

/**
 * Polls Last.fm's user.getrecenttracks endpoint every 10 seconds for the
 * given username and exposes the current/most recent track plus status.
 */
export function useLastFM(username) {
  const [track, setTrack] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error | empty
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const trackRef = useRef(null)
  const abortRef = useRef(null)
  const intervalRef = useRef(null)

  const fetchTracks = useCallback(async () => {
    if (!username) {
      setStatus('idle')
      return
    }
    if (!API_KEY) {
      setStatus('error')
      setError({
        type: 'api-key',
        message:
          'No Last.fm API key found. Add VITE_LASTFM_API_KEY to your .env file.',
      })
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const params = new URLSearchParams({
        method: 'user.getrecenttracks',
        user: username,
        api_key: API_KEY,
        format: 'json',
        limit: '1',
        extended: '1',
      })

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        signal: controller.signal,
      })

      let data
      try {
        data = await response.json()
      } catch (parseErr) {
        throw { httpStatus: response.status, apiErrorCode: null }
      }

      if (data.error) {
        throw { httpStatus: response.status, apiErrorCode: data.error, message: data.message }
      }
      if (!response.ok) {
        throw { httpStatus: response.status, apiErrorCode: null }
      }

      const rawTracks = data.recenttracks?.track
      const rawTrack = Array.isArray(rawTracks) ? rawTracks[0] : rawTracks

      if (!rawTrack) {
        setTrack(null)
        trackRef.current = null
        setStatus('empty')
        setError(null)
        setLastUpdated(new Date())
        return
      }

      const normalized = normalizeTrack(rawTrack)

      if (!tracksAreEqual(trackRef.current, normalized)) {
        trackRef.current = normalized
        setTrack(normalized)
      }
      setStatus('success')
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      if (err?.name === 'AbortError') return
      const classified = classifyError(
        err,
        err?.httpStatus,
        err?.apiErrorCode,
      )
      setStatus('error')
      setError(classified)
    }
  }, [username])

  const refresh = useCallback(() => {
    setStatus((prev) => (prev === 'idle' ? 'loading' : prev))
    fetchTracks()
  }, [fetchTracks])

  useEffect(() => {
    trackRef.current = null
    setTrack(null)
    setError(null)

    if (!username) {
      setStatus('idle')
      return
    }

    setStatus('loading')
    fetchTracks()

    intervalRef.current = setInterval(fetchTracks, POLL_INTERVAL_MS)

    return () => {
      clearInterval(intervalRef.current)
      abortRef.current?.abort()
    }
  }, [username, fetchTracks])

  // Re-fetch immediately whenever the browser regains connectivity.
  useEffect(() => {
    const handleOnline = () => fetchTracks()
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [fetchTracks])

  return { track, status, error, lastUpdated, refresh }
}
