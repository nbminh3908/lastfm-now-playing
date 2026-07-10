import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ExternalLink,
  RefreshCw,
  Heart,
  WifiOff,
  SearchX,
  ServerCrash,
  Hourglass,
  Disc,
  AlertTriangle,
} from 'lucide-react'
import AlbumArt from './AlbumArt'
import Equalizer from './Equalizer'
import StatusBadge from './StatusBadge'
import LoadingSkeleton from './LoadingSkeleton'
import { formatRelativeTime, formatDuration } from '../utils/time'

const ERROR_ICONS = {
  offline: WifiOff,
  'invalid-user': SearchX,
  'rate-limited': Hourglass,
  'server-error': ServerCrash,
  'api-key': AlertTriangle,
  unknown: AlertTriangle,
}

function ErrorState({ error, onRetry, onChangeUsername }) {
  const Icon = ERROR_ICONS[error?.type] || AlertTriangle
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center gap-3 p-10 sm:p-14"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-loved">
        <Icon size={26} aria-hidden="true" />
      </div>
      <p className="text-white/85 font-medium max-w-sm">{error?.message}</p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={onRetry}
          className="rounded-full px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 text-white transition-colors"
        >
          Try again
        </button>
        {error?.type === 'invalid-user' && (
          <button
            onClick={onChangeUsername}
            className="rounded-full px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-soft text-white transition-colors"
          >
            Change username
          </button>
        )}
      </div>
    </motion.div>
  )
}

function EmptyState({ onChangeUsername }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center gap-3 p-10 sm:p-14"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
        <Disc size={26} aria-hidden="true" />
      </div>
      <p className="text-white/85 font-medium">No scrobbles yet</p>
      <p className="text-white/50 text-sm max-w-sm">
        Play something on any Last.fm-connected app and it'll show up here within 10 seconds.
      </p>
      <button
        onClick={onChangeUsername}
        className="mt-1 rounded-full px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 text-white transition-colors"
      >
        Not you? Change username
      </button>
    </motion.div>
  )
}

/**
 * The centerpiece card: artwork, track details, live status and actions.
 * Renders loading / error / empty / success states with smooth transitions.
 */
function MusicCard({
  track,
  status,
  error,
  accent,
  onRefresh,
  onOpenSettings,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const listenStart = useRef(null)
  const currentKey = useRef(null)

  // Track a client-side "listening for" timer. Last.fm doesn't expose a
  // start time for the currently-playing track, so we start our own clock
  // the moment we first observe this particular track as now-playing.
  useEffect(() => {
    if (!track?.nowPlaying) {
      listenStart.current = null
      currentKey.current = null
      setElapsed(0)
      return
    }
    if (currentKey.current !== track.key) {
      currentKey.current = track.key
      listenStart.current = Date.now()
      setElapsed(0)
    }
    const id = setInterval(() => {
      if (listenStart.current) {
        setElapsed(Math.floor((Date.now() - listenStart.current) / 1000))
      }
    }, 1000)
    return () => clearInterval(id)
  }, [track?.key, track?.nowPlaying])

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    onRefresh()
    setTimeout(() => setIsRefreshing(false), 700)
  }, [onRefresh])

  const showSkeleton = status === 'loading' && !track
  const showError = status === 'error'
  const showEmpty = status === 'empty'
  const showTrack = !!track && (status === 'success' || status === 'loading')

  return (
    <motion.section
      layout
      className="relative glass-panel gradient-border rounded-3xl shadow-glass overflow-hidden"
      style={{
        '--accent-a': accent.hexA,
        '--accent-b': accent.hexB,
        '--accent-c': accent.hexC,
      }}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {showSkeleton && <LoadingSkeleton key="skeleton" />}

        {showError && (
          <ErrorState
            error={error}
            onRetry={onRefresh}
            onChangeUsername={onOpenSettings}
          />
        )}

        {showEmpty && <EmptyState onChangeUsername={onOpenSettings} />}

        {showTrack && (
          <motion.div
            key={track.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 p-6 sm:p-8"
          >
            <AlbumArt
              src={track.image}
              alt={`${track.album || track.name} artwork`}
              isPlaying={track.nowPlaying}
              accentGlow={accent.glow}
              size={220}
            />

            <div className="flex-1 min-w-0 w-full text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 flex-wrap">
                <StatusBadge
                  isPlaying={track.nowPlaying}
                  relativeTime={formatRelativeTime(track.playedAt)}
                  accentColor={accent.hex}
                  accentGlow={accent.glow}
                />
                {track.nowPlaying && (
                  <Equalizer isPlaying color={accent.hex} />
                )}
                {track.loved && (
                  <span
                    className="inline-flex items-center gap-1 text-xs text-loved"
                    title="Loved track"
                  >
                    <Heart size={14} fill="currentColor" aria-hidden="true" />
                    Loved
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-tight break-words">
                {track.name}
              </h2>
              <p
                className="text-lg mt-1 font-medium break-words"
                style={{ color: accent.artist || accent.hex }}
              >
                {track.artist}
              </p>
              {track.album && (
                <p className="text-sm text-white/50 mt-1 break-words">
                  {track.album}
                </p>
              )}

              {track.nowPlaying && (
                <p className="text-xs text-white/40 mt-3 font-mono tabular-nums">
                  Listening for {formatDuration(elapsed)}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-5 justify-center sm:justify-start">
                {track.url && (
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white transition-colors shadow-glow"
                    style={{ backgroundColor: accent.hex, '--accent-glow': accent.glow }}
                  >
                    Open on Last.fm
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                )}
                <button
                  onClick={handleRefresh}
                  aria-label="Refresh now"
                  title="Refresh"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
                >
                  <RefreshCw
                    size={16}
                    className={isRefreshing ? 'animate-spin' : ''}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default MusicCard
