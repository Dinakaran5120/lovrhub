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
import { TouchableOpacity } from 'react-native';

export function ThemeToggle() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}  // ✅ use built-in toggle instead of manual set
      style={{
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {isDark ? (
        <Sun size={22} color="#ffffff" />
      ) : (
        <Moon size={22} color="#ffffff" />
      )}
    </TouchableOpacity>
  );
}