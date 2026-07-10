import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import Background from './components/Background'
import ParticleField from './components/ParticleField'
import CursorGlow from './components/CursorGlow'
import Header from './components/Header'
import MusicCard from './components/MusicCard'
import SettingsModal from './components/SettingsModal'
import ToastStack from './components/Toast'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useLastFM } from './hooks/useLastFM'
import { extractPalette, rgbToHex, rgbToRgba, adjustLightness } from './utils/color'

const DEFAULT_ACCENT = {
  hex: '#7c5cfc',
  hexA: '#7c5cfc',
  hexB: '#fb7185',
  hexC: '#5d3fd6',
  artist: '#a999fd',
  glow: 'rgba(124, 92, 252, 0.55)',
}

let toastId = 0

function App() {
  const [username, setUsername] = useLocalStorage('lastfm-username', '')
  const [timeFormat, setTimeFormat] = useLocalStorage('lastfm-time-format', '24h')
  const [dateFormat, setDateFormat] = useLocalStorage('lastfm-date-format', 'long')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const [toasts, setToasts] = useState([])

  const { track, status, error, refresh } = useLastFM(username)
  const lastExtractedUrl = useRef(null)

  const pushToast = useCallback((message, tone = 'info') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, tone }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    if (!username) setSettingsOpen(true)
  }, [username])

  useEffect(() => {
    if (!track?.image) {
      setAccent(DEFAULT_ACCENT)
      return
    }
    if (lastExtractedUrl.current === track.image) return
    lastExtractedUrl.current = track.image

    let cancelled = false
    extractPalette(track.image).then(({ dominant, palette }) => {
      if (cancelled) return
      const secondary = palette[1] || adjustLightness(dominant, 0.35)
      const tertiary = palette[2] || adjustLightness(dominant, -0.3)
      const artistTone = adjustLightness(dominant, 0.22)
      setAccent({
        hex: rgbToHex(dominant),
        hexA: rgbToHex(dominant),
        hexB: rgbToHex(secondary),
        hexC: rgbToHex(tertiary),
        artist: rgbToHex(artistTone),
        glow: rgbToRgba(dominant, 0.55),
      })
    })
    return () => {
      cancelled = true
    }
  }, [track?.image])

  const handleSaveUsername = useCallback(
    (next) => {
      const changed = next !== username
      setUsername(next)
      setSettingsOpen(false)
      if (changed) pushToast(`Now tracking @${next}`, 'success')
    },
    [username, setUsername, pushToast],
  )

  const handleCopyLink = useCallback(async () => {
    const link = `https://www.last.fm/user/${username}`
    try {
      await navigator.clipboard.writeText(link)
      pushToast('Profile link copied to clipboard', 'success')
    } catch (err) {
      pushToast('Could not copy the link automatically', 'error')
    }
  }, [username, pushToast])

  const handleRefresh = useCallback(() => {
    refresh()
  }, [refresh])

  const lastErrorType = useRef(null)
  useEffect(() => {
    if (status === 'error' && error && error.type !== lastErrorType.current) {
      lastErrorType.current = error.type
      pushToast(error.message, 'error')
    }
    if (status !== 'error') lastErrorType.current = null
  }, [status, error, pushToast])

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-noise">
      <Background imageUrl={track?.image} accentA={accent.hexA} accentB={accent.hexB} />
      <ParticleField accentColor={accent.hex} />
      <CursorGlow color={rgbToRgba_safe(accent.hex)} />

      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[900px]"
      >
        <Header
          username={username}
          onOpenSettings={() => setSettingsOpen(true)}
          onCopyLink={handleCopyLink}
          timeFormat={timeFormat}
          dateFormat={dateFormat}
        />

        <MusicCard
          track={track}
          status={status}
          error={error}
          accent={accent}
          onRefresh={handleRefresh}
          onOpenSettings={() => setSettingsOpen(true)}
        />

      </motion.main>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUsername={username}
        onSave={handleSaveUsername}
        timeFormat={timeFormat}
        onTimeFormatChange={setTimeFormat}
        dateFormat={dateFormat}
        onDateFormatChange={setDateFormat}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function rgbToRgba_safe(hex) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, 0.18)`
}

export default App
