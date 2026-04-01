// import {
//   ChevronRightIcon,
//   CrownIcon,
//   FileTextIcon,
//   HeartIcon,
//   HelpCircleIcon,
//   LockIcon,
//   LogOutIcon,
//   MenuIcon,
//   MessageCircleIcon,
//   MoonIcon,
//   SettingsIcon,
//   ShieldIcon,
//   StarIcon,
//   StyledImage,
//   StyledModal,
//   StyledSafeAreaView,
//   StyledText,
//   StyledTouchableOpacity,
//   StyledView,
//   Trash2Icon,
//   UnlockIcon,
//   UserIcon
// } from "@/components/NativeWind";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { useRouter } from "expo-router";
// import { useColorScheme } from "nativewind";
// import { useState } from "react";
// import {
//   ScrollView,
//   Switch
// } from "react-native";

// export default function AccountScreen() {
//   const router = useRouter();
//   const { colorScheme } = useColorScheme();
//   const isDark = colorScheme === "dark";
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [settingsVisible, setSettingsVisible] = useState(false);
//   const [deactivateVisible, setDeactivateVisible] = useState(false);
//   const [blocklistVisible, setBlocklistVisible] = useState(false);
//   const [unblockVisible, setUnblockVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<any>(null);
//   const [selectedReason, setSelectedReason] = useState<string | null>(null);
//   const [profileVisible, setProfileVisible] = useState(true);
//   const [premiumVisible, setPremiumVisible] = useState(false);

//   // Mock user data
//   const user = {
//     name: "Sarah Johnson",
//     age: 28,
//     bio: "Coffee lover ☕ | Travel enthusiast ✈️ | Dog mom 🐕",
//     avatar:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
//     location: "New York, NY",
//     verified: true,
//   };

//   // Mock stats
//   const stats = [
//     { icon: HeartIcon, label: "Matches", value: "42", color: "#fb7185" },
//     { icon: MessageCircleIcon, label: "Chats", value: "18", color: "#a855f7" },
//     { icon: StarIcon, label: "Likes", value: "127", color: "#fbbf24" },
//   ];

//   // Mock blocked users
//   const blockedUsers = [
//     {
//       id: 1,
//       name: "John Doe",
//       avatar:
//         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
//     },
//     {
//       id: 2,
//       name: "Mike Smith",
//       avatar:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
//     },
//     {
//       id: 3,
//       name: "David Lee",
//       avatar:
//         "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
//     },
//   ];

//   const deactivateReasons = [
//     { id: "partner", label: "I got partner" },
//     { id: "hacked", label: "Account hacked" },
//     { id: "break", label: "Need a break" },
//     { id: "not_interested", label: "Not interested" },
//   ];

//   const handleUnblock = () => {
//     setUnblockVisible(false);
//     setSelectedUser(null);
//     // In real app: API call to unblock user
//   };

//   const handleDeactivate = () => {
//     setDeactivateVisible(false);
//     setSelectedReason(null);
//     // In real app: API call to deactivate account
//   };

//   const handleDeletePermanently = () => {
//     setDeactivateVisible(false);
//     setSelectedReason(null);
//     // In real app: API call to delete account permanently
//   };

//   return (
//     <StyledSafeAreaView className="flex-1 bg-background">
//       {/* Header */}
//       <StyledView className="flex-row items-center justify-between px-6 py-4 border-b border-border">
//         <StyledText className="text-2xl font-bold text-foreground">Account</StyledText>
//         <StyledTouchableOpacity onPress={() => setMenuVisible(true)}>
//           <MenuIcon className="text-foreground" size={24} />
//         </StyledTouchableOpacity>
//       </StyledView>

//       <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
//         {/* Profile Card */}
//         <StyledView className="p-6">
//           <StyledView
//             style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//             className="rounded-2xl p-6 shadow-sm"
//           >
//             <StyledView className="items-center">
//               <StyledImage
//                 source={{ uri: user.avatar }}
//                 className="w-24 h-24 rounded-full"
//               />
//               <StyledView className="flex-row items-center mt-4">
//                 <StyledText className="text-2xl font-bold text-foreground">
//                   {user.name}
//                 </StyledText>
//                 {user.verified && (
//                   <StyledView className="ml-2 bg-primary rounded-full p-1">
//                     <StarIcon className="text-white" size={14} fill="#fff" />
//                   </StyledView>
//                 )}
//               </StyledView>
//               <StyledText className="text-muted-foreground mt-1">
//                 {user.age} • {user.location}
//               </StyledText>
//               <StyledText className="text-center text-foreground mt-3">
//                 {user.bio}
//               </StyledText>
//             </StyledView>
//           </StyledView>
//         </StyledView>

