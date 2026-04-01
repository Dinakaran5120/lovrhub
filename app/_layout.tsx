// import { ThemeProvider } from '@/components/ThemeProvider';
// import '@/global.css';
// import { Stack } from 'expo-router';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import '../reanimated';


// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <SafeAreaProvider>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="(tabs)" />
//         </Stack>
//       </SafeAreaProvider>
//     </ThemeProvider>
//   );
// }

// import '@/global.css';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import '../reanimated';

// export default function RootLayout() {
//   return (
    
//     <SafeAreaProvider>
//       <StatusBar style="auto" />
//       <Stack screenOptions={{ headerShown: false }} />
//     </SafeAreaProvider>
   
//   );
// }



// import '@/global.css';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import '../reanimated';

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <StatusBar style="auto" />
//       <Stack screenOptions={{ headerShown: false }}>
//         {/* Auth Screens */}
//         <Stack.Screen name="welcome" />
//         <Stack.Screen name="login" />
//         <Stack.Screen name="signup" />
//         <Stack.Screen name="signup-phone" />
//         <Stack.Screen name="otp-verify" />
//         <Stack.Screen name="profile-setup" />

//         {/* Main App */}
//         <Stack.Screen name="(tabs)" />

//         {/* Extra screens */}
//         <Stack.Screen name="chat-detail" />
//       </Stack>
//     </SafeAreaProvider>
//   );
// }


import { ThemeProvider } from '@/components/ThemeProvider';
import '@/global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { vars } from "nativewind";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../reanimated';

vars({
  "--background": "17 17 17",
  "--foreground": "255 255 255",
  "--card": "28 28 30",
  "--card-foreground": "255 255 255",
  "--primary": "230 57 70",
  "--primary-foreground": "255 255 255",
  "--muted": "44 44 46",
  "--muted-foreground": "156 163 175",
  "--accent": "230 57 70",
  "--accent-foreground": "255 255 255",
  "--border": "63 63 70",
  "--input": "63 63 70",
  "--ring": "230 57 70",
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <StatusBar translucent={false} style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="signup-phone" />
        <Stack.Screen name="otp-verify" />
        <Stack.Screen name="profile-setup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat-detail" />
      </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}