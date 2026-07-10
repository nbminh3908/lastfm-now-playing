import { useClock } from '../hooks/useClock'
import {
  formatClockTime,
  formatClockDate,
  getTimezoneAbbreviation,
} from '../utils/time'

/**
 * Displays the viewer's local time, updated every second, plus the date
 * and their timezone abbreviation (auto-detected from the browser).
 * `timeFormat` ('24h' | '12h') and `dateFormat` ('long' | 'short' | 'dmy' | 'mdy')
 * control how the two lines are rendered.
 */
function Clock({ timeFormat = '24h', dateFormat = 'long' }) {
  const now = useClock()

  return (
    <div className="text-right leading-tight select-none">
      <div
        className="font-mono text-xl sm:text-2xl tracking-tight tabular-nums text-white"
        aria-live="off"
      >
        {formatClockTime(now, timeFormat)}
      </div>
      <div className="text-xs text-white/50 font-body">
        {formatClockDate(now, dateFormat)} · {getTimezoneAbbreviation(now)}
      </div>
    </div>
  )
}

export default Clock
