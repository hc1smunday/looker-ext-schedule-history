# Schedule History Looker Extension

A Looker Extension that displays schedule history with filtering capabilities.

## Features
- View all scheduled plans or filter by specific schedule ID
- Filter by status: All, Successful, Failure
- Real-time refresh capability

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. In Looker, navigate to Admin > Platform > Extensions and enable the extension.

## Usage
- Leave Schedule ID empty to view all schedules
- Enter a specific Schedule ID to view only that schedule
- Use filter buttons to show All, Successful, or Failed schedules
- Click Refresh to reload data

## Documentation

📚 **New to Looker Extensions?** Start here:
- **[EXTENSION_GUIDE.md](./EXTENSION_GUIDE.md)** - Complete guide to understanding Looker Extensions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture diagrams and data flow
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference for common tasks
- **[PROJECT_REVIEW.md](./PROJECT_REVIEW.md)** - Project status and improvements made

## Project Structure

```
looker-ext-schedule-history/
├── manifest.lkml              # Looker extension configuration
├── package.json               # Dependencies
├── vite.config.ts            # Build configuration
├── src/
│   ├── index.tsx             # Entry point
│   ├── App.tsx               # Extension wrapper
│   └── ScheduleHistory.tsx   # Main component
└── docs/                     # Documentation (see above)
```

## Development

```bash
npm run dev    # Start dev server (https://localhost:8080)
npm run build  # Build for production (outputs to dist/)
```

## Production Deployment

1. Build the extension:
```bash
npm run build
```

2. Upload `dist/bundle.js` to your Looker project

3. Update `manifest.lkml`:
```lkml
# Change from:
url: "https://localhost:8080/bundle.js"

# To:
file: "dist/bundle.js"
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **@looker/extension-sdk-react** - Extension framework
- **@looker/components** - Looker UI components
- **@looker/sdk** - Looker API client

## License

MIT
