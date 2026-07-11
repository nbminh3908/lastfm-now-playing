# Last.fm Now Playing

![tech](https://img.shields.io/badge/React-19-149eca) ![tech](https://img.shields.io/badge/Vite-6-646cff) ![tech](https://img.shields.io/badge/Tailwind-3-38bdf8) ![tech](https://img.shields.io/badge/Framer_Motion-11-e10a8e)

## Features

- **Live now-playing card** - album art, track, artist, album, loved status,
  and a relative "last played" time, refreshed every 10 seconds.
- **Dynamic theme** - the accent color, glow, progress states, and gradient
  border are all extracted live from the current album artwork via
  [ColorThief](https://github.com/lokesh/color-thief).
- **Full-bleed animated background** - the current artwork, heavily blurred
  and darkened, crossfades and slowly zooms as tracks change. Falls back to
  an animated gradient with floating blobs when there's no artwork.
- **CSS equalizer** - animated bars appear whenever a track is actively
  playing, built with pure CSS keyframes (no GIFs).
- **Live local clock** - time, date, and auto-detected timezone, ticking
  every second. Format is configurable from Settings: 12h/24h time, and
  long/short/DD-MM-YYYY/MM-DD-YYYY dates - saved to `localStorage`.
- **Robust error handling** - invalid usernames, missing scrobbles, expired
  API keys, rate limits, server errors, and offline states all get their own
  friendly message and retry action.
- **Nice extras** - floating particles, a cursor glow, toast notifications,
  a "copy profile link" button, a rotating album cover that pauses in place,
  a dynamically brightened artist-name color derived from the cover art,
  visible focus rings, and full `prefers-reduced-motion` support.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Get a free Last.fm API key

1. Go to <https://www.last.fm/api/account/create>.
2. Fill in the form (an app name like "Now Playing Dashboard" is enough -
   you don't need a callback URL for this app).
3. Copy the **API key** it gives you.

### 3. Configure your environment

Copy the example env file and paste in your key:

```bash
cp .env.example .env
```

```
VITE_LASTFM_API_KEY=your_api_key_here
```

The key is only ever used client-side to call Last.fm's public API - it is
never sent anywhere else, and the app has no backend of its own.

### 4. Run it

```bash
npm run dev
```

Open the printed local URL, enter any Last.fm username when prompted, and
you're set. Your username is saved to `localStorage`, so it'll be
remembered next time - use the Settings button in the header to change it
or to adjust the clock's time/date format.

## Project structure

```
src/
  components/
    AlbumArt.jsx            Glowing album cover with crossfade
    Background.jsx          Full-screen blurred artwork/gradient fallback
    Clock.jsx               Live local time, date & timezone
    CursorGlow.jsx          Pointer-following ambient glow (extra)
    Equalizer.jsx           CSS-only animated equalizer bars
    Header.jsx              Title, username, clock, settings entry point
    LoadingSkeleton.jsx     Shimmering placeholder while data loads
    MusicCard.jsx           The main card: track info, states, actions
    ParticleField.jsx       Floating ambient particles (extra)
    SettingsModal.jsx       Username entry/change modal
    StatusBadge.jsx         "Now playing" / "Last played …" pill
    Toast.jsx               Toast notification stack (extra)
  hooks/
    useClock.js             1-second ticking clock hook
    useLastFM.js            Polls Last.fm every 10s, normalizes + caches
    useLocalStorage.js      useState synced with localStorage
  utils/
    color.js                ColorThief palette extraction + color helpers
    time.js                 Relative time, clock & duration formatting
  App.jsx
  main.jsx
  index.css
```

## Notes

- All fetching happens client-side directly against
  `https://ws.audioscrobbler.com/2.0/` - there is no server component.
- Album artwork is cached in-memory per URL for color extraction, so
  repeated plays of the same track don't re-run canvas work.
- Built and tested against Node 18+.

## License

MIT - do whatever you'd like with it.
