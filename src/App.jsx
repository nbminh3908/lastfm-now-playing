import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import Background from './components/Background'
import ParticleField from './components/ParticleField'
import Header from './components/Header'
import MusicCard from './components/MusicCard'
import SettingsModal from './components/SettingsModal'
import ToastStack from './components/Toast'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useLastFM } from './hooks/useLastFM'
import {
  extractPalette,
  rgbToHex,
  rgbToRgba,
  adjustLightness,
  ensureContrastOnDark,
  getReadableTextColor,
} from './utils/color'

const DEFAULT_ACCENT = {
  hex: '#7c5cfc',
  hexA: '#7c5cfc',
  hexB: '#fb7185',
  hexC: '#5d3fd6',
  artist: '#a999fd',
  glow: 'rgba(124, 92, 252, 0.55)',
  text: '#f5f5f7',
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
      const displayAccent = ensureContrastOnDark(dominant)
      const artistTone = ensureContrastOnDark(adjustLightness(dominant, 0.22))
      setAccent({
        hex: rgbToHex(displayAccent),
        hexA: rgbToHex(dominant),
        hexB: rgbToHex(secondary),
        hexC: rgbToHex(tertiary),
        artist: rgbToHex(artistTone),
        glow: rgbToRgba(displayAccent, 0.55),
        text: getReadableTextColor(displayAccent),
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
          accentColor={accent.hex}
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

      <a
        href="https://github.com/nbminh3908/lastfm-now-playing"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source code on GitHub"
        title="View source code on GitHub"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 grid h-11 w-11 place-items-center rounded-full glass-panel text-white/60 transition-colors duration-200 hover:text-white hover:bg-white/10 focus-visible:text-white"
      >
        <Github size={21} strokeWidth={1.8} aria-hidden="true" />
      </a>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default App
