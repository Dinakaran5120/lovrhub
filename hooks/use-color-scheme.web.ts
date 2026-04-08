import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

/**
 * Web version: guards against SSR hydration mismatch by returning 'light'
 * until the client has mounted, then hands off to NativeWind's scheme so
 * programmatic toggles are reflected here too.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { colorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated ? colorScheme : ('light' as const);
}
