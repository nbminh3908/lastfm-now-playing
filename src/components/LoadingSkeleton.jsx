import { motion } from 'framer-motion'

/**
 * Animated placeholder shown while the first fetch is in flight,
 * mirroring the real MusicCard layout so nothing jumps once data arrives.
 */
function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8"
      aria-busy="true"
      aria-label="Loading your recent scrobble"
    >
      <div className="skeleton w-[220px] h-[220px] rounded-2xl shrink-0" />
      <div className="flex-1 w-full space-y-4 pt-1">
        <div className="skeleton h-5 w-24 rounded-full" />
        <div className="skeleton h-7 w-3/4 rounded-lg" />
        <div className="skeleton h-5 w-1/2 rounded-lg" />
        <div className="skeleton h-5 w-1/3 rounded-lg" />
        <div className="flex gap-3 pt-4">
          <div className="skeleton h-10 w-32 rounded-full" />
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton h-10 w-10 rounded-full" />
        </div>
      </div>
    </motion.div>
  )
}

export default LoadingSkeleton
