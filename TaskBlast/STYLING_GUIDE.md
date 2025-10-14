# TaskBlast Styling Guide

This project now supports two styling approaches:

## 1. Global Styles (app/styles/global.ts)

Import and use predefined theme values for consistency:

```typescript
import { colors, shadows, borderRadius, spacing } from "../styles/global";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
});
```

### Available Global Style Objects:

- **colors**: Primary, secondary, background, surface, text, border colors
- **spacing**: xs, sm, md, lg, xl, xxl
- **borderRadius**: sm, md, lg, xl, round
- **fontSize**: xs, sm, md, lg, xl, xxl, xxxl
- **fontWeight**: regular, medium, semibold, bold
- **shadows**: small, medium, large, button
- **typography**: h1, h2, h3, body, caption, button

## 2. NativeWind (Tailwind CSS)

Use Tailwind utility classes directly in your components:

```tsx
<View className="flex-1 bg-background p-5">
  <Text className="text-2xl font-bold text-primary">Hello</Text>
</View>
```

### Custom Colors in Tailwind:

The `tailwind.config.js` extends the default palette with:

- `bg-primary`, `text-primary` - Main brand color (#4a90e2)
- `bg-background` - App background (#f5f5f5)
- `bg-surface` - Card/surface background (#ffffff)
- `text-secondary` - Secondary text (#666)

## When to Use Each:

### Use Global Styles (global.ts) when:

- You need complex shadows (React Native shadow props)
- You want strongly typed theme values
- Building reusable component styles
- Need to compute or combine style values

### Use NativeWind (Tailwind) when:

- Rapid prototyping
- Simple layouts and spacing
- You prefer utility-first CSS
- Building one-off components

## Example: Mixing Both Approaches

```tsx
import { colors, shadows } from "../styles/global";

<TouchableOpacity
  className="w-full h-12 rounded-lg items-center justify-center"
  style={{ backgroundColor: colors.primary, ...shadows.button }}
>
  <Text className="text-white text-lg font-semibold">Login</Text>
</TouchableOpacity>;
```

## Files Created:

1. **tailwind.config.js** - Tailwind configuration
2. **babel.config.js** - Updated with NativeWind plugin
3. **global.css** - CSS imports for NativeWind
4. **app/styles/global.ts** - Custom theme/style definitions
5. **app.d.ts** - TypeScript definitions for NativeWind
6. **app/\_layout.tsx** - Updated to import global.css

## Getting Started:

Your Login.tsx has been updated to use global styles. See `Login.tailwind.example.tsx` for a Tailwind version.

To start the development server:

```bash
npm start
```

Note: Clear cache if styles don't apply immediately:

```bash
npx expo start --clear
```