//         {/* Stats */}
//         <StyledView className="px-6 mb-6">
//           <StyledView className="flex-row gap-3">
//             {stats.map((stat, index) => (
//               <StyledView
//                 key={index}
//                 style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//                 className="flex-1 rounded-xl p-4 items-center shadow-sm"
//               >
//                 <stat.icon color={stat.color} size={24} />
//                 <StyledText className="text-2xl font-bold text-foreground mt-2">
//                   {stat.value}
//                 </StyledText>
//                 <StyledText className="text-xs text-muted-foreground mt-1">
//                   {stat.label}
//                 </StyledText>
//               </StyledView>
//             ))}
//           </StyledView>
//         </StyledView>

//         {/* Quick Actions */}
//         <StyledView className="px-6 mb-6">
//           <StyledText className="text-lg font-semibold text-foreground mb-3">
//             Quick Actions
//           </StyledText>
//           <StyledView className="gap-2">
//             <StyledTouchableOpacity onPress={() => router.push("/profile-setup")}>
//               <StyledView
//                 style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//                 className="rounded-xl p-4 flex-row items-center justify-between shadow-sm"
//               >
//                 <StyledView className="flex-row items-center gap-3">
//                   <UserIcon className="text-primary" size={20} />
//                   <StyledText className="text-foreground font-medium">
//                     Edit Profile
//                   </StyledText>
//                 </StyledView>
//                 <ChevronRightIcon className="text-muted-foreground" size={20} />
//               </StyledView>
//             </StyledTouchableOpacity>

//             <StyledTouchableOpacity onPress={() => setSettingsVisible(true)}>
//               <StyledView
//                 style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//                 className="rounded-xl p-4 flex-row items-center justify-between shadow-sm"
//               >
//                 <StyledView className="flex-row items-center gap-3">
//                   <SettingsIcon className="text-primary" size={20} />
//                   <StyledText className="text-foreground font-medium">
//                     Account Settings
//                   </StyledText>
//                 </StyledView>
//                 <ChevronRightIcon className="text-muted-foreground" size={20} />
//               </StyledView>
//             </StyledTouchableOpacity>
//           </StyledView>
//         </StyledView>
//       </ScrollView>

//       {/* Menu Modal */}
//       <StyledModal
//         visible={menuVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setMenuVisible(false)}
//       >
//         <StyledTouchableOpacity
//           activeOpacity={1}
//           onPress={() => setMenuVisible(false)}
//           className="flex-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <StyledView className="flex-1 justify-end">
//             <StyledTouchableOpacity
//               activeOpacity={1}
//               onPress={(e) => e.stopPropagation()}
//             >
//               <StyledView
//                 style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//                 className="rounded-t-3xl p-6"
//               >
//                 <StyledView className="w-12 h-1 bg-border rounded-full self-center mb-6" />

//                 <StyledView className="gap-2">
//                   <StyledTouchableOpacity
//                     onPress={() => {
//                       setMenuVisible(false);
//                       setPremiumVisible(true);
//                     }}
//                   >
//                     <StyledView className="flex-row items-center gap-3 p-4 rounded-xl active:bg-muted">
//                       <CrownIcon className="text-primary" size={22} />
//                       <StyledText className="text-foreground font-medium flex-1">
//                         Switch to Premium
//                       </StyledText>
//                       <ChevronRightIcon
//                         className="text-muted-foreground"
//                         size={20}
//                       />
//                     </StyledView>
//                   </StyledTouchableOpacity>

//                   <StyledTouchableOpacity onPress={() => setMenuVisible(false)}>
//                     <StyledView className="flex-row items-center gap-3 p-4 rounded-xl active:bg-muted">
//                       <FileTextIcon className="text-foreground" size={22} />
//                       <StyledText className="text-foreground font-medium flex-1">
//                         Privacy Policy
//                       </StyledText>
//                       <ChevronRightIcon
//                         className="text-muted-foreground"
//                         size={20}
//                       />
//                     </StyledView>
//                   </StyledTouchableOpacity>

