import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Music2 } from 'lucide-react'

/**
 * The album cover. Fades/scales in on change, casts a soft accent-colored
 * glow, and spins slowly while the track is actively playing (pausing
 * in-place, rather than snapping back, when playback stops).
 */
function AlbumArt({ src, alt, isPlaying, accentGlow, size = 220 }) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-hidden={false}
    >
      {/* Ambient glow behind the artwork, tinted with the extracted accent color */}
      <div
        className="absolute -inset-4 rounded-full blur-2xl transition-colors duration-700"
        style={{ backgroundColor: accentGlow, opacity: 0.55 }}
      />

      <div
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-glass ring-1 ring-white/10"
      >
        <AnimatePresence mode="wait">
          {src ? (
            <motion.img
              key={src}
              src={src}
              alt={alt}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center bg-base-800"
            >
              <Music2 size={48} className="text-white/30" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default memo(AlbumArt)
