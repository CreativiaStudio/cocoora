# Project: Cocoora Champions League Design & Cinematic Motion Elevation

## Architecture
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling & Design Tokens**: Tailwind CSS, CSS Variables, Design Tokens (`tokens.ts`)
- **Motion & Smooth Scroll**: Framer Motion v12 (`motion/react`), Lenis virtual smooth scrolling
- **3D & Canvas**: Three.js / React Three Fiber (`cocoora-orbit-3d.tsx`), WebGL Shaders
- **Audio & Video**: Creativia Video Factory (-14 LUFS, auto-ducking -14 dB), HTML5 Video / Canvas
- **Brand & Clinical Core**: Strict Brand Vault compliance (zero forbidden terms), clinical data immutability (`MATRIX_DATA`, `/trattamenti/*`, `/visite/*`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Benchmark Research & Gap Analysis | Forensic comparison with Awwwards, Apple Health, Qura.co, Linear, Stripe Press | M1 | Survey |
| 2 | 4 Creative Teams Blueprint | Architecture, SOP, toolchain, prompt templates, and QA matrix for 4 teams | M1 | Survey |
| 3 | Brand Vault & Clinical Defense | Verification of clinical invariants, removal of "pilastri", fix of `/visite` route | M2 | Survey |
| 4 | Physics Spring Tokens & Scroll Purity | Add harmonic spring presets to `tokens.ts`, eliminate CSS smooth scroll clash in `globals.css` | M2 | Survey |
| 5 | Scroll-Expand-Cinema GPU Perfection | GPU `clip-path: inset(...)` zero-reflow expansion, 3-Act narrative staging, zero lag | M2 | Survey |
| 6 | Lab Motion Page Harmonization | Clean linting errors, interactive play state, translucent blending with Atmosphere | M2 | Survey |
| 7 | Multi-Agent Review & Forensic Audit | Objective review, empirical adversarial verification, and forensic integrity audit | M3 | System |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Blueprint & Gap Analysis Documentation | Redazione del documento organico `docs/CHAMPIONS_LEAGUE_BLUEPRINT.md` con Gap Analysis e Matrice 4 Team | Survey complete | DONE |
| M2 | Cinematic Motion Elevation & Lab Refinement | Implementazione `tokens.ts`, `globals.css`, `scroll-expand-cinema.tsx`, `page.tsx` | M1 | DONE |
| M3 | Review, Adversarial & Forensic Verification | 2 Reviewer, 2 Challenger, 1 Forensic Auditor con verifica build, typecheck, lint, clinical integrity | M2 | DONE |

## Interface Contracts
### `tokens.ts` ↔ Motion Components
- Export `SPRINGS`:
  - `snappy`: `{ stiffness: 240, damping: 20, mass: 0.5 }`
  - `smooth`: `{ stiffness: 120, damping: 20, mass: 0.8 }`
  - `cinematic`: `{ stiffness: 80, damping: 22, mass: 1.0 }`
  - `ambient`: `{ stiffness: 40, damping: 18, mass: 1.2 }`

### `scroll-expand-cinema.tsx` ↔ `page.tsx`
- Prop signature:
  ```ts
  interface ScrollExpandCinemaProps {
    title?: string;
    subtitle?: string;
    badge?: string;
    videoSrc?: string;
    posterSrc?: string;
    className?: string;
    metrics?: Array<{ label: string; value: string }>;
  }
  ```
- Rendering: GPU hardware-accelerated `clip-path: inset(...)`, fixed viewport stage, zero `width`/`height` reflow.
- 3-Act Timeline:
  - Act 1 [0.00 – 0.30]: Smooth expansion from framed window to full width/height.
  - Act 2 [0.30 – 0.75]: Full-screen clinical immersion dwell with telemetry and kinetic insights.
  - Act 3 [0.75 – 1.00]: Graceful exit transition and hand-off to next section.

## Code Layout
- `docs/CHAMPIONS_LEAGUE_BLUEPRINT.md`: Master Gap Analysis and Creative Teams Blueprint
- `src/components/motion/tokens.ts`: Unified motion tokens and spring physics presets
- `src/app/globals.css`: Base styles, scroll rules
- `src/components/motion/scroll-expand-cinema.tsx`: Elevated cinema expansion component
- `src/app/lab/motion/page.tsx`: Laboratory showcase page
- Invariant clinical files (DO NOT TOUCH):
  - `src/components/sections/matrice-medicina.tsx`
  - `src/app/trattamenti/[slug]/*`
  - `src/app/visite/*`
