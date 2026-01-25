# PowerCore Unified Dashboard

The consumer-facing frontend for the PowerCore AI Agent Marketplace.

## 🎯 What's Included

This package contains the polished, consumer-facing pages that complement your existing `powercore-dashboard` admin cockpit:

| Page | Route | Description |
|------|-------|-------------|
| **Landing Page** | `/` | Conversion-focused homepage |
| **Marketplace** | `/marketplace` | Browse and search agents (grid/list view) |
| **Agent Detail** | `/marketplace/[id]` | Purchase page with reviews, changelog |
| **Workshop** | `/workshop` | No-code agent creation wizard |

## 🚀 Quick Start

### Option 1: Standalone (New Project)

```bash
cd powercore-unified
npm install
npm run dev
```

Visit `http://localhost:3000`

### Option 2: Integrate with Existing powercore-dashboard

1. **Copy the app pages** into your existing Next.js project:
   ```
   app/page.tsx           → Your landing page
   app/marketplace/       → Marketplace + detail pages
   app/workshop/          → Agent creation wizard
   ```

2. **Copy the UI components** (if you don't have shadcn/ui set up):
   ```
   components/ui/         → All UI components
   lib/utils.ts           → Utility functions
   ```

3. **Merge the styles** from `app/globals.css` with your existing styles.

4. **Install dependencies** if missing:
   ```bash
   npm install framer-motion lucide-react
   ```

## 🔌 Connecting to Your Backend

The pages use placeholder data. To connect to your existing APIs:

### Marketplace Page (`app/marketplace/page.tsx`)

Replace the `agents` array with an API call:

```tsx
// Before (placeholder)
const agents = [{ id: "research-pro", name: "Research Pro", ... }];

// After (connected to your API)
const { data: agents } = await fetch('http://localhost:5003/agents').then(r => r.json());
```

### Agent Detail Page (`app/marketplace/[id]/page.tsx`)

Replace `getAgentById` with your API:

```tsx
// Before
const getAgentById = (id: string) => ({ ... });

// After
const getAgentById = async (id: string) => {
  const res = await fetch(`http://localhost:5003/agents/${id}`);
  return res.json();
};
```

### Workshop Page (`app/workshop/page.tsx`)

Connect the deploy function to your backend:

```tsx
// In the deploy step, call your monetization API
const handleDeploy = async () => {
  const res = await fetch('http://localhost:5003/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...agentConfig,
      ...deployConfig,
    }),
  });
  // Handle response, redirect to agent page
};
```

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to change the color scheme:

```css
:root {
  --primary: 263 70% 58%;  /* Violet - change this */
  /* ... */
}
```

### Logo & Branding

Update the logo in the nav component (search for `<Zap />` and replace with your logo).

## 📁 File Structure

```
powercore-unified/
├── app/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── marketplace/
│   │   ├── page.tsx        # Marketplace browse
│   │   └── [id]/
│   │       └── page.tsx    # Agent detail
│   └── workshop/
│       └── page.tsx        # No-code agent builder
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.ts            # Utility functions
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Integration Checklist

- [ ] Copy pages to your existing project
- [ ] Connect marketplace to `/agents` API endpoint
- [ ] Connect agent detail to `/agents/:id` endpoint
- [ ] Connect workshop deploy to `/publish` endpoint
- [ ] Add Stripe checkout to purchase flow
- [ ] Add authentication (OAuth)
- [ ] Update branding/logo

## 🤝 Combining with powercore-dashboard

Your existing `powercore-dashboard` is the **admin/creator** interface. This package is the **consumer** interface. They work together:

```
Consumer Flow:
  Landing (/) → Marketplace (/marketplace) → Buy Agent → Use Agent

Creator Flow:
  Dashboard (/dashboard) → Workshop → Publish → Track Sales → Leaderboard
```

Both can share the same backend APIs.

## 📝 Notes

- Uses Next.js 14 App Router
- Framer Motion for animations
- Tailwind CSS + shadcn/ui
- Fully responsive design
- Dark mode by default

## 🚀 Deployment

Deploy to Vercel:

```bash
vercel
```

Or build for production:

```bash
npm run build
npm start
```
