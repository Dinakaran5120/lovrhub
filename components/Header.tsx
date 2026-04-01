
// import { useRouter } from "expo-router";
// import {
//   Bell,
//   Crown,
//   Eye,
//   EyeOff,
//   LogOut,
//   Menu,
//   Settings,
//   X,
// } from "lucide-react-native";
// import { useColorScheme } from "nativewind";
// import { useState } from "react";
// import {
//   Modal,
//   Platform,
//   StatusBar as RNStatusBar,
//   Switch,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { LovrHubLogo } from "./LovrHubLogo";

// type HeaderProps = {
//   notificationCount?: number;
//   showNotifications?: boolean;
//   isLoggedIn?: boolean;
// };

// export function Header({
//   notificationCount = 0,
//   showNotifications = true,
//   isLoggedIn = true,
// }: HeaderProps) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isPublic, setIsPublic] = useState(true);
//   const { colorScheme, setColorScheme } = useColorScheme();
//   const router = useRouter();

//   const isDark = colorScheme === "dark";
//   const STATUS_BAR_HEIGHT = Platform.OS === 'android'
//     ? (RNStatusBar.currentHeight ?? 24)
//     : 44;

//   const handleLogout = () => {
//     setMenuOpen(false);
//     router.push("/welcome");
//   };

//   const handleAccountSettings = () => {
//     setMenuOpen(false);
//     router.push("/(tabs)/account");
//   };

//   const handlePremium = () => {
//     setMenuOpen(false);
//     alert("Premium features coming soon! 👑");
//   };

//   return (
//     <>
//       {/* ✅ All layout via inline style, no className for layout */}
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           paddingHorizontal: 24,
//           paddingTop: STATUS_BAR_HEIGHT + 12,
//           paddingBottom: 16,
//           backgroundColor: isDark ? "#1c1917" : "#FFF8F5",
//         }}
//       >
//         {/* Logo */}
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//           <LovrHubLogo size={40} useGradient={true} />
//           <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? "#fafaf9" : "#2B2B2B" }}>
//             LovrHub
//           </Text>
//         </View>

//         {/* Right Actions */}
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
//           {showNotifications && (
//             <TouchableOpacity style={{ position: 'relative' }}>
//               <Bell color={isDark ? "#fafaf9" : "#2B2B2B"} size={24} />
//               {notificationCount > 0 && (
//                 <View
//                   style={{
//                     position: 'absolute',
//                     top: -4,
//                     right: -4,
//                     width: 20,
//                     height: 20,
//                     borderRadius: 10,
//                     backgroundColor: "#E63946",
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
//                     {notificationCount > 9 ? "9+" : notificationCount}
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity onPress={() => setMenuOpen(true)}>
//             <Menu color={isDark ? "#fafaf9" : "#2B2B2B"} size={24} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Hamburger Menu Modal */}
//       <Modal
//         visible={menuOpen}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setMenuOpen(false)}
//       >
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           activeOpacity={1}
//           onPress={() => setMenuOpen(false)}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             style={{
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               right: 0,
//               borderTopLeftRadius: 24,
//               borderTopRightRadius: 24,
//               padding: 24,
//               backgroundColor: isDark ? "#292524" : "#ffffff",
//             }}
//             onPress={(e) => e.stopPropagation()}
//           >
//             {/* Close Button */}
//             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
//               <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? "#fafaf9" : "#2B2B2B" }}>
//                 Menu
//               </Text>
//               <TouchableOpacity onPress={() => setMenuOpen(false)}>
//                 <X color={isDark ? "#fafaf9" : "#2B2B2B"} size={24} />
//               </TouchableOpacity>
//             </View>

