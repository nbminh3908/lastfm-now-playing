import { motion } from 'framer-motion'
import { Radio, Clock3 } from 'lucide-react'

/**
 * A small pill indicating whether the user is actively listening right now,
 * or showing a friendly "last played" relative time otherwise.
 */
function StatusBadge({ isPlaying, relativeTime, accentColor, accentGlow }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium glass-panel"
      style={{
        color: isPlaying ? accentColor : 'rgba(255,255,255,0.65)',
        '--accent-glow': accentGlow,
      }}
    >
      {isPlaying ? (
        <>
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full animate-pulse-ring"
              style={{ backgroundColor: accentColor }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </span>
          <Radio size={12} aria-hidden="true" />
          <span>Now playing</span>
        </>
      ) : (
        <>
          <Clock3 size={12} aria-hidden="true" />
          <span>Last played {relativeTime}</span>
        </>
      )}
    </motion.div>
  )
}

export default StatusBadge
