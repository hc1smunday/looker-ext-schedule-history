# Quick Reference Guide

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# The dev server runs on https://localhost:8080
```

## File Quick Reference

| File | Purpose | When to Edit |
|------|---------|--------------|
| `manifest.lkml` | Extension configuration | Change name, add API methods, adjust permissions |
| `src/ScheduleHistory.tsx` | Main extension logic | Add features, modify UI, change behavior |
| `src/App.tsx` | Extension wrapper | Rarely (only for global providers) |
| `package.json` | Dependencies | Add new libraries |
| `vite.config.ts` | Build configuration | Rarely (already optimized) |

## Common Tasks

### Add a New API Method

1. **Update manifest.lkml:**
```lkml
entitlements: {
  core_api_methods: [
    "scheduled_plan",
    "all_scheduled_plans",
    "your_new_method"  # Add here
  ]
}
```

2. **Use in component:**
```typescript
const result = await core40SDK.ok(
  core40SDK.your_new_method()
);
```

### Add a New UI Component

```typescript
import { NewComponent } from '@looker/components';

// In your render:
<NewComponent prop="value" />
```

Browse available components: https://components.looker.com/

### Add State

```typescript
const [myState, setMyState] = useState<Type>(initialValue);
```

### Add an Effect (runs on mount/update)

```typescript
useEffect(() => {
  // Your code here
}, [dependencies]);
```

## Looker Components Cheat Sheet

```typescript
// Layout
<Box p="large" m="medium">Content</Box>
<Space>Multiple items with spacing</Space>

// Inputs
<FieldText label="Label" value={val} onChange={e => setVal(e.target.value)} />
<FieldSelect options={opts} value={val} onChange={setVal} />

// Buttons
<Button onClick={handler}>Click Me</Button>
<ButtonGroup value={selected} onChange={setSelected}>
  <Button value="opt1">Option 1</Button>
  <Button value="opt2">Option 2</Button>
</ButtonGroup>

// Display
<Spinner />
<Heading>Title</Heading>
<Text>Body text</Text>

// Tables
<Table>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Header</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableDataCell>Data</TableDataCell>
    </TableRow>
  </TableBody>
</Table>
```

## Common API Patterns

### Fetch All Items
```typescript
const items = await core40SDK.ok(
  core40SDK.all_scheduled_plans()
);
```

### Fetch Single Item
```typescript
const item = await core40SDK.ok(
  core40SDK.scheduled_plan(id)
);
```

### Error Handling
```typescript
try {
  const result = await core40SDK.ok(core40SDK.some_method());
  setData(result);
} catch (error) {
  console.error('Error:', error);
  // Show error to user
}
```

### Loading States
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const result = await core40SDK.ok(core40SDK.some_method());
    setData(result);
  } finally {
    setLoading(false);
  }
};

// In render:
{loading ? <Spinner /> : <YourContent />}
```

## TypeScript Types

### Common Looker Types
```typescript
import { 
  IScheduledPlan,
  ILook,
  IDashboard,
  IUser,
  IQuery
} from '@looker/sdk';
```

### Component Props
```typescript
interface MyComponentProps {
  title: string;
  count?: number;  // Optional
  onUpdate: (value: string) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, count = 0, onUpdate }) => {
  // ...
};
```

## Debugging Tips

### Check Extension Context
```typescript
const { core40SDK, extensionSDK } = useContext(ExtensionContext);
console.log('SDK available:', !!core40SDK);
```

### Log API Responses
```typescript
const result = await core40SDK.ok(core40SDK.some_method());
console.log('API Response:', result);
```

### Check Entitlements
Look in browser console for errors like:
```
Error: Method 'some_method' not in entitlements
```
→ Add the method to manifest.lkml

### Network Tab
Open browser DevTools → Network tab to see:
- API calls to Looker
- Response status codes
- Response data

## Deployment Checklist

### Development → Production

- [ ] Test all features locally
- [ ] Run `npm run build`
- [ ] Check `dist/bundle.js` was created
- [ ] Upload `dist/bundle.js` to Looker project
- [ ] Update manifest.lkml:
  ```lkml
  # Change from:
  url: "https://localhost:8080/bundle.js"
  
  # To:
  file: "dist/bundle.js"
  ```
- [ ] Commit to Git
- [ ] Deploy to Looker production
- [ ] Test in production environment

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Extension doesn't appear | Check project_name matches Looker project |
| API call fails | Add method to core_api_methods in manifest.lkml |
| Build fails | Run `npm install`, check for TypeScript errors |
| Localhost not loading | Ensure dev server is running (`npm run dev`) |
| HTTPS certificate error | Accept the self-signed certificate in browser |
| Changes not appearing | Hard refresh (Ctrl+Shift+R or Cmd+Shift+R) |

## Environment Variables

If you need environment-specific config:

1. **Create `.env` file:**
```
VITE_API_URL=https://your-looker-instance.com
```

2. **Use in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

3. **Add to .gitignore:**
```
.env
.env.local
```

## Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Make changes
git add .
git commit -m "Add new feature"

# Push to remote
git remote add origin <your-repo-url>
git push -u origin main
```

## Useful Links

- **Looker Extension Docs:** https://cloud.google.com/looker/docs/intro-to-extension-framework
- **Looker API Reference:** https://cloud.google.com/looker/docs/reference/looker-api/latest
- **Looker Components:** https://components.looker.com/
- **Extension Examples:** https://github.com/looker-open-source/extension-examples
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **React Docs:** https://react.dev/

## Project-Specific Notes

### Current Features
- View all scheduled plans
- Filter by specific schedule ID
- Filter by status (all/success/failure)
- Refresh data on demand

### Potential Enhancements
- Add date range filter
- Show schedule details on click
- Add ability to run schedule manually
- Export schedule history to CSV
- Add charts/visualizations
- Show schedule frequency
- Display schedule recipients
- Add pagination for large datasets

### API Methods Available
Based on current entitlements:
- `scheduled_plan(id)` - Get single schedule
- `all_scheduled_plans()` - Get all schedules
- `scheduled_plan_run_once(id)` - Run schedule once

To add more, update manifest.lkml and see API docs for available methods.
