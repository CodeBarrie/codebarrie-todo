# CodeBarrie: To-Do — Project Status

**Last Updated:** March 5, 2026
**Stack:** React 19 + Tauri 2 (Rust) desktop app
**Architecture:** Single-file UI (`src/App.jsx`, ~2800 lines), zero external UI libraries
**Platforms:** Windows, macOS, Linux

---

## Core Purpose

A beautiful, minimal to-do list desktop app with cinematic polish. Designed for power users who want task management that feels satisfying to use — every interaction has weight, motion, and feedback.

---

## Features

### Task Management
- Create, edit, delete, and check off tasks
- Tasks organized into collapsible sections
- Section-level progress bars with gradient fills
- Global progress bar across all sections
- Completion celebration messages (randomized toasts)
- Markdown checklist import (paste `- [ ] task` format)

### Session System
- Multiple independent sessions stored in `localStorage`
- Session switcher dropdown below title bar
- Create, rename, delete sessions
- Auto-save on every change
- Last-modified timestamps displayed
- Default session created on first launch

### Countdown Timers
- Optional timer per task (clock icon button)
- Quick presets: 5m, 15m, 25m, 60m + custom input
- Visual: full-width depleting bar behind task text
- Time remaining displayed centered over the bar
- Text color inverts at 50% threshold for readability
- Persists across app restarts (calculates elapsed from `startedAt`)
- Flash + toast notification when timer hits 0

### Section Reorder (Cinematic Animation)
- Up/down arrow buttons on section headers
- Animation sequence on move:
  1. Section scales up to 1.05x
  2. Lifts and glides over neighbor (translateY arc)
  3. Lands with scale bump + screen shake
  4. Confetti burst from underneath landing position
  5. Neighboring sections ripple (translateY wave)
- Confetti position pre-computed with scroll math for accuracy

### Task Drag-and-Drop (Custom Pointer System)
- **Ghost "soul pull" effect**: Translucent floating div follows cursor, original task fades to 15% opacity with blur
- **Smooth gap indicator**: 44px padding gap opens between tasks with CSS transitions, centered glow line
- **Hit-testing**: DOM query all `[data-task-id]` elements, sorted by position, normalized to single indicator per gap
- **Cross-section drops**: Drag tasks between different sections
- **Edge-zone auto-scroll**: rAF loop triggers within 25% of window top/bottom, quadratic acceleration
- **Drop impact ripple**: Inverse-square falloff (42/dist^2) pushes neighboring tasks outward on drop, staggered delay radiates like a shockwave
- **Collapsing placeholder**: Old position smoothly shrinks closed (350ms) instead of instant jump
- **Landing animation**: Dropped task gets scale bounce + dark overlay that fades out
- **Safety nets**: `window.blur` + `visibilitychange` cleanup, click suppression after drag, text selection prevention

### Quick-Add Section
- `+` button top-right of content area, below global progress bar
- Opens inline input at TOP of sections list
- Enter to confirm, Escape to cancel
- Complements the existing "add section" at bottom

### Visual & UX
- **Parallax effects**: Mouse-tracked tilt on sections with configurable intensity, pivot mode, and axis lock
- **Confetti system**: Canvas-based particle bursts on task completion and section reorder
- **Custom title bar**: Tauri frameless window with minimize/maximize/close, theme-matched
- **Laserburn theme**: Warm orange gradient with white accents
- **Toast notifications**: Slide-in celebration messages on task completion
- **JetBrains Mono**: Monospace typography throughout
- **Progress shake**: Global progress bar shakes with increasing intensity as completion approaches 100%

---

## Technical Highlights

- **Zero dependencies** beyond React and Tauri API — all animations, drag-and-drop, confetti, and effects are hand-rolled
- **requestAnimationFrame** used for confetti rendering, timer depletion, and drag auto-scroll
- **CSS custom properties** (`--ripple-dist`) drive per-element animation intensity
- **Stale closure protection**: DOM queries used instead of React state refs inside `useCallback` closures
- **Pointer events over HTML5 drag**: Native drag doesn't work with CSS 3D transforms; custom pointer system handles all edge cases

---

## File Structure

```
codebarrie-todo/
├── src/
│   ├── App.jsx          # Entire UI (components, state, styles, animations)
│   ├── main.jsx         # React entry point
│   └── index.css        # Minimal base styles
├── src-tauri/           # Rust/Tauri backend config
├── package.json         # React 19 + Tauri 2 + Vite 7
└── Project_Status.md    # This file
```

---

## Resolved Challenges

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Native drag-and-drop broken | CSS 3D transforms break HTML5 drag API | Rewrote to custom pointer-based system |
| Tasks unclickable below the fold | `overflow: hidden` + `perspective` creates 3D clipping context | Changed to `overflowX: hidden`, removed perspective |
| Ghost stuck floating on alt-tab | `setPointerCapture` unreliable | Moved to `window` listeners + `blur`/`visibilitychange` safety |
| Click toggles checkbox after drag | `pointerup` → `click` fires on same element | `window.__cbDragJustEnded` flag with 50ms timeout |
| Confetti at wrong position | Post-swap DOM measurement unreliable | Pre-compute landing rect from original measurements + scroll delta |
| Add button hover stuck | Imperative `style.x =` out of sync with React | CSS class `.cb-add-btn:hover` |
| Drop indicator flickering | Hit-test reporting both "above B" and "below A" | Normalized to always "below upper task" |
| Clunky drop landing | Ghost slide animation = two-step visual | Instant drop: ghost fades in place, task materializes in gap |
| Tasks jump up on drop | Old position collapses instantly | Collapsing placeholder div with height transition |
| Auto-scroll only on mouse move | `scrollBy` in `pointermove` handler only | rAF loop with continuous edge-zone detection |

---

## Status: Stable & Polished

All core features implemented and refined through extensive iterative testing. The drag-and-drop system in particular has been through ~15 rounds of refinement to achieve the current feel. Ready for daily use.
