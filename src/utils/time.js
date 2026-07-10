/**
 * Formats a Date as a time string using the browser's local time.
 * `format` is either '24h' (e.g. "21:34:16") or '12h' (e.g. "09:34:16 PM").
 */
export function formatClockTime(date, format = '24h') {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: format === '12h',
  })
}

const DATE_FORMAT_OPTIONS = {
  long: { weekday: 'long', month: 'long', day: 'numeric' },
  short: { weekday: 'short', month: 'short', day: 'numeric' },
  dmy: { day: '2-digit', month: '2-digit', year: 'numeric' },
  mdy: { month: '2-digit', day: '2-digit', year: 'numeric' },
}

/**
 * Formats a Date according to the given `format`:
 * - 'long' -> "Thursday, July 9"
 * - 'short' -> "Thu, Jul 9"
 * - 'dmy' -> "09/07/2026"
 * - 'mdy' -> "07/09/2026"
 */
export function formatClockDate(date, format = 'long') {
  if (format === 'dmy') return date.toLocaleDateString('en-GB', DATE_FORMAT_OPTIONS.dmy)
  if (format === 'mdy') return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS.mdy)
  const opts = DATE_FORMAT_OPTIONS[format] || DATE_FORMAT_OPTIONS.long
  return date.toLocaleDateString(undefined, opts)
}

/**
 * Resolves the short timezone abbreviation/offset for the viewer's locale,
 * e.g. "GMT+7" or "PDT", depending on what the browser can resolve.
 */
export function getTimezoneAbbreviation(date) {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZoneName: 'shortOffset',
    }).formatToParts(date)
    const zonePart = parts.find((p) => p.type === 'timeZoneName')
    if (zonePart) return zonePart.value
  } catch (err) {
    // shortOffset isn't supported everywhere; fall through to 'short'
  }
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZoneName: 'short',
    }).formatToParts(date)
    const zonePart = parts.find((p) => p.type === 'timeZoneName')
    if (zonePart) return zonePart.value
  } catch (err) {
    return ''
  }
  return ''
}

/**
 * Returns the IANA timezone name, e.g. "Asia/Ho_Chi_Minh".
 */
export function getTimezoneName() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (err) {
    return ''
  }
}

/**
 * Converts a unix timestamp (seconds) into a friendly relative string,
 * e.g. "3 minutes ago", "just now", "2 days ago".
 */
export function formatRelativeTime(unixSeconds) {
  if (!unixSeconds) return ''
  const now = Date.now()
  const then = unixSeconds * 1000
  const diffSeconds = Math.round((now - then) / 1000)

  if (diffSeconds < 10) return 'just now'
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`

  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  return new Date(then).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Formats an elapsed-seconds count as "mm:ss", used for the live listening timer.
 */
export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}
