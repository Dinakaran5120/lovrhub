// // ThemeProvider.tsx
// import { useColorScheme } from 'nativewind';
// import { View } from 'react-native';
// import { darkTheme, lightTheme } from '../theme';

// interface ThemeProviderProps {
//   children: React.ReactNode;
// }

// export function ThemeProvider({ children }: ThemeProviderProps) {
//   const { colorScheme } = useColorScheme();

//   const themeVars = colorScheme === 'dark' ? darkTheme : lightTheme;

//   return (
//       <View style={themeVars} className={`${colorScheme} flex-1 bg-background`}>
//         {children}
//       </View>
//   );
// }

import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { darkTheme, lightTheme } from '../theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeVars = isDark ? darkTheme : lightTheme;

  return (
    // style injects CSS variables into the component tree via NativeWind vars()
    // className sets 'dark' or 'light' so dark: prefix classes work on all children
    <View style={[themeVars, { flex: 1 }]} className={isDark ? 'dark' : 'light'}>
      {/* StatusBar lives here so it always matches the active theme */}
      <StatusBar style={isDark ? 'light' : 'dark'} translucent={false} />
      {children}
    </View>
  );
}