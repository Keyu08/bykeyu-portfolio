# BY KEYU: portfolio (v2)

A one-page portfolio for Keyu Hu, visual storyteller, content strategist and editor in Montréal.
Plain static site (HTML, CSS, plain scripts), no build step. Hosted on Vercel.
Scroll scenes run on GSAP + ScrollTrigger, synced with Lenis smooth scrolling (all vendored locally).

## The experience

1. **Opening titles:** "Lights down, friend. Come in." appears word by word (once per visit, click to skip).
2. **Hero:** a grid header, a field of lines that bends around a 3D chibi Keyu who turns to look at the
   pointer, and a giant word cycling *Visual storyteller / Content strategist / Editor* (one swap at a time on GSAP's clock, sized on a hidden
copy, with a watchdog that puts the word back if a swap ever stalls, so it is never left blank). Above the roles ticker,
   the hero line says who, what and how to act at a glance ("Keyu Hu / Montréal · Short videos for brands. Made for
   Instagram."); below 1280px, where the header's value line is hidden, it adds "Videos people watch to the end"
   and its own "Book a free call" button, and the head centres in the space above it.
3. **Into the eye:** scrolling flies the camera into his left eye; the pupil holds a film.
4. **Work:** the films ride a ring around a drum of giant WORK letters. Scrolling turns both to the left,
   with the letters slower than the films. Press a film to watch it with sound and read its breakdown.
   The two films with real view counts come right after the first one, and the "now playing" line shows
   their views as a sky badge (`views` in `FILMS`).
5. **Clients and partners:** a marquee of the black and white logo tiles (names in small type) that speeds up with the scroll.
6. **Services:** five offers as a bold index; every row shows a "Book a call" tag (on phones too) and opens the booking popup.
   Then what's included and Founding Brand Partners.
7. **Myths:** one pinned scene; each myth gets struck through, and the new truth rises in on the centre line
   as the last one rises out, so the centre line is never empty.
8. **Breakdown:** pinned; scrolling steps through the five beats of The Art of Asking, the video jumps to
   each beat, and the real waveform fills as it plays (press for sound, or jump with the beat markers).
9. **Method:** R H E A C I as a horizontal strip; each letter fills as it passes.
10. **Proof:** VisionnAIre numbers count up once, quickly, as soon as they enter (not scrubbed, never half-counted),
    recognition logos, Nymeris.
11. **The letter:** every word lights up as you read, with a paragraph counter beside it.
12. **FAQ:** five questions up front, the rest behind "More questions", and a link to ask on the call.
13. **Booking:** the end card. The lights come up: a bone section opens out to the full screen with the biggest
    button on the page (the corner button steps aside there).

Every section opens the same way: its label's hairline rule wipes in, then the headline's words rise out of a mask
(mark a section head with `data-enter`, its label as `<p class="label mono"><span>…</span></p>`, the headline words with `data-split`).
After the hero a solid "Book a free call" button stays fixed in the top-right corner, over a dark fade along the top edge
(`.corners::before`) so headlines and text never run under it. "Book a free call ↗" is the one label for every big booking
button (service rows say "Book a call"); the menu's "Contact" (`data-nav`) scrolls to the end card instead of opening the popup.
In the film player the button sits in a bar that stays in view while the notes scroll.

People who prefer reduced motion (or if GSAP fails to load) get no opening titles, no pins or scroll animations,
every section fully visible, and a simple grid of films.

## Files

| Path | What it is |
|---|---|
| `index.html` | All copy and sections |
| `css/style.css` | Design: near-black, bone, a touch of sky blue; Anton, Instrument Serif, JetBrains Mono, Inter Tight |
| `js/main.js` | Smooth scroll, hero, work ring, film player, and every GSAP scroll scene (one block per section), booking |
| `js/head.js` | The 3D head (Three.js) and the dive into the eye |
| `vendor/` | Three.js r160, Lenis, GSAP 3.12.5 + ScrollTrigger (plain scripts), served locally |
| `assets/videos/`, `assets/posters/` | The 12 films (8-bit H.264 mp4) and their stills |
| `assets/icons/` | Black and white app-icon versions of the logos |
| `assets/logos/` | Original full-colour logos |
| `assets/data/wave.json` | The real audio waveform of The Art of Asking |

## Everyday edits

- **Booking link:** `CALENDLY_URL` at the top of `js/main.js`. Every "Book a call" opens it in a popup.
- **Films on the ring:** the `FILMS` list at the top of `js/main.js` (id = file name, title, kind,
  aspect `9:16`, `16:9` or `4:3`, optional breakdown notes). Add the matching files to
  `assets/videos/<id>.mp4` and `assets/posters/<id>.jpg`. The ring spaces any number of films evenly.
- **Copy:** everything else is plain text in `index.html`. Headings marked `data-split` get the word-by-word reveal.
- **Scene lengths:** the scroll length of each pinned scene is its section height in `css/style.css`
  (`.hero`, `.work`, `.motion .myths`, `.motion .bd`); portrait tablets get shorter ones (the `orientation: portrait` block near the end).
  The method strip sizes itself (`len()` in `js/main.js`). They are tuned so each step takes about one flick of the wheel
  (page about 20,200px at 1440x900 and at 768x1024, 21,100px at 390x844).
- **Rhythm:** section padding and headline sizes are tokens at the top of `css/style.css` (`--sec`, `--h-xl`, `--h-l`, `--body-l`).

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

(Opening `index.html` straight from the disk also works; the pupil just shows no film there.)

## Deploy

Import the repository in Vercel as a static site (no build command, output = root).
`vercel.json` adds security headers and caching; `.vercelignore` keeps this README out of the deploy.
