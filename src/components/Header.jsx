import { motion } from 'framer-motion'
import { Disc3, Settings, Link2 } from 'lucide-react'
import Clock from './Clock'

/**
 * Top bar: app identity + the connected username on the left,
 * the live clock and a settings button on the right.
 */
function Header({ username, onOpenSettings, onCopyLink, timeFormat, dateFormat }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between gap-3 mb-5 px-1 flex-wrap"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl glass-panel shrink-0">
          <Disc3 size={20} className="text-accent-soft animate-spin-slow" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-lg sm:text-xl font-semibold text-white tracking-tight">
            Now Playing
          </h1>
          {username && (
            <button
              type="button"
              onClick={onCopyLink}
              className="group flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors truncate"
              aria-label="Copy Last.fm profile link"
              title="Copy profile link"
            >
              <span className="truncate">@{username}</span>
              <Link2
                size={11}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <Clock timeFormat={timeFormat} dateFormat={dateFormat} />
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open settings"
          title="Settings"
          className="flex items-center justify-center w-10 h-10 rounded-2xl glass-panel text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Settings size={18} aria-hidden="true" />
        </button>
      </div>
    </motion.header>
  )
}

export default Header
