import { memo } from 'react'

const BAR_DELAYS = ['0ms', '160ms', '320ms', '80ms']

/**
 * A small animated equalizer, built with pure CSS keyframes (no GIFs).
 * Bars freeze mid-height when playback stops instead of disappearing abruptly.
 */
function Equalizer({ isPlaying, color = '#7c5cfc', label = 'Now playing' }) {
  return (
    <div
      className="flex items-end gap-[3px] h-4 w-5"
      role="img"
      aria-label={isPlaying ? label : 'Paused'}
    >
      {BAR_DELAYS.map((delay, i) => (
        <span
          key={i}
          className="w-1 rounded-full"
          style={{
            backgroundColor: color,
            height: isPlaying ? undefined : '30%',
            animation: isPlaying ? `eq 0.9s ease-in-out infinite` : 'none',
            animationDelay: delay,
          }}
        />
      ))}
    </div>
  )
}

export default memo(Equalizer)
