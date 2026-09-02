# PixiPod Portfolio Reels — Storyboard

**Format:** 1920×1080, 30 fps, five silent 6.5-second loops
**Audio:** none; muted website embeds must remain calm inside the portfolio grid
**Style basis:** `DESIGN.md`
**Motion basis:** GSAP camera travel, CSS 3D depth, radial masks, focus pulls and signal sweeps

## Global Direction

The viewer should feel as if each portfolio card briefly becomes a window into a real working site. Start immediately on a recognizable hero state, build depth through slow camera travel, reveal a second real page state with one intentional transition, then resolve through a short dark seam. Every captured frame stays readable when paused. No captions, fake browser bars or invented product UI.

## Asset Audit

| Asset | Type | Reel | Role |
| --- | --- | --- | --- |
| `capture/groomy/screenshots/scroll-000.png` | Hero capture | GrooMyCRM | Opening full-bleed frame |
| `capture/groomy/screenshots/scroll-020.png` | Product capture | GrooMyCRM | CRM/calendar reveal |
| `capture/trimmy/screenshots/scroll-000.png` | WebGL hero capture | TrimmyCRM | Opening and closing frame |
| `capture/uptime/screenshots/scroll-000.png` | Hero capture | 24Uptime | Monitoring world opener |
| `capture/uptime/screenshots/scroll-032.png` | Analytics capture | 24Uptime | Product proof reveal |
| `capture/bankrot/screenshots/scroll-000.png` | Hero capture | Bankrot.AI | Opening frame |
| `capture/bankrot/screenshots/scroll-018.png` | Product capture | Bankrot.AI | Feature-card reveal |
| `capture/lexsorter/screenshots/scroll-000.png` | Hero capture | Lex-Doc | Opening frame |
| `capture/lexsorter/screenshots/scroll-031.png` | Statement capture | Lex-Doc | “Документы под контролем” reveal |

All selected hero and product captures are used. Captured source logos remain visible inside the screenshots at both the opening and loop return.

## REEL 1 — GrooMyCRM (0:00–0:06.5)

**Concept:** A warm editorial site turns into a living product surface. The camera begins above the oversized hero lettering, then a lime-edged iris opens onto the calendar and colored appointments.

**Visual:** BG is the peach hero. MG is the full screenshot slowly scaling 1.00→1.035 and drifting left 24px. FG is a thin cyan-violet signal line that draws across at the transition. Scene two fills the frame with the calendar capture and settles through slight CSS perspective.

**Choreography:** hero FOCUSES from 7px blur; camera FLOATS toward the headline; signal line DRAWS; product scene OPENS through an off-center circle iris; calendar SETTLES from rotationY 1.5°. Final dark seam DIPS and restores the hero for looping.

**Transition:** 0.62s circle iris at 66% 54%, `power3.out`; 0.45s color dip to `#08090B` at the end.

## REEL 2 — TrimmyCRM (0:00–0:06.5)

**Concept:** The 3D salon behaves like a spatial product demo without fabricating a second screen. The camera glides down the chair corridor, while a cyan-violet scan band briefly reveals a tighter crop of the same real captured scene.

**Visual:** BG is deep green sampled from the site. MG duplicates the hero capture in wide and close crops. FG carries one narrow scanning edge and a quiet dark vignette.

**Choreography:** wide salon frame FOCUSES in; corridor PUSHES forward 1.00→1.07; scan band SWEEPS left to right; close crop SLIDES in through a horizontal clip; close crop BREATHES with a 12px lateral drift. Final deep-green iris contracts before the loop.

**Transition:** directional mask reveal, 0.55s `power2.inOut`; final focus-pull into the opening frame.

## REEL 3 — 24Uptime (0:00–0:06.5)

**Concept:** A monitoring network resolves into measurable proof. The opening map drifts like a command center, then a blue signal sweeps upward and replaces it with real analytics charts.

**Visual:** BG is the dark telemetry hero. MG shows the map and floating panels. Scene two is the light analytics capture with response curve, weekly bars and operational stats. FG is a 3px blue signal line plus a small localized cyan glow.

**Choreography:** telemetry scene SLIDES up 18px from blur; map PUSHES forward; signal line DRAWS bottom-to-top; analytics scene OPENS with a vertical rounded mask and SETTLES from scale .97; charts remain still enough to read. Final blue line wipes back downward.

**Transition:** vertical rounded iris, 0.55s `expo.out`; 0.4s color dip to `#102A43` at loop seam.

## REEL 4 — Bankrot.AI (0:00–0:06.5)

**Concept:** The dark hero moves from institutional positioning to tangible product architecture. A green-blue lens expands behind the central figure and reveals real feature cards.

**Visual:** BG is navy `#080C16`. MG uses the hero capture, then the feature-card capture. FG is a localized radial light and a narrow cyan-violet perimeter trace.

**Choreography:** hero FADES from deep navy while scaling 1.04→1.00; central area HOLDS; lens EXPANDS off-center; feature scene ENTERS from scale .965 and blur 12px; cards remain readable while the camera drifts only 10px. Final mask collapses toward the logo area.

**Transition:** calm circle iris at 51% 45%, 0.72s `sine.inOut`; final 0.45s navy focus pull.

## REEL 5 — Lex-Doc Sorter (0:00–0:06.5)

**Concept:** A dense document system moves from brand promise to a large typographic proof point. Electric blue becomes a precise cutting edge rather than decoration.

**Visual:** BG is `#070A13`. MG is the captured hero with document stack, then the real “Документы под контролем” state. FG is a thin electric-blue vertical edge and a quiet black vignette.

**Choreography:** hero RISES from 22px and focuses; document stack PUSHES closer through scale; blue edge CUTS across; second scene REVEALS with a diagonal clip and settles from x 28px; large statement HOLDS. Final edge reverses and restores the opening frame.

**Transition:** diagonal split, 0.5s `power3.inOut`; final 0.4s color dip to `#070A13`.

## Production Architecture

```text
video-previews/
├── index.html
├── DESIGN.md
├── SCRIPT.md
├── STORYBOARD.md
├── capture/
│   ├── groomy/
│   ├── trimmy/
│   ├── uptime/
│   ├── bankrot/
│   └── lexsorter/
├── compositions/
│   ├── groomy.html
│   ├── trimmy.html
│   ├── uptime.html
│   ├── bankrot.html
│   └── lexsorter.html
└── renders/
```

Step 5 narration artifacts are intentionally omitted because these are muted UI loops embedded in a website, not standalone narrated videos.