//                   <StyledTouchableOpacity onPress={() => setMenuVisible(false)}>
//                     <StyledView className="flex-row items-center gap-3 p-4 rounded-xl active:bg-muted">
//                       <HelpCircleIcon className="text-foreground" size={22} />
//                       <StyledText className="text-foreground font-medium flex-1">
//                         Help & Support
//                       </StyledText>
//                       <ChevronRightIcon
//                         className="text-muted-foreground"
//                         size={20}
//                       />
//                     </StyledView>
//                   </StyledTouchableOpacity>

//                   <StyledView className="h-px bg-border my-2" />

//                   <StyledTouchableOpacity onPress={() => setMenuVisible(false)}>
//                     <StyledView className="flex-row items-center gap-3 p-4 rounded-xl active:bg-muted">
//                       <LogOutIcon className="text-destructive" size={22} />
//                       <StyledText className="text-destructive font-medium flex-1">
//                         Logout
//                       </StyledText>
//                     </StyledView>
//                   </StyledTouchableOpacity>
//                 </StyledView>
//               </StyledView>
//             </StyledTouchableOpacity>
//           </StyledView>
//         </StyledTouchableOpacity>
//       </StyledModal>

//       {/* Premium Coming Soon Modal */}
//       <StyledModal
//         visible={premiumVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setPremiumVisible(false)}
//       >
//         <StyledTouchableOpacity
//           activeOpacity={1}
//           onPress={() => setPremiumVisible(false)}
//           className="flex-1 items-center justify-center"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <StyledTouchableOpacity
//             activeOpacity={1}
//             onPress={(e) => e.stopPropagation()}
//           >
//             <StyledView
//               style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//               className="mx-6 rounded-2xl p-6 items-center"
//             >
//               <CrownIcon className="text-primary mb-4" size={48} />
//               <StyledText className="text-2xl font-bold text-foreground mb-2">
//                 Coming Soon!
//               </StyledText>
//               <StyledText className="text-center text-muted-foreground mb-6">
//                 Premium features are on the way. Stay tuned!
//               </StyledText>
//               <StyledTouchableOpacity
//                 onPress={() => setPremiumVisible(false)}
//                 style={{ backgroundColor: isDark ? "#e63946" : "#e63946" }}
//                 className="w-full py-3 rounded-xl"
//               >
//                 <StyledText className="text-white text-center font-semibold">
//                   Got it
//                 </StyledText>
//               </StyledTouchableOpacity>
//             </StyledView>
//           </StyledTouchableOpacity>
//         </StyledTouchableOpacity>
//       </StyledModal>

//       {/* Account Settings Modal */}
//       <StyledModal
//         visible={settingsVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setSettingsVisible(false)}
//       >
//         <StyledTouchableOpacity
//           activeOpacity={1}
//           onPress={() => setSettingsVisible(false)}
//           className="flex-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <StyledView className="flex-1 justify-end">
//             <StyledTouchableOpacity
//               activeOpacity={1}
//               onPress={(e) => e.stopPropagation()}
//             >
//               <StyledView
//                 style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//                 className="rounded-t-3xl p-6 max-h-[80%]"
//               >
//                 <StyledView className="w-12 h-1 bg-border rounded-full self-center mb-6" />
//                 <StyledText className="text-2xl font-bold text-foreground mb-6">
//                   Account Settings
//                 </StyledText>

//                 <ScrollView showsVerticalScrollIndicator={false}>
//                   <StyledView className="gap-4">
//                     {/* Profile Visibility */}
//                     <StyledView
//                       className="flex-row items-center justify-between p-4 rounded-xl"
//                       style={{
//                         backgroundColor: isDark ? "#1c1917" : "#fafafa",
//                       }}
//                     >
//                       <StyledView className="flex-row items-center gap-3 flex-1">
//                         <ShieldIcon className="text-foreground" size={22} />
//                         <StyledView className="flex-1">
//                           <StyledText className="text-foreground font-medium">
//                             Profile Visibility
//                           </StyledText>
//                           <StyledText className="text-sm text-muted-foreground">
//                             Show profile to others
//                           </StyledText>
//                         </StyledView>
//                       </StyledView>
//                       <Switch
//                         value={profileVisible}
//                         onValueChange={setProfileVisible}
//                         trackColor={{
//                           false: isDark ? "#44403c" : "#e7e5e4",
//                           true: "#fb7185",
//                         }}
//                         thumbColor="#ffffff"
//                       />
//                     </StyledView>