//             <View style={{ gap: 12 }}>
//               {/* Theme Toggle */}
//               <View
//                 style={{
//                   flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//                   padding: 16, borderRadius: 16,
//                   backgroundColor: isDark ? "#3f3f46" : "#FFF8F5",
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//                   <View
//                     style={{
//                       width: 40, height: 40, borderRadius: 20,
//                       alignItems: 'center', justifyContent: 'center',
//                       backgroundColor: isDark ? "#E63946" : "#F4C430",
//                     }}
//                   >
//                     <Text style={{ fontSize: 20 }}>{isDark ? '🌙' : '☀️'}</Text>
//                   </View>
//                   <View>
//                     <Text style={{ fontWeight: '600', color: isDark ? "#fafaf9" : "#2B2B2B" }}>
//                       {isDark ? "Dark Mode" : "Light Mode"}
//                     </Text>
//                     <Text style={{ fontSize: 12, color: isDark ? "#a8a29e" : "#78716c" }}>
//                       Switch theme
//                     </Text>
//                   </View>
//                 </View>
//                 <Switch
//                   value={isDark}
//                   onValueChange={(value) => setColorScheme(value ? "dark" : "light")}
//                   trackColor={{ false: "#d4d4d8", true: "#E63946" }}
//                   thumbColor="#ffffff"
//                 />
//               </View>

//               {/* Account Settings */}
//               <TouchableOpacity
//                 style={{
//                   flexDirection: 'row', alignItems: 'center', gap: 12,
//                   padding: 16, borderRadius: 16,
//                   backgroundColor: isDark ? "#3f3f46" : "#FFF8F5",
//                 }}
//                 onPress={handleAccountSettings}
//               >
//                 <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FF8C6B" }}>
//                   <Settings color="#ffffff" size={20} />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={{ fontWeight: '600', color: isDark ? "#fafaf9" : "#2B2B2B" }}>Account Settings</Text>
//                   <Text style={{ fontSize: 12, color: isDark ? "#a8a29e" : "#78716c" }}>Manage your account</Text>
//                 </View>
//               </TouchableOpacity>

//               {/* Profile Visibility */}
//               <View
//                 style={{
//                   flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//                   padding: 16, borderRadius: 16,
//                   backgroundColor: isDark ? "#3f3f46" : "#FFF8F5",
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//                   <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#2ECC71" }}>
//                     {isPublic ? <Eye color="#ffffff" size={20} /> : <EyeOff color="#ffffff" size={20} />}
//                   </View>
//                   <View>
//                     <Text style={{ fontWeight: '600', color: isDark ? "#fafaf9" : "#2B2B2B" }}>Profile Visibility</Text>
//                     <Text style={{ fontSize: 12, color: isDark ? "#a8a29e" : "#78716c" }}>{isPublic ? "Public" : "Private"}</Text>
//                   </View>
//                 </View>
//                 <Switch
//                   value={isPublic}
//                   onValueChange={setIsPublic}
//                   trackColor={{ false: "#d4d4d8", true: "#2ECC71" }}
//                   thumbColor="#ffffff"
//                 />
//               </View>

//               {/* Switch to Premium */}
//               <TouchableOpacity
//                 style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: "#F4C430" }}
//                 onPress={handlePremium}
//               >
//                 <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#ffffff" }}>
//                   <Crown color="#F4C430" size={20} />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={{ fontWeight: 'bold', color: 'white' }}>Switch to Premium</Text>
//                   <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>Unlock exclusive features</Text>
//                 </View>
//               </TouchableOpacity>

//               {/* Logout */}
//               {isLoggedIn && (
//                 <TouchableOpacity
//                   style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: "#E63946" }}
//                   onPress={handleLogout}
//                 >
//                   <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#ffffff" }}>
//                     <LogOut color="#E63946" size={20} />
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={{ fontWeight: 'bold', color: 'white' }}>Logout</Text>
//                     <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>Sign out of your account</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             </View>

//             <View style={{ height: 32 }} />
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// }

import { useRouter } from "expo-router";
import {
  Bell,
  Crown,
  Eye,
  EyeOff,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Modal,
  Platform,
  StatusBar as RNStatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LovrHubLogo } from "./LovrHubLogo";

type HeaderProps = {
  notificationCount?: number;
  showNotifications?: boolean;
  isLoggedIn?: boolean;
};

