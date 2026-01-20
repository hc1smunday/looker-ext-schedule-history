# Looker Extension Framework Guide

## What is a Looker Extension?

A Looker Extension is a custom web application that runs inside Looker's interface. It allows you to build custom functionality while accessing Looker's APIs and data securely.

## How This Project Works

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         Looker Instance                 │
│  ┌───────────────────────────────────┐  │
│  │   Your Extension (React App)      │  │
│  │   - Runs in iframe                │  │
│  │   - Uses Extension SDK            │  │
│  │   - Calls Looker APIs             │  │
│  └───────────────────────────────────┘  │
│              ↕                          │
│  ┌───────────────────────────────────┐  │
│  │   Looker Core APIs                │  │
│  │   - scheduled_plan()              │  │
│  │   - all_scheduled_plans()         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Key Files Explained

#### 1. **manifest.lkml** - Extension Configuration
This file tells Looker about your extension:

```lkml
project_name: "schedule-history-extension"  # Must match your Looker project

application: schedule_history {
  label: "Schedule History"                 # Name shown in Looker UI
  url: "https://localhost:8080/bundle.js"   # Dev: localhost, Prod: use 'file' instead
  
  entitlements: {                           # Permissions your extension needs
    core_api_methods: [                     # Looker API methods you can call
      "scheduled_plan",
      "all_scheduled_plans",
      "scheduled_plan_run_once"
    ]
    navigation: yes                         # Can navigate within Looker
    use_embeds: yes                         # Can use embedded content
  }
}
```

**Important:** The `project_name` must match the name of your LookML project in Looker.

#### 2. **src/index.tsx** - Entry Point
Renders the React app into the DOM:
```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

#### 3. **src/App.tsx** - Extension Wrapper
Sets up the Extension SDK and Looker Components:
```tsx
<ExtensionProvider>        {/* Provides Looker SDK context */}
  <ComponentsProvider>     {/* Provides Looker UI components */}
    <ScheduleHistory />    {/* Your actual extension */}
  </ComponentsProvider>
</ExtensionProvider>
```

#### 4. **src/ScheduleHistory.tsx** - Main Component
Your extension's logic:
- Uses `ExtensionContext` to access `core40SDK` (Looker API)
- Calls API methods like `core40SDK.all_scheduled_plans()`
- Displays data using Looker Components (Table, Button, etc.)

### How Data Flows

1. **User interacts** with the UI (clicks Refresh, enters Schedule ID)
2. **Component calls** Looker API via `core40SDK`
3. **Looker validates** the request against entitlements
4. **API returns** data (scheduled plans)
5. **Component renders** the data in a table

## Development Workflow

### 1. Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server on https://localhost:8080
```

The extension runs locally but connects to your Looker instance.

### 2. Configure in Looker
1. Go to **Admin > Platform > Extensions**
2. Find your project
3. Enable the extension
4. Access it from **Applications** menu

### 3. Production Deployment
```bash
npm run build        # Creates dist/bundle.js
```

Then:
1. Upload `dist/bundle.js` to your Looker project
2. Update manifest.lkml:
   ```lkml
   file: "dist/bundle.js"  # Instead of url
   ```

## Entitlements Explained

Entitlements are security permissions that control what your extension can do:

| Entitlement | Purpose | This Project Uses? |
|-------------|---------|-------------------|
| `core_api_methods` | Specific Looker API methods | ✅ Yes - for fetching schedules |
| `navigation` | Navigate within Looker | ✅ Yes |
| `use_embeds` | Embed Looker content | ✅ Yes |
| `local_storage` | Access browser storage | ❌ No |
| `new_window` | Open new windows | ❌ No |
| `external_api_urls` | Call external APIs | ❌ No |

**Security Note:** Only request entitlements you actually need. Looker admins review these.

## Common API Methods

Your extension uses these Looker API methods:

```typescript
// Get all scheduled plans
const plans = await core40SDK.ok(core40SDK.all_scheduled_plans());

// Get specific schedule by ID
const plan = await core40SDK.ok(core40SDK.scheduled_plan(scheduleId));

// Run a schedule once
await core40SDK.ok(core40SDK.scheduled_plan_run_once(scheduleId));
```

## Looker Components

This project uses Looker's component library for consistent UI:

- `Box` - Layout container with padding/spacing
- `Button` / `ButtonGroup` - Interactive buttons
- `FieldText` - Text input field
- `Table` / `TableHead` / `TableBody` - Data tables
- `Spinner` - Loading indicator
- `Space` - Spacing between elements

These components automatically match Looker's theme and styling.

## Project Structure

```
looker-ext-schedule-history/
├── manifest.lkml              # Looker extension config
├── package.json               # Dependencies
├── vite.config.ts            # Build configuration
├── tsconfig.json             # TypeScript config
├── index.html                # HTML template
└── src/
    ├── index.tsx             # Entry point
    ├── App.tsx               # Extension wrapper
    └── ScheduleHistory.tsx   # Main component
```

## Troubleshooting

### Extension doesn't appear in Looker
- Check that `project_name` in manifest.lkml matches your Looker project name
- Verify the extension is enabled in Admin > Platform > Extensions
- Ensure you have permission to use extensions

### API calls fail
- Check that API methods are listed in `core_api_methods` entitlements
- Verify your Looker user has permission to access scheduled plans
- Check browser console for error messages

### Build fails
- Run `npm install` to ensure dependencies are installed
- Check that all imports are correct
- Verify TypeScript has no errors

## Next Steps

To customize this extension:

1. **Add more filters** - Filter by date range, user, etc.
2. **Add actions** - Run schedules, edit schedules
3. **Improve UI** - Add charts, better formatting
4. **Add error handling** - Show user-friendly error messages

## Resources

- [Looker Extension Framework Docs](https://cloud.google.com/looker/docs/intro-to-extension-framework)
- [Looker API Reference](https://cloud.google.com/looker/docs/reference/looker-api/latest)
- [Looker Components](https://components.looker.com/)
- [Extension Examples](https://github.com/looker-open-source/extension-examples)