//                     {/* Dark/Light Mode */}
//                     <StyledView
//                       className="flex-row items-center justify-between p-4 rounded-xl"
//                       style={{
//                         backgroundColor: isDark ? "#1c1917" : "#fafafa",
//                       }}
//                     >
//                       <StyledView className="flex-row items-center gap-3 flex-1">
//                         <MoonIcon className="text-foreground" size={22} />
//                         <StyledView className="flex-1">
//                           <StyledText className="text-foreground font-medium">
//                             Theme
//                           </StyledText>
//                           <StyledText className="text-sm text-muted-foreground">
//                             Light / Dark mode
//                           </StyledText>
//                         </StyledView>
//                       </StyledView>
//                       <ThemeToggle />
//                     </StyledView>

//                     {/* Blocklist */}
//                     <StyledTouchableOpacity
//                       onPress={() => {
//                         setSettingsVisible(false);
//                         setBlocklistVisible(true);
//                       }}
//                     >
//                       <StyledView
//                         className="flex-row items-center justify-between p-4 rounded-xl"
//                         style={{
//                           backgroundColor: isDark ? "#1c1917" : "#fafafa",
//                         }}
//                       >
//                         <StyledView className="flex-row items-center gap-3 flex-1">
//                           <LockIcon className="text-foreground" size={22} />
//                           <StyledView className="flex-1">
//                             <StyledText className="text-foreground font-medium">
//                               Blocklist
//                             </StyledText>
//                             <StyledText className="text-sm text-muted-foreground">
//                               Manage blocked users
//                             </StyledText>
//                           </StyledView>
//                         </StyledView>
//                         <ChevronRightIcon
//                           className="text-muted-foreground"
//                           size={20}
//                         />
//                       </StyledView>
//                     </StyledTouchableOpacity>

//                     {/* Deactivate Account */}
//                     <StyledTouchableOpacity
//                       onPress={() => {
//                         setSettingsVisible(false);
//                         setDeactivateVisible(true);
//                       }}
//                     >
//                       <StyledView
//                         className="flex-row items-center justify-between p-4 rounded-xl"
//                         style={{
//                           backgroundColor: isDark ? "#450a0a" : "#fee2e2",
//                         }}
//                       >
//                         <StyledView className="flex-row items-center gap-3 flex-1">
//                           <Trash2Icon className="text-destructive" size={22} />
//                           <StyledView className="flex-1">
//                             <StyledText className="text-destructive font-medium">
//                               Deactivate Account
//                             </StyledText>
//                             <StyledText
//                               className="text-sm"
//                               style={{ color: isDark ? "#fca5a5" : "#991b1b" }}
//                             >
//                               Temporarily disable account
//                             </StyledText>
//                           </StyledView>
//                         </StyledView>
//                         <ChevronRightIcon
//                           color={isDark ? "#fca5a5" : "#991b1b"}
//                           size={20}
//                         />
//                       </StyledView>
//                     </StyledTouchableOpacity>
//                   </StyledView>
//                 </ScrollView>
//               </StyledView>
//             </StyledTouchableOpacity>
//           </StyledView>
//         </StyledTouchableOpacity>
//       </StyledModal>

//       {/* Deactivate Modal */}
//       <StyledModal
//         visible={deactivateVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => {
//           setDeactivateVisible(false);
//           setSelectedReason(null);
//         }}
//       >
//         <StyledTouchableOpacity
//           activeOpacity={1}
//           onPress={() => {
//             setDeactivateVisible(false);
//             setSelectedReason(null);
//           }}
//           className="flex-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <StyledView className="flex-1 justify-end">
//             <StyledTouchableOpacity
//               activeOpacity={1}
//               onPress={(e) => e.stopPropagation()}
//             >
//               <StyledView
//                 style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//                 className="rounded-t-3xl p-6"
//               >
//                 <StyledView className="w-12 h-1 bg-border rounded-full self-center mb-6" />
//                 <StyledText className="text-2xl font-bold text-foreground mb-2">
//                   Deactivate Account
//                 </StyledText>
//                 <StyledText className="text-muted-foreground mb-6">
//                   Please select a reason:
//                 </StyledText>

