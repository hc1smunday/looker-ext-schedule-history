# Schedule History Extension - Architecture

## Component Hierarchy

```
index.html
    └── src/index.tsx (ReactDOM.render)
            └── App.tsx
                    ├── ExtensionProvider (from @looker/extension-sdk-react)
                    │   └── Provides: core40SDK, extensionSDK
                    │
                    └── ComponentsProvider (from @looker/components)
                            └── Provides: Looker UI theme & components
                                    │
                                    └── ScheduleHistory.tsx
                                            ├── State Management
                                            │   ├── scheduleId (string)
                                            │   ├── filter (FilterType)
                                            │   ├── schedules (IScheduledPlan[])
                                            │   └── loading (boolean)
                                            │
                                            ├── API Calls
                                            │   ├── core40SDK.all_scheduled_plans()
                                            │   └── core40SDK.scheduled_plan(id)
                                            │
                                            └── UI Components
                                                ├── FieldText (Schedule ID input)
                                                ├── Button (Refresh)
                                                ├── ButtonGroup (Filter buttons)
                                                ├── Spinner (Loading state)
                                                └── Table (Display schedules)
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Actions                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ScheduleHistory Component                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. User enters Schedule ID or clicks Refresh            │  │
│  │  2. fetchSchedules() is called                           │  │
│  │  3. setLoading(true)                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Extension SDK Context                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  core40SDK (Looker API Client)                           │  │
│  │  - Authenticated with user's session                     │  │
│  │  - Restricted by entitlements                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Looker API                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Check entitlements:                                     │  │
│  │  ✓ "scheduled_plan" in core_api_methods?                │  │
│  │  ✓ User has permission to view schedules?               │  │
│  │                                                           │  │
│  │  If authorized:                                          │  │
│  │  → Query database for scheduled plans                   │  │
│  │  → Return IScheduledPlan[] data                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ScheduleHistory Component                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  4. Receive data: IScheduledPlan[]                       │  │
│  │  5. setSchedules(result)                                 │  │
│  │  6. setLoading(false)                                    │  │
│  │  7. Apply client-side filter (all/success/failure)       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Render UI                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Table displays:                                         │  │
│  │  - Schedule ID                                           │  │
│  │  - Schedule Name                                         │  │
│  │  - Last Run Time                                         │  │
│  │  - Status (success/failure/error)                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      manifest.lkml                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  entitlements: {                                         │  │
│  │    core_api_methods: [                                   │  │
│  │      "scheduled_plan",        ← Only these methods       │  │
│  │      "all_scheduled_plans",     allowed                  │  │
│  │      "scheduled_plan_run_once"                           │  │
│  │    ]                                                     │  │
│  │    navigation: yes            ← Can navigate in Looker  │  │
│  │    use_embeds: yes            ← Can use embeds          │  │
│  │  }                                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Extension Sandbox                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Your extension runs in an iframe with:                  │  │
│  │  ✓ Limited API access (only entitled methods)           │  │
│  │  ✓ User's authentication context                        │  │
│  │  ✓ User's data permissions                              │  │
│  │  ✗ No direct database access                            │  │
│  │  ✗ No access to other users' data                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Build Process

```
Development:
┌──────────────┐
│  npm run dev │
└──────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  Vite Dev Server (localhost:8080)      │
│  - Hot Module Replacement               │
│  - TypeScript compilation               │
│  - React Fast Refresh                   │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  manifest.lkml                          │
│  url: "https://localhost:8080/bundle.js"│
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  Looker loads extension from localhost  │
└─────────────────────────────────────────┘


Production:
┌────────────────┐
│  npm run build │
└────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  Vite Build Process                     │
│  1. TypeScript → JavaScript             │
│  2. Bundle all modules                  │
│  3. Externalize React (rollupOptions)   │
│  4. Output: dist/bundle.js              │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  Upload dist/bundle.js to Looker       │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  manifest.lkml                          │
│  file: "dist/bundle.js"                 │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  Looker serves extension from project   │
└─────────────────────────────────────────┘
```

## State Management

```typescript
// Component State
const [scheduleId, setScheduleId] = useState<string>('')
    ↓
    Used to filter: fetch specific schedule or all schedules

const [filter, setFilter] = useState<FilterType>('all')
    ↓
    Used to filter: 'all' | 'success' | 'failure'

const [schedules, setSchedules] = useState<IScheduledPlan[]>([])
    ↓
    Stores: API response data

const [loading, setLoading] = useState<boolean>(false)
    ↓
    Controls: Spinner visibility

// Derived State
const filteredSchedules = schedules.filter(schedule => {
  if (filter === 'all') return true;
  if (filter === 'success') return schedule.last_run_status === 'success';
  if (filter === 'failure') return schedule.last_run_status === 'failure' || 'error';
})
    ↓
    Displayed in: Table component
```

## API Response Structure

```typescript
interface IScheduledPlan {
  id?: string                    // "123"
  name?: string                  // "Daily Sales Report"
  last_run_at?: string          // "2026-01-16T10:30:00Z"
  last_run_status?: string      // "success" | "failure" | "error"
  // ... many other fields
}

// Example API call:
const result = await core40SDK.ok(
  core40SDK.all_scheduled_plans()
)
// Returns: IScheduledPlan[]
```

## Extension Lifecycle

```
1. Looker loads extension iframe
        ↓
2. index.html loads
        ↓
3. src/index.tsx executes
        ↓
4. ReactDOM renders <App />
        ↓
5. ExtensionProvider initializes
   - Establishes connection with Looker
   - Provides core40SDK context
        ↓
6. ComponentsProvider initializes
   - Applies Looker theme
        ↓
7. ScheduleHistory mounts
   - useEffect triggers fetchSchedules()
        ↓
8. Extension is ready for user interaction
```

## Key Concepts

### ExtensionProvider
- Wraps your entire app
- Provides `core40SDK` for API calls
- Provides `extensionSDK` for extension features
- Handles authentication automatically

### ComponentsProvider
- Provides Looker's design system
- Ensures consistent styling with Looker
- Includes theme support

### core40SDK
- Looker API client (version 4.0)
- Methods return promises
- Use `.ok()` to unwrap successful responses
- Automatically includes user authentication

### Entitlements
- Whitelist of allowed capabilities
- Checked on every API call
- Prevents unauthorized access
- Configured in manifest.lkml
