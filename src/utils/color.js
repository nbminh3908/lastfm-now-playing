import ColorThief from 'colorthief'

const thief = new ColorThief()

// In-memory cache so we never re-run canvas extraction for the same artwork twice.
const paletteCache = new Map()

/**
 * Converts an [r, g, b] array into a CSS hex string.
 */
export function rgbToHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0'))
      .join('')
  )
}

/**
 * Converts an [r, g, b] array into a CSS rgba() string with the given alpha.
 */
export function rgbToRgba([r, g, b], alpha = 1) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Increases or decreases the perceived lightness of an [r, g, b] color.
 * Used to derive lighter/darker variants for gradients without a full HSL round-trip.
 */
export function adjustLightness([r, g, b], amount) {
  const clamp = (v) => Math.max(0, Math.min(255, v))
  if (amount >= 0) {
    return [
      clamp(r + (255 - r) * amount),
      clamp(g + (255 - g) * amount),
      clamp(b + (255 - b) * amount),
    ].map(Math.round)
  }
  const factor = 1 + amount
  return [r * factor, g * factor, b * factor].map(Math.round)
}

/**
 * Given an [r,g,b], returns whether black or white text would read better on top of it.
 */
export function getReadableTextColor([r, g, b]) {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#0a0a0c' : '#f5f5f7'
}

const FALLBACK_PALETTE = {
  dominant: [124, 92, 252], // accent violet
  palette: [
    [124, 92, 252],
    [251, 113, 133],
    [93, 63, 214],
  ],
}

/**
 * Loads an image (via a CORS-friendly proxy-free crossOrigin request) and extracts
 * its dominant color plus a small palette. Falls back to a static palette on any failure
 * (CORS issues, network errors, decode failures) so the UI never breaks.
 */
export async function extractPalette(imageUrl) {
  if (!imageUrl) return FALLBACK_PALETTE
  if (paletteCache.has(imageUrl)) return paletteCache.get(imageUrl)

  const result = await new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      try {
        const dominant = thief.getColor(img)
        const palette = thief.getPalette(img, 5) || [dominant]
        resolve({ dominant, palette })
      } catch (err) {
        resolve(FALLBACK_PALETTE)
      }
    }
    img.onerror = () => resolve(FALLBACK_PALETTE)
    img.src = imageUrl
    // Safety timeout in case the image hangs indefinitely
    setTimeout(() => resolve(FALLBACK_PALETTE), 4000)
  })

  paletteCache.set(imageUrl, result)
  return result
}