//                 <StyledView className="gap-3 mb-6">
//                   {deactivateReasons.map((reason) => (
//                     <StyledTouchableOpacity
//                       key={reason.id}
//                       onPress={() => setSelectedReason(reason.id)}
//                     >
//                       <StyledView
//                         className="p-4 rounded-xl border-2 flex-row items-center justify-between"
//                         style={{
//                           backgroundColor:
//                             selectedReason === reason.id
//                               ? isDark
//                                 ? "#450a0a"
//                                 : "#fee2e2"
//                               : isDark
//                                 ? "#1c1917"
//                                 : "#fafafa",
//                           borderColor:
//                             selectedReason === reason.id
//                               ? "#e63946"
//                               : "transparent",
//                         }}
//                       >
//                         <StyledText
//                           className={
//                             selectedReason === reason.id
//                               ? "text-destructive font-medium"
//                               : "text-foreground"
//                           }
//                         >
//                           {reason.label}
//                         </StyledText>
//                         {selectedReason === reason.id && (
//                           <StyledView className="w-5 h-5 rounded-full bg-destructive items-center justify-center">
//                             <StyledText className="text-white text-xs font-bold">
//                               ✓
//                             </StyledText>
//                           </StyledView>
//                         )}
//                       </StyledView>
//                     </StyledTouchableOpacity>
//                   ))}
//                 </StyledView>

//                 <StyledView className="gap-3">
//                   <StyledTouchableOpacity
//                     onPress={handleDeletePermanently}
//                     disabled={!selectedReason}
//                     style={{
//                       backgroundColor: selectedReason
//                         ? "#991b1b"
//                         : isDark
//                           ? "#44403c"
//                           : "#e7e5e4",
//                       opacity: selectedReason ? 1 : 0.5,
//                     }}
//                     className="py-3 rounded-xl"
//                   >
//                     <StyledText className="text-white text-center font-semibold">
//                       Delete Permanently
//                     </StyledText>
//                   </StyledTouchableOpacity>

//                   <StyledTouchableOpacity
//                     onPress={handleDeactivate}
//                     style={{ backgroundColor: isDark ? "#e63946" : "#e63946" }}
//                     className="py-3 rounded-xl"
//                   >
//                     <StyledText className="text-white text-center font-semibold">
//                       Deactivate Account
//                     </StyledText>
//                   </StyledTouchableOpacity>

//                   <StyledTouchableOpacity
//                     onPress={() => {
//                       setDeactivateVisible(false);
//                       setSelectedReason(null);
//                     }}
//                     style={{ backgroundColor: isDark ? "#44403c" : "#e7e5e4" }}
//                     className="py-3 rounded-xl"
//                   >
//                     <StyledText className="text-foreground text-center font-semibold">
//                       Cancel
//                     </StyledText>
//                   </StyledTouchableOpacity>
//                 </StyledView>
//               </StyledView>
//             </StyledTouchableOpacity>
//           </StyledView>
//         </StyledTouchableOpacity>
//       </StyledModal>

//       {/* Blocklist Modal */}
//       <StyledModal
//         visible={blocklistVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setBlocklistVisible(false)}
//       >
//         <StyledTouchableOpacity
//           activeOpacity={1}
//           onPress={() => setBlocklistVisible(false)}
//           className="flex-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <StyledView className="flex-1 justify-end">
//             <StyledTouchableOpacity
//               activeOpacity={1}
//               onPress={(e) => e.stopPropagation()}
//             >
//               <StyledView
//                 style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//                 className="rounded-t-3xl p-6 max-h-[70%]"
//               >
//                 <StyledView className="w-12 h-1 bg-border rounded-full self-center mb-6" />
//                 <StyledText className="text-2xl font-bold text-foreground mb-6">
//                   Blocked Users
//                 </StyledText>

//                 <ScrollView showsVerticalScrollIndicator={false}>
//                   <StyledView className="gap-3">
//                     {blockedUsers.map((user) => (
//                       <StyledTouchableOpacity
//                         key={user.id}
//                         onPress={() => {
//                           setSelectedUser(user);
//                           setBlocklistVisible(false);
//                           setUnblockVisible(true);
//                         }}
//                       >
//                         <StyledView
//                           className="flex-row items-center gap-3 p-4 rounded-xl"
//                           style={{
//                             backgroundColor: isDark ? "#1c1917" : "#fafafa",
//                           }}
//                         >
//                           <StyledImage
//                             source={{ uri: user.avatar }}
//                             className="w-12 h-12 rounded-full"
//                           />
//                           <StyledText className="text-foreground font-medium flex-1">
//                             {user.name}
//                           </StyledText>
//                           <ChevronRightIcon
//                             className="text-muted-foreground"
//                             size={20}
//                           />
//                         </StyledView>
//                       </StyledTouchableOpacity>
//                     ))}
//                   </StyledView>
//                 </ScrollView>