export function Header({
  notificationCount = 0,
  showNotifications = true,
  isLoggedIn = true,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const { colorScheme, toggleColorScheme } = useColorScheme(); // ✅ toggleColorScheme instead of setColorScheme
  const router = useRouter();

  const isDark = colorScheme === "dark";
  const STATUS_BAR_HEIGHT = Platform.OS === 'android'
    ? (RNStatusBar.currentHeight ?? 24)
    : 44;

  const handleLogout = () => {
    setMenuOpen(false);
    router.push("/welcome");
  };

  const handleAccountSettings = () => {
    setMenuOpen(false);
    router.push("/(tabs)/account");
  };

  const handlePremium = () => {
    setMenuOpen(false);
    alert("Premium features coming soon! 👑");
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: STATUS_BAR_HEIGHT + 12,
          paddingBottom: 16,
          backgroundColor: isDark ? "#1c1917" : "#FFF8F5",
        }}
      >
        {/* Logo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <LovrHubLogo size={40} useGradient={true} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? "#fafaf9" : "#2B2B2B" }}>
            LovrHub
          </Text>
        </View>

        {/* Right Actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {showNotifications && (
            <TouchableOpacity style={{ position: 'relative' }}>
              <Bell color={isDark ? "#fafaf9" : "#2B2B2B"} size={24} />
              {notificationCount > 0 && (
                <View
                  style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 20, height: 20, borderRadius: 10,
                    backgroundColor: "#E63946",
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Menu color={isDark ? "#fafaf9" : "#2B2B2B"} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              borderTopLeftRadius: 24, borderTopRightRadius: 24,
              padding: 24,
              backgroundColor: isDark ? "#292524" : "#ffffff",
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? "#fafaf9" : "#2B2B2B" }}>
                Menu
              </Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <X color={isDark ? "#fafaf9" : "#2B2B2B"} size={24} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 12 }}>

              {/* Theme Toggle */}
              <View
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  padding: 16, borderRadius: 16,
                  backgroundColor: isDark ? "#3f3f46" : "#FFF8F5",
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isDark ? "#E63946" : "#F4C430",
                  }}>
                    <Text style={{ fontSize: 20 }}>{isDark ? '🌙' : '☀️'}</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: '600', color: isDark ? "#fafaf9" : "#2B2B2B" }}>
                      {isDark ? "Dark Mode" : "Light Mode"}
                    </Text>
                    <Text style={{ fontSize: 12, color: isDark ? "#a8a29e" : "#78716c" }}>
                      Switch theme
                    </Text>
                  </View>
                </View>
                {/* ✅ FIXED: toggleColorScheme instead of setColorScheme */}
                <Switch
                  value={isDark}
                  onValueChange={toggleColorScheme}
                  trackColor={{ false: "#d4d4d8", true: "#E63946" }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Account Settings */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  padding: 16, borderRadius: 16,
                  backgroundColor: isDark ? "#3f3f46" : "#FFF8F5",
                }}
                onPress={handleAccountSettings}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FF8C6B" }}>
                  <Settings color="#ffffff" size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: isDark ? "#fafaf9" : "#2B2B2B" }}>Account Settings</Text>
                  <Text style={{ fontSize: 12, color: isDark ? "#a8a29e" : "#78716c" }}>Manage your account</Text>
                </View>
              </TouchableOpacity>

              {/* Profile Visibility */}
              <View
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  padding: 16, borderRadius: 16,
                  backgroundColor: isDark ? "#3f3f46" : "#FFF8F5",
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#2ECC71" }}>
                    {isPublic ? <Eye color="#ffffff" size={20} /> : <EyeOff color="#ffffff" size={20} />}
                  </View>
                  <View>
                    <Text style={{ fontWeight: '600', color: isDark ? "#fafaf9" : "#2B2B2B" }}>Profile Visibility</Text>
                    <Text style={{ fontSize: 12, color: isDark ? "#a8a29e" : "#78716c" }}>{isPublic ? "Public" : "Private"}</Text>
                  </View>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ false: "#d4d4d8", true: "#2ECC71" }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Switch to Premium */}
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: "#F4C430" }}
                onPress={handlePremium}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#ffffff" }}>
                  <Crown color="#F4C430" size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>Switch to Premium</Text>
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>Unlock exclusive features</Text>
                </View>
              </TouchableOpacity>

              {/* Logout */}
              {isLoggedIn && (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: "#E63946" }}
                  onPress={handleLogout}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#ffffff" }}>
                    <LogOut color="#E63946" size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>Logout</Text>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>Sign out of your account</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ height: 32 }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}