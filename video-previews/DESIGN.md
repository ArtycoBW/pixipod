# PixiPod Portfolio Reels — Design System

## Overview

Five silent portfolio loops present real captured states of PixiPod projects inside a consistent editorial frame. Each project keeps its original site palette and typography, while the framing system uses PixiPod black, warm paper, cyan and violet. The layout is full-bleed and image-led: no decorative dashboards, fake browser chrome or text overlays compete with the captured work. Motion is precise and fluid, built around camera travel, masks and quiet depth.

## Colors

- **PixiPod Ink**: `#08090B` — outer frame and transition field.
- **PixiPod Paper**: `#F3F1EC` — light flash and neutral transition surface.
- **PixiPod Cyan**: `#05C8ED` — progress line and mask edge.
- **PixiPod Violet**: `#7137FF` — secondary mask edge and transition accent.
- **GrooMyCRM Peach**: `#E1C19E` — captured primary surface.
- **GrooMyCRM Lime**: `#E4FF60` — captured product highlight.
- **TrimmyCRM Deep Green**: `#203232` — captured brand depth.
- **24Uptime Signal Blue**: `#2F86FF` — captured product accent.
- **Bankrot.AI Navy**: `#080C16` — captured primary surface.
- **Lex-Doc Electric Blue**: `#508EF1` — captured product accent.

## Typography

- **Framing font**: Onest Variable, 500–700. Used only for tiny project labels when necessary.
- **GrooMyCRM**: Manrope Variable with Unbounded Variable display type; hero sizes reach 148px in the source.
- **TrimmyCRM**: Manrope with Source Serif 4 display accents and IBM Plex Mono labels.
- **24Uptime**: Manrope 400–800 for product-oriented interface hierarchy.
- **Bankrot.AI**: source capture uses a restrained neo-grotesque system with large light headings.
- **Lex-Doc Sorter**: Plus Jakarta Sans 300–800 and Geist 400–900.

## Elevation

Captured screenshots sit as full-bleed layers with no synthetic drop shadow. Depth comes from scale differences, foreground masks, slight perspective and localized cyan-violet light at transitions. The website cards provide their own rounded clipping and dark gradient for readable portfolio metadata.

## Components

- **Full-Bleed Capture Stage**: 1920×1080 source frame cropped to card aspect ratio without letterboxing.
- **Camera Travel**: slow 2–4% zoom with directional drift toward the important interface region.
- **Iris Transition**: rounded cyan-violet mask that moves across the frame and reveals the second page state.
- **Signal Sweep**: narrow luminous line used between captured states, not as a permanent overlay.
- **Loop Seam**: final 0.45 seconds returns to the opening visual through a dark soft wipe.

## Do's and Don'ts

### Do's

- Preserve real captured project screens and their original brand colors.
- Keep every frame legible when paused.
- Use slow camera movement and one clear transition per loop.
- Crop toward actual product UI, typography or distinctive imagery.

### Don'ts

- Do not add fake awards, client metrics or browser controls.
- Do not place large captions over the project work.
- Do not use generic gradient blobs or glass cards inside the videos.
- Do not flash, shake or accelerate transitions beyond the calm PixiPod motion language.