//                 <StyledTouchableOpacity
//                   onPress={() => setBlocklistVisible(false)}
//                   style={{ backgroundColor: isDark ? "#44403c" : "#e7e5e4" }}
//                   className="py-3 rounded-xl mt-6"
//                 >
//                   <StyledText className="text-foreground text-center font-semibold">
//                     Close
//                   </StyledText>
//                 </StyledTouchableOpacity>
//               </StyledView>
//             </StyledTouchableOpacity>
//           </StyledView>
//         </StyledTouchableOpacity>
//       </StyledModal>

//       {/* Unblock User Modal */}
//       <StyledModal
//         visible={unblockVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => {
//           setUnblockVisible(false);
//           setSelectedUser(null);
//         }}
//       >
//         <StyledTouchableOpacity
//           activeOpacity={1}
//           onPress={() => {
//             setUnblockVisible(false);
//             setSelectedUser(null);
//           }}
//           className="flex-1 items-center justify-center"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <StyledTouchableOpacity
//             activeOpacity={1}
//             onPress={(e) => e.stopPropagation()}
//           >
//             <StyledView
//               style={{ backgroundColor: isDark ? "#292524" : "#ffffff" }}
//               className="mx-6 rounded-2xl p-6"
//             >
//               {selectedUser && (
//                 <>
//                   <StyledView className="items-center mb-6">
//                     <StyledImage
//                       source={{ uri: selectedUser.avatar }}
//                       className="w-20 h-20 rounded-full mb-3"
//                     />
//                     <StyledText className="text-xl font-bold text-foreground">
//                       {selectedUser.name}
//                     </StyledText>
//                     <StyledText className="text-muted-foreground mt-1">
//                       Do you want to unblock this user?
//                     </StyledText>
//                   </StyledView>

//                   <StyledView className="gap-3">
//                     <StyledTouchableOpacity
//                       onPress={handleUnblock}
//                       style={{
//                         backgroundColor: isDark ? "#e63946" : "#e63946",
//                       }}
//                       className="py-3 rounded-xl flex-row items-center justify-center gap-2"
//                     >
//                       <UnlockIcon className="text-white" size={18} />
//                       <StyledText className="text-white text-center font-semibold">
//                         Unblock
//                       </StyledText>
//                     </StyledTouchableOpacity>

//                     <StyledTouchableOpacity
//                       onPress={() => {
//                         setUnblockVisible(false);
//                         setSelectedUser(null);
//                       }}
//                       style={{
//                         backgroundColor: isDark ? "#44403c" : "#e7e5e4",
//                       }}
//                       className="py-3 rounded-xl"
//                     >
//                       <StyledText className="text-foreground text-center font-semibold">
//                         Cancel
//                       </StyledText>
//                     </StyledTouchableOpacity>
//                   </StyledView>
//                 </>
//               )}
//             </StyledView>
//           </StyledTouchableOpacity>
//         </StyledTouchableOpacity>
//       </StyledModal>
//     </StyledSafeAreaView>
//   );
// }



// import {
//   ChevronRightIcon,
//   HeartIcon,
//   MenuIcon,
//   MessageCircleIcon,
//   SettingsIcon,
//   StarIcon,
//   StyledImage,
//   StyledModal,
//   StyledText,
//   StyledTouchableOpacity,
//   StyledView,
//   UserIcon
// } from "@/components/NativeWind";

// import { useRouter } from "expo-router";
// import { useColorScheme } from "nativewind";
// import { useState } from "react";
// import { ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function AccountScreen() {
//   const router = useRouter();
//   const { colorScheme } = useColorScheme();
//   const isDark = colorScheme === "dark";

//   const [menuVisible, setMenuVisible] = useState(false);
//   const [settingsVisible, setSettingsVisible] = useState(false);
//   const [premiumVisible, setPremiumVisible] = useState(false);

//   const user = {
//     name: "Sarah Johnson",
//     age: 28,
//     bio: "Coffee lover ☕ | Travel enthusiast ✈️ | Dog mom 🐕",
//     avatar:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
//     location: "New York, NY",
//     verified: true,
//   };

