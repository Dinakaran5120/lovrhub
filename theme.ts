// theme.ts
import { vars } from "nativewind";

// ============================================================================
// FONT CONFIGURATION
// ============================================================================
// Each theme can define its own font families. Fonts are loaded in _layout.tsx
// using expo-font and referenced via CSS variables in tailwind.config.js.
//
// Font families:
// - heading: Used for h1-h4 headings
// - body: Used for body text, labels, captions
// - mono: Used for code snippets
// ============================================================================

export interface ThemeFonts {
  heading: {
    family: string;
    weights: Record<string, string>; // weight name -> font file key
  };
  body: {
    family: string;
    weights: Record<string, string>;
  };
  mono: {
    family: string;
    weights: Record<string, string>;
  };
}

// Dating app fonts: Poppins for modern, friendly feel
export const themeFonts: ThemeFonts = {
  heading: {
    family: 'Poppins',
    weights: {
      normal: 'Poppins_400Regular',
      medium: 'Poppins_500Medium',
      semibold: 'Poppins_600SemiBold',
      bold: 'Poppins_700Bold',
    },
  },
  body: {
    family: 'Poppins',
    weights: {
      normal: 'Poppins_400Regular',
      medium: 'Poppins_500Medium',
      semibold: 'Poppins_600SemiBold',
    },
  },
  mono: {
    family: 'JetBrainsMono',
    weights: {
      normal: 'JetBrainsMono_400Regular',
      medium: 'JetBrainsMono_500Medium',
    },
  },
};


// LoveHub Design System
// Primary: #E63946
// Secondary: #F7A1C4
// Accent: #FF8C6B
// Background (ALWAYS): #FFF8F5
// Text: #2B2B2B
// Success: #2ECC71
// Warning: #F4C430

export const lightTheme = vars({
  "--radius": "16", // Rounded cards & buttons

  // Core semantic colors - Calm, safe emotional UI
  "--background": "255 248 245", // #FFF8F5 - ALWAYS this color
  "--foreground": "43 43 43", // #2B2B2B - Deep charcoal text

  "--card": "255 255 255", // White cards
  "--card-foreground": "43 43 43",

  "--popover": "255 255 255",
  "--popover-foreground": "43 43 43",

  "--primary": "230 57 70", // #E63946 - Primary red
  "--primary-foreground": "255 255 255",

  "--secondary": "247 161 196", // #F7A1C4 - Secondary pink
  "--secondary-foreground": "43 43 43",

  "--muted": "250 245 243", // Subtle muted
  "--muted-foreground": "120 113 108",

  "--accent": "255 140 107", // #FF8C6B - Accent coral
  "--accent-foreground": "43 43 43",

  "--destructive": "230 57 70", // Same as primary

  "--border": "240 230 225", // Soft borders
  "--input": "250 245 243",
  "--ring": "230 57 70",

  // Custom colors
  "--success": "46 204 113", // #2ECC71
  "--warning": "244 196 48", // #F4C430

  // Chart colors
  "--chart-1": "230 57 70",
  "--chart-2": "247 161 196",
  "--chart-3": "255 140 107",
  "--chart-4": "46 204 113",
  "--chart-5": "244 196 48",

  // Sidebar colors
  "--sidebar": "255 248 245",
  "--sidebar-foreground": "43 43 43",
  "--sidebar-primary": "230 57 70",
  "--sidebar-primary-foreground": "255 255 255",
  "--sidebar-accent": "247 161 196",
  "--sidebar-accent-foreground": "43 43 43",
  "--sidebar-border": "240 230 225",
  "--sidebar-ring": "230 57 70",
});

export const darkTheme = vars({
  "--radius": "16",

  // Dark mode - still calm and safe
  "--background": "28 25 23", // Warm dark
  "--foreground": "250 250 249",

  "--card": "41 37 36",
  "--card-foreground": "250 250 249",

  "--popover": "41 37 36",
  "--popover-foreground": "250 250 249",

  "--primary": "230 57 70", // Keep primary vibrant
  "--primary-foreground": "255 255 255",

  "--secondary": "247 161 196",
  "--secondary-foreground": "43 43 43",

  "--muted": "68 64 60",
  "--muted-foreground": "168 162 158",

  "--accent": "255 140 107",
  "--accent-foreground": "43 43 43",

  "--destructive": "248 113 113",

  "--border": "68 64 60",
  "--input": "68 64 60",
  "--ring": "230 57 70",

  // Custom colors
  "--success": "46 204 113",
  "--warning": "244 196 48",

  // Chart colors
  "--chart-1": "230 57 70",
  "--chart-2": "247 161 196",
  "--chart-3": "255 140 107",
  "--chart-4": "46 204 113",
  "--chart-5": "244 196 48",

  // Sidebar colors
  "--sidebar": "41 37 36",
  "--sidebar-foreground": "250 250 249",
  "--sidebar-primary": "230 57 70",
  "--sidebar-primary-foreground": "255 255 255",
  "--sidebar-accent": "68 64 60",
  "--sidebar-accent-foreground": "247 161 196",
  "--sidebar-border": "68 64 60",
  "--sidebar-ring": "230 57 70",
});