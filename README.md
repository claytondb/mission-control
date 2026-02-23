# 🚀 Mission Control

Personal dashboard for tracking projects, monitoring Hawaii flight prices, capturing quick notes, and managing the IKEA case.

## Features

### 📦 Project Tracker
- View all dc-* projects at a glance
- See status, category, and priority
- Track momentum (last activity)
- Filter by status: Live, In Progress, Idea, Stale

### 🌺 Hawaii Flight Monitor
- Track prices for specific Hawaii trip dates
- Compare prices across airlines
- Set price alerts (future)

### ⚡ Quick Capture
- Fast note and task entry
- Categorize captures instantly
- Review and process later

### ⚖️ IKEA Case Tracker
- Timeline of case events
- Document status
- Next steps and deadlines

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (for project sync)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main dashboard
│   └── api/              # API routes
├── components/
│   ├── ProjectTracker.tsx
│   ├── FlightMonitor.tsx
│   ├── QuickCapture.tsx
│   └── IkeaCase.tsx
└── lib/
    └── supabase.ts       # Database client
```

## Deployment

Deployed on Vercel. Push to main triggers auto-deploy.

## Related Projects

- `dc-salestaxjar` (Sails) - Tax compliance SaaS
- `dc-growbucks` - Family banking app
- All other `dc-*` projects tracked here
