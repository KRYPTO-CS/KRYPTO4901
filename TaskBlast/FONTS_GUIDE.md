# Google Fonts Setup Guide

## Fonts Installed

1. **Madimi One** - A decorative display font
2. **Orbitron** - A futuristic, geometric sans-serif font (with 6 weights)

## Using Fonts with Tailwind Classes

```tsx
import { Text } from "react-native";

// Madimi One font
<Text className="font-madimi text-2xl">Hello Madimi One</Text>

// Orbitron fonts (different weights)
<Text className="font-orbitron text-xl">Orbitron Regular</Text>
<Text className="font-orbitron-medium text-xl">Orbitron Medium</Text>
<Text className="font-orbitron-semibold text-xl">Orbitron SemiBold</Text>
<Text className="font-orbitron-bold text-xl">Orbitron Bold</Text>
<Text className="font-orbitron-extrabold text-xl">Orbitron ExtraBold</Text>
<Text className="font-orbitron-black text-xl">Orbitron Black</Text>
```

## Using Fonts with StyleSheet (global.ts)

```tsx
import { StyleSheet } from "react-native";
import { fontFamily } from "../styles/global";

const styles = StyleSheet.create({
  madimiText: {
    fontFamily: fontFamily.madimi,
  },
  orbitronText: {
    fontFamily: fontFamily.orbitron.bold,
  },
});
```

## Example: Update Login Page Title

You can now update your Login page to use these custom fonts. For example:

```tsx
// Logo with Orbitron Bold
<Text className="text-5xl font-orbitron-bold text-primary tracking-widest">
  TaskBlast
</Text>

// Or with Madimi One
<Text className="text-5xl font-madimi text-primary tracking-widest">
  TaskBlast
</Text>
```

## Available Font Classes in Tailwind

- `font-madimi` - Madimi One Regular
- `font-orbitron` - Orbitron Regular (400)
- `font-orbitron-medium` - Orbitron Medium (500)
- `font-orbitron-semibold` - Orbitron SemiBold (600)
- `font-orbitron-bold` - Orbitron Bold (700)
- `font-orbitron-extrabold` - Orbitron ExtraBold (800)
- `font-orbitron-black` - Orbitron Black (900)

## Font Loading

Fonts are automatically loaded in `app/_layout.tsx` using `expo-font`. The splash screen will remain visible until fonts are loaded.

## Restart Your App

After installing fonts, restart your development server:

```bash
npx expo start --clear
```

Then reload your app to see the new fonts!