//   const stats = [
//     { icon: HeartIcon, label: "Matches", value: "42", color: "#fb7185" },
//     { icon: MessageCircleIcon, label: "Chats", value: "18", color: "#a855f7" },
//     { icon: StarIcon, label: "Likes", value: "127", color: "#fbbf24" },
//   ];

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: isDark ? "#1c1917" : "#ffffff",
//       }}
//     >
//       {/* HEADER */}
//       <StyledView className="flex-row items-center justify-between px-6 py-4 border-b border-border">
//         <StyledText className="text-2xl font-bold text-foreground">
//           Account
//         </StyledText>

//         <StyledTouchableOpacity onPress={() => setMenuVisible(true)}>
//           <MenuIcon className="text-foreground" size={24} />
//         </StyledTouchableOpacity>
//       </StyledView>

//       {/* MAIN CONTENT */}
//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 120 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* PROFILE CARD */}
//         <StyledView className="p-6">
//           <StyledView
//             style={{
//               backgroundColor: isDark ? "#292524" : "#ffffff",
//             }}
//             className="rounded-2xl p-6 shadow-sm"
//           >
//             <StyledView className="items-center">
//               <StyledImage
//                 source={{ uri: user.avatar }}
//                 className="w-24 h-24 rounded-full"
//               />

//               <StyledView className="flex-row items-center mt-4">
//                 <StyledText className="text-2xl font-bold text-foreground">
//                   {user.name}
//                 </StyledText>

//                 {user.verified && (
//                   <StyledView className="ml-2 bg-primary rounded-full p-1">
//                     <StarIcon size={14} fill="#fff" color="#fff" />
//                   </StyledView>
//                 )}
//               </StyledView>

//               <StyledText className="text-muted-foreground mt-1">
//                 {user.age} • {user.location}
//               </StyledText>

//               <StyledText className="text-center text-foreground mt-3">
//                 {user.bio}
//               </StyledText>
//             </StyledView>
//           </StyledView>
//         </StyledView>

//         {/* STATS */}
//         <StyledView className="px-6 mb-6">
//           <StyledView className="flex-row gap-3">
//             {stats.map((stat, index) => (
//               <StyledView
//                 key={index}
//                 style={{
//                   flex: 1,
//                   backgroundColor: isDark ? "#292524" : "#ffffff",
//                 }}
//                 className="rounded-xl p-4 items-center"
//               >
//                 <stat.icon color={stat.color} size={24} />
//                 <StyledText className="text-2xl font-bold text-foreground mt-2">
//                   {stat.value}
//                 </StyledText>
//                 <StyledText className="text-xs text-muted-foreground mt-1">
//                   {stat.label}
//                 </StyledText>
//               </StyledView>
//             ))}
//           </StyledView>
//         </StyledView>

//         {/* QUICK ACTIONS */}
//         <StyledView className="px-6 mb-6">
//           <StyledText className="text-lg font-semibold text-foreground mb-3">
//             Quick Actions
//           </StyledText>

//           <StyledView className="gap-3">
//             <StyledTouchableOpacity
//               onPress={() => router.push("/profile-setup")}
//             >
//               <StyledView
//                 style={{
//                   backgroundColor: isDark ? "#292524" : "#ffffff",
//                 }}
//                 className="rounded-xl p-4 flex-row items-center justify-between"
//               >
//                 <StyledView className="flex-row items-center gap-3">
//                   <UserIcon className="text-primary" size={20} />
//                   <StyledText className="text-foreground font-medium">
//                     Edit Profile
//                   </StyledText>
//                 </StyledView>
//                 <ChevronRightIcon
//                   className="text-muted-foreground"
//                   size={20}
//                 />
//               </StyledView>
//             </StyledTouchableOpacity>

//             <StyledTouchableOpacity
//               onPress={() => setSettingsVisible(true)}
//             >
//               <StyledView
//                 style={{
//                   backgroundColor: isDark ? "#292524" : "#ffffff",
//                 }}
//                 className="rounded-xl p-4 flex-row items-center justify-between"
//               >
//                 <StyledView className="flex-row items-center gap-3">
//                   <SettingsIcon className="text-primary" size={20} />
//                   <StyledText className="text-foreground font-medium">
//                     Account Settings
//                   </StyledText>
//                 </StyledView>
//                 <ChevronRightIcon
//                   className="text-muted-foreground"
//                   size={20}
//                 />
//               </StyledView>
//             </StyledTouchableOpacity>
//           </StyledView>
//         </StyledView>
//       </ScrollView>

