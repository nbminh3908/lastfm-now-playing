import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Full-screen backdrop. Uses the current track's artwork, heavily blurred
 * and darkened, with a crossfade + slow zoom whenever the artwork changes.
 * Falls back to an animated gradient (with soft floating blobs) when there
 * is no artwork to show.
 */
function Background({ imageUrl, accentA, accentB }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-base-950">
      <AnimatePresence mode="sync">
        {imageUrl ? (
          <motion.div
            key={imageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-125 animate-zoom-slow"
              style={{ filter: 'blur(60px) brightness(0.55) saturate(1.2)' }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="gradient-fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 animate-border-flow"
              style={{
                backgroundImage: `linear-gradient(120deg, ${accentA} 0%, #08080a 45%, ${accentB} 100%)`,
                backgroundSize: '200% 200%',
              }}
            />
            <div
              className="absolute w-[36rem] h-[36rem] rounded-full blur-3xl opacity-40 animate-float"
              style={{ backgroundColor: accentA, top: '-10%', left: '-10%' }}
            />
            <div
              className="absolute w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30 animate-float-alt"
              style={{ backgroundColor: accentB, bottom: '-15%', right: '-5%' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Darkening overlay to keep foreground text/artwork readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/85" />
    </div>
  )
}

export default memo(Background)
