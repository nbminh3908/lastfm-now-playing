import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

/**
 * Renders a stack of transient toast notifications, newest at the bottom.
 * `toasts` is an array of { id, message, tone } objects owned by the parent.
 */
function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-[min(90vw,320px)]"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone] || Info
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="glass-panel rounded-xl px-4 py-3 flex items-start gap-2.5 text-sm shadow-glass cursor-pointer"
              onClick={() => onDismiss(toast.id)}
              role="status"
            >
              <Icon size={18} className="mt-0.5 shrink-0 text-accent-soft" aria-hidden="true" />
              <span className="text-white/90">{toast.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default ToastStack
