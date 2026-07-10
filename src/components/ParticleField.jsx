import { useMemo } from 'react'

/**
 * A handful of softly glowing dots drifting across the page.
 * Purely decorative and disabled entirely when reduced motion is preferred
 * (handled globally in index.css via the animation-duration override).
 */
function ParticleField({ accentColor = '#7c5cfc', count = 14 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 6,
        alt: i % 2 === 0,
      })),
    [count],
  )

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={p.alt ? 'animate-float-alt' : 'animate-float'}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: '9999px',
            backgroundColor: accentColor,
            opacity: 0.35,
            filter: 'blur(1px)',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default ParticleField
