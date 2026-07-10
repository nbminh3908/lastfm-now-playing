import { useEffect, useRef } from 'react'

/**
 * A soft radial glow that follows the pointer on devices with a mouse.
 * Skipped on touch-only devices and updated via rAF to stay smooth.
 */
function CursorGlow({ color = 'rgba(124, 92, 252, 0.18)' }) {
  const ref = useRef(null)
  const frame = useRef(null)
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return

    const handleMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translate3d(${target.current.x - 200}px, ${target.current.y - 200}px, 0)`
        }
        frame.current = null
      })
    }

    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 -z-10 w-[400px] h-[400px] rounded-full pointer-events-none hidden sm:block"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  )
}

export default CursorGlow
