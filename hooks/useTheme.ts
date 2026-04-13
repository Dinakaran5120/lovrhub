import { useColorScheme } from 'nativewind';

export function useTheme() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return {
    isDark,
    bg:        isDark ? '#1c1917' : '#FFF8F5',
    card:      isDark ? '#292524' : '#ffffff',
    cardAlt:   isDark ? '#3f3f46' : '#f5f0ee',
    text:      isDark ? '#fafaf9' : '#2B2B2B',
    textMuted: isDark ? '#a8a29e' : '#78716c',
    border:    isDark ? '#44403c' : '#f0e6e1',
    input:     isDark ? '#1a1a1a' : '#f3f4f6',
    primary:   '#E63946',
    online:    '#2ECC71',
  };
}
