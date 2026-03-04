# Changelog

All notable changes to Mission Control.

## [1.1.0] - 2026-02-23

### Added
- **Sync Now Button** - Manual trigger for project database sync
- **Sync Status UI** - Visual feedback during sync operations

### Improved
- Better sync status indicators

## [1.0.0] - 2026-02-22

### Added
- **Project Tracker** - View and filter all 74 dc-* projects
  - Status filtering (Live, In Progress, Idea, Stale)
  - Category and priority tracking
  - GitHub repo matching
  - Database sync with Supabase
- **Hawaii Flight Monitor** - Track flight prices for specific trip dates
  - Working flight search links
  - Price alert system
- **IKEA Case Tracker** - Track lawsuit timeline and documents
  - Interactive file viewer
  - Event timeline
  - Document status tracking
- **Quick Capture** - Fast note entry (planned)
- **Windows Launcher** - `start-mission-control.bat`
- **Vercel Deployment** - Auto-deploy on push

### Technical
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase integration

---

**Dashboard:** https://mission-control.vercel.app (or run locally with `npm run dev`)
