# Layout System Documentation

## 🏗️ Global Layout Architecture

### Overview
Yollr Beast uses a **persistent global layout** system where the Header component renders on EVERY page automatically.

## ⚠️ Critical Rules

### Rule #1: Header is ALWAYS Rendered
The `Header` component is rendered globally by [components/ClientLayout.tsx](components/ClientLayout.tsx) and appears on **every single page** in the app.

**What this means**:
- ❌ DO NOT create full-screen pages with their own headers
- ❌ DO NOT use `min-h-screen` on page content (will overflow)
- ✅ DO design pages to work WITH the global header
- ✅ DO use `min-h-[calc(100vh-4rem)]` for full-height content

### Rule #2: Header Height Calculation
The Header component is approximately **4rem (64px)** tall.

**For full-height pages**, use:
```tsx
<div className="min-h-[calc(100vh-4rem)]">
  {/* Page content */}
</div>
```

**Why?**
- `100vh` = full viewport height
- `-4rem` = subtract header height
- Result: Content fills remaining space below header

### Rule #3: Don't Duplicate Header Functionality
The Header already provides:
- Logo and branding
- Beast Week badge
- Sign In button (unauthenticated users)
- Create button, points, avatar (authenticated users)

**Don't recreate these in your pages!**

## 📐 Layout Hierarchy

```
app/layout.tsx (RootLayout)
└── components/ClientLayout.tsx
    ├── <Header /> ← ALWAYS RENDERED
    └── <main>
        └── {children} ← Your page content goes here
```

## ✅ Correct Pattern Examples

### Full-Height Landing Page (CORRECT)
```tsx
// app/page.tsx
export default function HomePage() {
  return (
    // Using calc(100vh-4rem) to account for Header
    <div className="min-h-[calc(100vh-4rem)] bg-nightfall">
      <div className="max-w-md mx-auto">
        <h1>Welcome to Yollr Beast</h1>
        {/* Header Sign In button is already available - no need to duplicate */}
      </div>
    </div>
  );
}
```

### Regular Page with Natural Height (CORRECT)
```tsx
// app/some-page/page.tsx
export default function SomePage() {
  return (
    // No height calculation needed - let content determine height
    <div className="p-6">
      <h1>Page Title</h1>
      <p>Content here...</p>
    </div>
  );
}
```

### Feed/Timeline Page (CORRECT)
```tsx
// app/page.tsx (authenticated)
export default function HomePage() {
  return (
    // Feed component determines its own height
    <div className="min-h-screen">
      <Feed beastWeek={beastWeek} polls={polls} moments={moments} />
    </div>
  );
}
```

## ❌ WRONG Pattern Examples

### Full-Screen Page with Own Header (WRONG)
```tsx
// ❌ BAD - Creates double header!
export default function BadPage() {
  return (
    <div className="min-h-screen">  {/* ❌ Takes full screen */}
      <header>  {/* ❌ Duplicate header! */}
        <h1>My App</h1>
        <button>Sign In</button>  {/* ❌ Header already has this! */}
      </header>
      <main>{/* content */}</main>
    </div>
  );
}
```

**Result**: User sees TWO headers stacked on top of each other!

### Using min-h-screen on Content (WRONG)
```tsx
// ❌ BAD - Content will overflow below viewport
export default function BadPage() {
  return (
    <div className="min-h-screen bg-nightfall">  {/* ❌ Will extend past viewport */}
      {/* Content will be viewport height + header height */}
    </div>
  );
}
```

**Result**: Page is taller than viewport, causing unnecessary scrolling!

## 🛠️ Troubleshooting

### Issue: "I see two headers stacked"
**Cause**: Your page is rendering its own header when Header is already global
**Fix**: Remove the duplicate header from your page, use the global Header instead

### Issue: "Page content is cut off at the bottom"
**Cause**: Using `h-screen` or `max-h-screen` which doesn't account for Header
**Fix**: Use `min-h-[calc(100vh-4rem)]` instead of `min-h-screen`

### Issue: "Page has extra scrolling"
**Cause**: Using `min-h-screen` on content div (content height + header height > viewport)
**Fix**: Use `min-h-[calc(100vh-4rem)]` to account for header height

### Issue: "Landing page looks broken"
**Cause**: Likely designed as standalone full-screen but Header is rendering above it
**Fix**: Design landing page to work WITH header, use `min-h-[calc(100vh-4rem)]`

## 📋 Quick Reference

| Scenario | Correct Height Class | Why |
|----------|---------------------|-----|
| Full-height landing page | `min-h-[calc(100vh-4rem)]` | Account for Header |
| Regular content page | No height class needed | Let content determine height |
| Feed/timeline | `min-h-screen` on container | Feed manages its own scrolling |
| Modal/overlay | `h-screen` or `fixed inset-0` | Overlays cover entire viewport |

## 🎯 Key Takeaways

1. **Header is global** - Renders on every page automatically via ClientLayout
2. **Account for header height** - Use `calc(100vh-4rem)` for full-height content
3. **Don't duplicate** - Header already has Sign In, logo, Beast Week badge
4. **Read the comments** - [ClientLayout.tsx](components/ClientLayout.tsx) has important warnings
5. **Follow the pattern** - Check [app/page.tsx](app/page.tsx) for correct implementation

## 🔧 Development Checklist

Before creating a new page, ask yourself:

- [ ] Does my page need to be full-height? Use `min-h-[calc(100vh-4rem)]`
- [ ] Am I creating a header? **DON'T** - Header is already global
- [ ] Am I adding a Sign In button? **DON'T** - Header already has it
- [ ] Does my page work with Header visible? Test it!
- [ ] Did I read the comments in ClientLayout.tsx? **READ THEM**

## 📚 Related Files

- [components/ClientLayout.tsx](components/ClientLayout.tsx) - Global layout with Header
- [components/Header.tsx](components/Header.tsx) - Global header component
- [app/page.tsx](app/page.tsx) - Example of correct landing page implementation
- [app/layout.tsx](app/layout.tsx) - Root layout that wraps everything

---

**Last Updated**: 2025-12-17
**Status**: ✅ Documented and Enforced
