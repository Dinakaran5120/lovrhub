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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../reanimated';

// StatusBar is managed inside ThemeProvider so it automatically
// reflects light/dark theme changes without a separate import here.

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
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