// import { Moon, Sun } from 'lucide-react-native';
// import { useColorScheme } from 'nativewind';
// import { TouchableOpacity } from 'react-native';

// export function ThemeToggle() {
//   const { colorScheme, setColorScheme } = useColorScheme();

//   return (
//     <TouchableOpacity onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}>
//       {colorScheme === 'dark' ? (
//         <Sun className="text-foreground" size={24} />
//       ) : (
//         <Moon className="text-foreground" size={24} />
//       )}
//     </TouchableOpacity>
//   );
// }

import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Rotation: 0° in light mode → 360° in dark mode
  const rotation = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  // Pulse on press: shrink then bounce back
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(rotation, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }, [isDark]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.72, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 200, friction: 7, useNativeDriver: true }),
    ]).start();
    toggleColorScheme();
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        // Subtle pill background that contrasts in both themes
        backgroundColor: isDark ? '#3c3733' : '#f0e4df',
        borderWidth: 1,
        borderColor: isDark ? '#57534e' : '#e8d0c8',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Animated.View style={{ transform: [{ rotate: spin }, { scale }] }}>
        {isDark ? (
          // Sun — warm golden on dark background
          <Sun size={20} color="#fbbf24" />
        ) : (
          // Moon — purple/indigo on light background — never white on white
          <Moon size={20} color="#7c3aed" />
        )}
      </Animated.View>
    </Pressable>
  );
}