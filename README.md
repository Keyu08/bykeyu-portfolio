# BY KEYU: portfolio (v2)

A one-page portfolio for Keyu Hu, visual storyteller, content strategist and editor in Montréal.
Plain static site (HTML, CSS, JS modules), no build step. Hosted on Vercel.

## The experience

1. **Opening titles:** "Lights down, friend. Come in." appears word by word (once per visit, click to skip).
2. **Hero:** a grid header, a field of lines that bends around a 3D chibi Keyu who turns to look at the
   pointer, and a giant word cycling *Visual storyteller / Content strategist / Editor*.
3. **Into the eye:** scrolling flies the camera into his left eye; the pupil holds a film.
4. **Work:** the films ride a ring around a drum of giant WORK letters. Scrolling turns both to the left,
   with the letters slower than the films. Press a film to watch it with sound and read its breakdown.
5. Made with, misconceptions, a beat-by-beat breakdown synced to the real audio, method, services,
   the letter (each paragraph lights up as you read), proof, FAQ, and the booking call to action.

People who prefer reduced motion get no opening titles, no scroll animations and a simple grid of films.

## Files

| Path | What it is |
|---|---|
| `index.html` | All copy and sections |
| `css/style.css` | Design: near-black, bone, a touch of sky blue; Anton, Instrument Serif, JetBrains Mono, Inter Tight |
| `js/main.js` | Loader, smooth scroll, hero, work ring, film player, breakdown sync, letter, booking |
| `js/head.js` | The 3D head (Three.js) and the dive into the eye |
| `vendor/` | Three.js r160 and Lenis, served locally |
| `assets/videos/`, `assets/posters/` | The 12 films (8-bit H.264 mp4) and their stills |
| `assets/icons/` | Black and white app-icon versions of the logos |
| `assets/logos/` | Original full-colour logos |
| `assets/data/wave.json` | The real audio waveform of The Art of Asking |

## Everyday edits

- **Booking link:** `CALENDLY_URL` at the top of `js/main.js`. Every "Book a call" opens it in a popup.
- **Films on the ring:** the `FILMS` list at the top of `js/main.js` (id = file name, title, kind,
  aspect `9:16`, `16:9` or `4:3`, optional breakdown notes). Add the matching files to
  `assets/videos/<id>.mp4` and `assets/posters/<id>.jpg`. The ring spaces any number of films evenly.
- **Copy:** everything else is plain text in `index.html`.

## Adding videos

Videos must be **8-bit H.264** so iPhones autoplay them, with a still for the poster:

```bash
ffmpeg -i input.mov -vf "scale=720:-2" -pix_fmt yuv420p -c:v libx264 -profile:v high -crf 28 -preset slow \
  -c:a aac -b:a 128k -movflags +faststart assets/videos/NAME.mp4
ffmpeg -ss 0.6 -i assets/videos/NAME.mp4 -frames:v 1 -vf "scale='min(720,iw)':-2" -q:v 6 assets/posters/NAME.jpg
```

## Preview locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

(Opening `index.html` straight from the disk won't load the 3D head: JS modules need a server.)

## Deploy

Import the repository in Vercel as a static site (no build command, output = root).
`vercel.json` adds security headers and caching; `.vercelignore` keeps this README out of the deploy.
