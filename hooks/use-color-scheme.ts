import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

/**
 * Wraps NativeWind's useColorScheme so that programmatic toggles
 * (via toggleColorScheme / setColorScheme) are reflected everywhere
 * in the app, not just in components that import from 'nativewind' directly.
 */
export function useColorScheme() {
  const { colorScheme } = useNativeWindColorScheme();
  return colorScheme;
}