//       {/* SIMPLE MENU MODAL */}
//       <StyledModal
//         visible={menuVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setMenuVisible(false)}
//       >
//         <StyledTouchableOpacity
//           activeOpacity={1}
//           onPress={() => setMenuVisible(false)}
//           style={{
//             flex: 1,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             justifyContent: "flex-end",
//           }}
//         >
//           <StyledView
//             style={{
//               backgroundColor: isDark ? "#292524" : "#ffffff",
//             }}
//             className="rounded-t-3xl p-6"
//           >
//             <StyledTouchableOpacity
//               onPress={() => {
//                 setMenuVisible(false);
//                 setPremiumVisible(true);
//               }}
//               className="py-4"
//             >
//               <StyledText className="text-lg text-foreground">
//                 Switch to Premium
//               </StyledText>
//             </StyledTouchableOpacity>

//             <StyledTouchableOpacity
//               onPress={() => setMenuVisible(false)}
//               className="py-4"
//             >
//               <StyledText className="text-destructive text-lg">
//                 Logout
//               </StyledText>
//             </StyledTouchableOpacity>
//           </StyledView>
//         </StyledTouchableOpacity>
//       </StyledModal>
//     </SafeAreaView>
//   );
// }


import { Header } from "@/components/Header";
import { useRouter } from "expo-router";
import { ChevronRight, Heart, MessageCircle, Settings, Star, User } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  cardAlt: '#292524',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
};

const user = {
  name: "Sarah Johnson",
  age: 28,
  bio: "Coffee lover ☕ | Travel enthusiast ✈️ | Dog mom 🐕",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  location: "New York, NY",
  verified: true,
};

const stats = [
  { icon: Heart, label: "Matches", value: "42", color: "#fb7185" },
  { icon: MessageCircle, label: "Chats", value: "18", color: "#a855f7" },
  { icon: Star, label: "Likes", value: "127", color: "#fbbf24" },
];

export default function AccountScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header notificationCount={0} showNotifications={false} isLoggedIn={true} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <View style={{
            backgroundColor: COLORS.card, borderRadius: 24, padding: 24,
            alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
          }}>
            {/* Avatar */}
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: user.avatar }}
                style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: COLORS.primary }}
              />
              {user.verified && (
                <View style={{
                  position: 'absolute', bottom: 0, right: 0,
                  backgroundColor: COLORS.primary, borderRadius: 12,
                  width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
                  borderWidth: 2, borderColor: COLORS.background,
                }}>
                  <Star size={12} fill="#fff" color="#fff" />
                </View>
              )}
            </View>

            {/* Name */}
            <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: 'bold', marginTop: 14 }}>
              {user.name}
            </Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4 }}>
              {user.age} • {user.location}
            </Text>
            <Text style={{ color: COLORS.text, fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 }}>
              {user.bio}
            </Text>

            {/* Edit Profile Button */}
            <TouchableOpacity
              onPress={() => router.push("/profile-setup")}
              style={{
                marginTop: 16, paddingHorizontal: 28, paddingVertical: 10,
                borderRadius: 999, borderWidth: 1.5, borderColor: COLORS.primary,
              }}
            >
              <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 14 }}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginVertical: 16 }}>
          {stats.map((stat, index) => (
            <View key={index} style={{
              flex: 1, backgroundColor: COLORS.card, borderRadius: 16,
              padding: 16, alignItems: 'center',
              borderWidth: 1, borderColor: COLORS.border,
            }}>
              <stat.icon color={stat.color} size={24} />
              <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
                {stat.value}
              </Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Quick Actions
          </Text>
          <View style={{ gap: 10 }}>
            {[
              { icon: User, label: 'Edit Profile', sub: 'Update your photos & info', onPress: () => router.push("/profile-setup") },
              { icon: Settings, label: 'Account Settings', sub: 'Privacy, notifications & more', onPress: () => {} },
              { icon: Star, label: 'Switch to Premium', sub: 'Unlock exclusive features', onPress: () => {} },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={item.onPress}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: COLORS.card, borderRadius: 16,
                  padding: 16, borderWidth: 1, borderColor: COLORS.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: 'rgba(230,57,70,0.15)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={20} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 15 }}>{item.label}</Text>
                    <Text style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>{item.sub}</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => router.push("/welcome")}
            style={{
              padding: 16, borderRadius: 16, alignItems: 'center',
              borderWidth: 1.5, borderColor: COLORS.primary,
              backgroundColor: 'rgba(230,57,70,0.08)',
            }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 15 }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}