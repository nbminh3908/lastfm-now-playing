import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, User, ArrowRight } from 'lucide-react'

/**
 * Centered modal for entering or changing the Last.fm username.
 * Forced open (no dismiss option) on first run when no username is stored yet.
 */
function SettingsModal({
  isOpen,
  onClose,
  currentUsername,
  onSave,
  timeFormat = '24h',
  onTimeFormatChange,
  dateFormat = 'long',
  onDateFormatChange,
}) {
  const [value, setValue] = useState(currentUsername || '')
  const [touched, setTouched] = useState(false)
  const inputRef = useRef(null)
  const isForced = !currentUsername

  useEffect(() => {
    if (isOpen) {
      setValue(currentUsername || '')
      setTouched(false)
      // Focus the input shortly after mount so the entrance animation isn't janky.
      const id = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(id)
    }
  }, [isOpen, currentUsername])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isForced) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isForced, onClose])

  const trimmed = value.trim()
  const isValid = trimmed.length > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!isValid) return
    onSave(trimmed)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isForced && onClose()}
            aria-hidden="true"
          />

          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-sm glass-panel gradient-border rounded-3xl p-6 sm:p-8 shadow-glass"
          >
            {!isForced && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors rounded-full p-1"
              >
                <X size={18} />
              </button>
            )}

            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/20 text-accent-soft mb-4">
              <User size={22} aria-hidden="true" />
            </div>

            <h2
              id="settings-modal-title"
              className="text-xl font-display font-semibold text-white mb-1"
            >
              {isForced ? 'Enter your Last.fm username' : 'Change username'}
            </h2>
            <p className="text-sm text-white/50 mb-5 font-body">
              We'll pull your recent scrobbles straight from the Last.fm API.
            </p>

            <label htmlFor="lastfm-username" className="sr-only">
              Last.fm username
            </label>
            <input
              id="lastfm-username"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="e.g. Baooo_"
              autoComplete="off"
              spellCheck="false"
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent-soft focus:ring-2 focus:ring-accent/40 transition-all font-body"
            />
            {touched && !isValid && (
              <p className="text-xs text-loved mt-2" role="alert">
                Enter a username to continue.
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-soft text-white font-medium py-3 transition-colors shadow-glow"
            >
              Save &amp; continue
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-3">
                Clock display
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="time-format" className="sr-only">
                    Time format
                  </label>
                  <select
                    id="time-format"
                    value={timeFormat}
                    onChange={(e) => onTimeFormatChange?.(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-soft focus:ring-2 focus:ring-accent/40 transition-all font-body"
                  >
                    <option className="bg-[#1a1a22]" value="24h">
                      24-hour
                    </option>
                    <option className="bg-[#1a1a22]" value="12h">
                      12-hour (AM/PM)
                    </option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date-format" className="sr-only">
                    Date format
                  </label>
                  <select
                    id="date-format"
                    value={dateFormat}
                    onChange={(e) => onDateFormatChange?.(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-soft focus:ring-2 focus:ring-accent/40 transition-all font-body"
                  >
                    <option className="bg-[#1a1a22]" value="long">
                      Thursday, July 9
                    </option>
                    <option className="bg-[#1a1a22]" value="short">
                      Thu, Jul 9
                    </option>
                    <option className="bg-[#1a1a22]" value="dmy">
                      09/07/2026
                    </option>
                    <option className="bg-[#1a1a22]" value="mdy">
                      07/09/2026
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SettingsModal
