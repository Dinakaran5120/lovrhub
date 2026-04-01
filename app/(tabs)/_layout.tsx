// import { Tabs } from 'expo-router';
// import { Compass, Heart, MessageCircle, Upload, User } from 'lucide-react-native';
// import { cssInterop, useColorScheme } from 'nativewind';

// // Enable className styling for icons
// cssInterop(Compass, { className: { target: 'style', nativeStyleToProp: { color: true } } });
// cssInterop(Heart, { className: { target: 'style', nativeStyleToProp: { color: true } } });
// cssInterop(Upload, { className: { target: 'style', nativeStyleToProp: { color: true } } });
// cssInterop(MessageCircle, { className: { target: 'style', nativeStyleToProp: { color: true } } });
// cssInterop(User, { className: { target: 'style', nativeStyleToProp: { color: true } } });

// export default function TabsLayout() {
//   const { colorScheme } = useColorScheme();
//   const isDark = colorScheme === 'dark';

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: isDark ? '#1c1917' : '#ffffff',
//           borderTopColor: isDark ? '#44403c' : '#fecdd3',
//           borderTopWidth: 1,
//           paddingTop: 8,
//           paddingBottom: 8,
//           height: 65,
//         },
//         tabBarActiveTintColor: isDark ? '#fb7185' : '#e11d48',
//         tabBarInactiveTintColor: isDark ? '#a8a29e' : '#9ca3af',
//         tabBarLabelStyle: {
//           fontSize: 11,
//           fontWeight: '600',
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Discover',
//           tabBarIcon: ({ focused }) => (
//             <Heart className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="inbox"
//         options={{
//           title: 'Inbox',
//           tabBarIcon: ({ focused }) => (
//             <MessageCircle className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="upload"
//         options={{
//           title: 'Upload',
//           tabBarIcon: ({ focused }) => (
//             <Upload className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ focused }) => (
//             <Compass className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="account"
//         options={{
//           title: 'Account',
//           tabBarIcon: ({ focused }) => (
//             <User className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }


import { Tabs } from 'expo-router';
import { Compass, Heart, MessageCircle, Upload, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#1c1917' : '#ffffff',
          borderTopColor: isDark ? '#44403c' : '#fecdd3',
          borderTopWidth: 1,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: isDark ? '#fb7185' : '#e11d48',
        tabBarInactiveTintColor: isDark ? '#a8a29e' : '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, size }) => <Upload color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}