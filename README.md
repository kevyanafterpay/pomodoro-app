# Pomodoro Timer

A desktop productivity app combining a Pomodoro timer with task management and session statistics. Built with Electron and React.

![Electron](https://img.shields.io/badge/Electron-41-47848F?logo=electron) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

---

## Features

- **Pomodoro Timer** — Work, short break, and long break phases with an animated circular progress ring
- **Task Management** — Create, prioritize, and track tasks with estimated and actual pomodoro counts
- **Session Statistics** — Daily summary, weekly bar chart, all-time stats, and productivity streaks
- **Customizable Settings** — Configure durations, auto-start, sound, daily goal, and custom categories
- **Desktop Notifications** — Browser notifications when a phase completes
- **Audio Chime** — A pleasant ascending tone (C–E–G) plays at phase completion
- **Persistent Storage** — All data saved locally via `localStorage`; no account or internet required

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+

### Install dependencies

```bash
pnpm install
```

### Run in development

```bash
pnpm dev
```

This starts the Electron app with the Vite dev server (hot reload on port 5173).

### Build for production

```bash
pnpm build
```

Output is written to `out/` (Electron main/preload) and `dist/` (renderer).

### Web-only mode (no Electron)

```bash
pnpm web:dev    # dev server
pnpm web:build  # build to dist/web
```

---

## Usage

### Timer

The timer has three phases that cycle automatically based on your settings:

| Phase | Default Duration |
|---|---|
| Work | 25 minutes |
| Short Break | 5 minutes |
| Long Break | 15 minutes |

- Click **Start** to begin, **Pause** to pause, **Reset** to abandon the current session.
- Use the **Skip** button to advance to the next phase immediately.
- Phase tabs (Work / Short Break / Long Break) are only switchable when the timer is idle.
- The **cycle dots** at the bottom track how many pomodoros you've completed before the next long break. Click the reset icon to clear the cycle count.

### Tasks

- **Add a task** using the form: set a title, priority (low / medium / high), category, and an optional estimated pomodoro count.
- **Set a task as Active** from its context menu (⋮) to track it against the timer. The active task is highlighted and shown in the timer panel.
- Tasks are filtered into **Active**, **Today**, and **Completed** tabs, and sorted by priority within each tab.
- Each task shows its completed pomodoros (and estimate, if set) as a counter.

### Settings

| Setting | Description |
|---|---|
| Timer durations | Customize work, short break, and long break lengths (in minutes) |
| Long break after | Number of pomodoros before a long break (default: 4) |
| Auto-start breaks | Automatically start break timers when a work phase ends |
| Auto-start work | Automatically start the next work phase when a break ends |
| Sound | Toggle the completion chime and adjust volume |
| Daily goal | Target number of pomodoros per day |
| Categories | Add or remove task categories |

### Statistics

The **Stats** view shows:
- **Daily Summary** — Today's pomodoros vs your daily goal, total focus time, and tasks completed
- **Weekly Chart** — Pomodoros completed per day for the current week (Mon–Sun)
- **All-Time Stats** — Total sessions, total hours, longest streak, sessions by day of week, and top categories

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | [Electron](https://www.electronjs.org/) |
| Frontend | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vitejs.dev/) via [electron-vite](https://electron-vite.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| State management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Audio | Web Audio API |
| Persistence | `localStorage` |

---

## Project Structure

```
src/
├── main/               # Electron main process
├── preload/            # Electron preload / context bridge
└── renderer/
    └── src/
        ├── components/
        │   ├── timer/  # Timer UI and progress ring
        │   ├── tasks/  # Task list, item, and form
        │   ├── stats/  # Statistics components
        │   └── settings/ # Settings panel
        ├── stores/     # Zustand state stores
        ├── hooks/      # useTimer logic
        ├── lib/        # Audio, storage adapter, utilities
        └── types/      # Shared TypeScript types
```

---
