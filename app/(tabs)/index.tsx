// import { Header } from "@/components/Header";
// import { HeartIcon, MapPinIcon, MessageCircleIcon, StyledImage, StyledSafeAreaView, StyledText, StyledTouchableOpacity, StyledView, XIcon } from "@/components/NativeWind";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Dimensions, ScrollView } from "react-native";
// import Animated, {
//   Easing,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withSequence,
//   withSpring,
//   withTiming,
// } from "react-native-reanimated";

// const { width, height } = Dimensions.get("window");

// type Profile = {
//   id: string;
//   name: string;
//   age: number;
//   location: string;
//   distance: string;
//   image: string;
//   bio: string;
//   interests: string[];
//   verified: boolean;
// };

// const mockProfiles: Profile[] = [
//   {
//     id: "1",
//     name: "Alex",
//     age: 28,
//     location: "New York, NY",
//     distance: "2 miles away",
//     image:
//       "https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60",
//     bio: "Coffee enthusiast ☕ | Dog lover 🐕 | Adventure seeker",
//     interests: ["Travel", "Photography", "Yoga"],
//     verified: true,
//   },
//   {
//     id: "2",
//     name: "Jordan",
//     age: 26,
//     location: "Brooklyn, NY",
//     distance: "5 miles away",
//     image:
//       "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=900&auto=format&fit=crop&q=60",
//     bio: "Foodie 🍕 | Gym rat 💪 | Netflix binger",
//     interests: ["Cooking", "Fitness", "Music"],
//     verified: true,
//   },
//   {
//     id: "3",
//     name: "Sam",
//     age: 25,
//     location: "Manhattan, NY",
//     distance: "3 miles away",
//     image:
//       "https://images.unsplash.com/photo-1546572797-e8c933a75a1f?w=900&auto=format&fit=crop&q=60",
//     bio: "Artist 🎨 | Book lover 📚 | Cat parent",
//     interests: ["Art", "Reading", "Coffee"],
//     verified: false,
//   },
//   {
//     id: "4",
//     name: "Taylor",
//     age: 29,
//     location: "Queens, NY",
//     distance: "7 miles away",
//     image:
//       "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60",
//     bio: "Music producer 🎵 | Foodie | Night owl 🦉",
//     interests: ["Music", "Concerts", "Food"],
//     verified: true,
//   },
//   {
//     id: "5",
//     name: "Morgan",
//     age: 27,
//     location: "Bronx, NY",
//     distance: "6 miles away",
//     image:
//       "https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60",
//     bio: "Entrepreneur 💼 | Fitness enthusiast | Dog trainer",
//     interests: ["Business", "Fitness", "Dogs"],
//     verified: true,
//   },
// ];

// type FlyingEmoji = {
//   id: number;
//   emoji: string;
//   angle: number;
// };

// export default function DiscoverScreen() {
//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmoji[]>([]);
//   const cardScale = useSharedValue(1);
//   const cardOpacity = useSharedValue(1);

//   const currentProfile = mockProfiles[currentIndex];

//   const animatedCardStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: cardScale.value }],
//     opacity: cardOpacity.value,
//   }));

//   const nextProfile = () => {
//     setFlyingEmojis([]);
//     if (currentIndex < mockProfiles.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setCurrentIndex(0);
//     }
//     cardScale.value = 1;
//     cardOpacity.value = 1;
//   };

//   const handleLike = () => {
//     // Create 10 flying hearts in a burst pattern
//     const hearts: FlyingEmoji[] = [];
//     for (let i = 0; i < 10; i++) {
//       hearts.push({
//         id: Date.now() + i,
//         emoji: "❤️",
//         angle: (360 / 10) * i,
//       });
//     }
//     setFlyingEmojis(hearts);

//     // Animate card out
//     cardScale.value = withSpring(0.8, { damping: 15 });
//     cardOpacity.value = withTiming(
//       0,
//       { duration: 600, easing: Easing.ease },
//       (finished) => {
//         if (finished) {
//           runOnJS(nextProfile)();
//         }
//       }
//     );
//   };

//   const handlePass = () => {
//     // Create 8 flying broken hearts
//     const emojis: FlyingEmoji[] = [];
//     for (let i = 0; i < 8; i++) {
//       emojis.push({
//         id: Date.now() + i,
//         emoji: "💔",
//         angle: (360 / 8) * i,
//       });
//     }
//     setFlyingEmojis(emojis);

//     // Animate card out
//     cardScale.value = withSpring(0.8, { damping: 15 });
//     cardOpacity.value = withTiming(
//       0,
//       { duration: 600, easing: Easing.ease },
//       (finished) => {
//         if (finished) {
//           runOnJS(nextProfile)();
//         }
//       }
//     );
//   };

//   const handleMessage = () => {
//     router.push("/(tabs)/inbox");
//   };

//   return (
//     <StyledSafeAreaView className="flex-1 bg-background">
//       <Header
//         notificationCount={3}
//         showNotifications={true}
//         isLoggedIn={true}
//       />

//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Main Card Container */}
//         <StyledView className="px-6 mt-4">
//           <StyledView className="relative" style={{ minHeight: 600 }}>
//             {/* Profile Card */}
//             <Animated.View style={animatedCardStyle}>
//               <StyledView className="bg-card rounded-3xl overflow-hidden shadow-lg">
//                 {/* Profile Image */}
//                 <StyledView className="relative">
//                   <StyledImage
//                     source={{ uri: currentProfile.image }}
//                     className="w-full h-96"
//                     resizeMode="cover"
//                   />
//                   <LinearGradient
//                     colors={["transparent", "rgba(0,0,0,0.8)"]}
//                     style={{
//                       position: "absolute",
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       height: 200,
//                     }}
//                   />

//                   {/* Verified Badge */}
//                   {currentProfile.verified && (
//                     <StyledView className="absolute top-4 right-4 bg-blue-500 rounded-full p-2">
//                       <StyledText className="text-white font-bold text-xs">✓</StyledText>
//                     </StyledView>
//                   )}

//                   {/* Profile Info Overlay */}
//                   <StyledView className="absolute bottom-0 left-0 right-0 p-6">
//                     <StyledView className="flex-row items-end justify-between">
//                       <StyledView className="flex-1">
//                         <StyledView className="flex-row items-center gap-2 mb-2">
//                           <StyledText className="text-white font-bold text-3xl">
//                             {currentProfile.name}
//                           </StyledText>
//                           <StyledText className="text-white/90 font-semibold text-2xl">
//                             {currentProfile.age}
//                           </StyledText>
//                         </StyledView>
//                         <StyledView className="flex-row items-center gap-1 mb-1">
//                           <MapPinIcon className="text-white/80" size={16} />
//                           <StyledText className="text-white/90 text-sm">
//                             {currentProfile.location}
//                           </StyledText>
//                         </StyledView>
//                         <StyledText className="text-white/70 text-xs">
//                           {currentProfile.distance}
//                         </StyledText>
//                       </StyledView>
//                     </StyledView>
//                   </StyledView>
//                 </StyledView>

//                 {/* Bio Section */}
//                 <StyledView className="p-6 bg-card">
//                   <StyledText className="text-foreground text-base mb-4 leading-6">
//                     {currentProfile.bio}
//                   </StyledText>

//                   {/* Interests */}
//                   <StyledView className="flex-row flex-wrap gap-2">
//                     {currentProfile.interests.map((interest, index) => (
//                       <StyledView
//                         key={index}
//                         className="bg-primary/10 px-4 py-2 rounded-full"
//                       >
//                         <StyledText className="text-primary font-medium text-sm">
//                           {interest}
//                         </StyledText>
//                       </StyledView>
//                     ))}
//                   </StyledView>
//                 </StyledView>
//               </StyledView>
//             </Animated.View>

//             {/* Flying Emojis Container - ABOVE the card */}
//             <StyledView
//               style={{
//                 position: "absolute",
//                 top: 200,
//                 left: 0,
//                 right: 0,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 height: 400,
//                 pointerEvents: "none",
//               }}
//             >
//               {flyingEmojis.map((emoji) => (
//                 <FlyingEmoji
//                   key={emoji.id}
//                   emoji={emoji.emoji}
//                   angle={emoji.angle}
//                 />
//               ))}
//             </StyledView>

//             {/* Action Buttons */}
//             <StyledView className="flex-row items-center justify-center gap-6 mt-8">
//               <StyledTouchableOpacity
//                 onPress={handlePass}
//                 activeOpacity={0.7}
//                 style={{
//                   width: 64,
//                   height: 64,
//                   borderRadius: 32,
//                   backgroundColor: "#fee2e2",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   shadowColor: "#000",
//                   shadowOffset: { width: 0, height: 4 },
//                   shadowOpacity: 0.2,
//                   shadowRadius: 8,
//                   elevation: 5,
//                 }}
//               >
//                 <XIcon color="#dc2626" size={32} strokeWidth={3} />
//               </StyledTouchableOpacity>

//               <StyledTouchableOpacity
//                 onPress={handleLike}
//                 activeOpacity={0.7}
//                 style={{
//                   width: 80,
//                   height: 80,
//                   borderRadius: 40,
//                   backgroundColor: "#fb7185",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   shadowColor: "#fb7185",
//                   shadowOffset: { width: 0, height: 6 },
//                   shadowOpacity: 0.4,
//                   shadowRadius: 12,
//                   elevation: 8,
//                 }}
//               >
//                 <HeartIcon color="#ffffff" size={40} fill="#ffffff" strokeWidth={0} />
//               </StyledTouchableOpacity>

//               <StyledTouchableOpacity
//                 onPress={handleMessage}
//                 activeOpacity={0.7}
//                 style={{
//                   width: 64,
//                   height: 64,
//                   borderRadius: 32,
//                   backgroundColor: "#dbeafe",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   shadowColor: "#000",
//                   shadowOffset: { width: 0, height: 4 },
//                   shadowOpacity: 0.2,
//                   shadowRadius: 8,
//                   elevation: 5,
//                 }}
//               >
//                 <MessageCircleIcon color="#3b82f6" size={28} strokeWidth={2.5} />
//               </StyledTouchableOpacity>
//             </StyledView>
//           </StyledView>
//         </StyledView>

//         {/* Quick Stats */}
//         <StyledView className="px-6 mt-8">
//           <StyledText className="text-xl font-bold text-foreground mb-4">
//             Your Activity
//           </StyledText>
//           <StyledView className="flex-row gap-4">
//             <StyledView className="flex-1 bg-card p-4 rounded-2xl border border-border">
//               <StyledText className="text-3xl font-bold text-primary mb-1">24</StyledText>
//               <StyledText className="text-muted-foreground text-sm">Likes Sent</StyledText>
//             </StyledView>
//             <StyledView className="flex-1 bg-card p-4 rounded-2xl border border-border">
//               <StyledText className="text-3xl font-bold text-primary mb-1">12</StyledText>
//               <StyledText className="text-muted-foreground text-sm">Matches</StyledText>
//             </StyledView>
//             <StyledView className="flex-1 bg-card p-4 rounded-2xl border border-border">
//               <StyledText className="text-3xl font-bold text-primary mb-1">8</StyledText>
//               <StyledText className="text-muted-foreground text-sm">Chats</StyledText>
//             </StyledView>
//           </StyledView>
//         </StyledView>

//         {/* Tips Section */}
//         <StyledView className="px-6 mt-8 mb-6">
//           <StyledView
//             className="p-6 rounded-2xl border"
//             style={{
//               backgroundColor: "#fef2f2",
//               borderColor: "#fecdd3",
//             }}
//           >
//             <StyledText className="text-foreground font-bold text-lg mb-2">
//               💡 Profile Tip
//             </StyledText>
//             <StyledText className="text-muted-foreground text-sm leading-5">
//               Add more photos to your profile to increase your chances of
//               getting matches by up to 40%!
//             </StyledText>
//           </StyledView>
//         </StyledView>
//       </ScrollView>
//     </StyledSafeAreaView>
//   );
// }

// // Flying Emoji Component with burst animation
// function FlyingEmoji({ emoji, angle }: { emoji: string; angle: number }) {
//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const opacity = useSharedValue(1);
//   const scale = useSharedValue(0);

//   React.useEffect(() => {
//     // Calculate direction based on angle
//     const distance = 150;
//     const radians = (angle * Math.PI) / 180;
//     const targetX = Math.cos(radians) * distance;
//     const targetY = Math.sin(radians) * distance;

//     // Burst animation
//     scale.value = withSequence(
//       withSpring(1.5, { damping: 8 }),
//       withSpring(1, { damping: 10 })
//     );

//     translateX.value = withSpring(targetX, { damping: 12, stiffness: 80 });
//     translateY.value = withSpring(targetY, { damping: 12, stiffness: 80 });

//     opacity.value = withTiming(0, {
//       duration: 1200,
//       easing: Easing.out(Easing.ease),
//     });
//   }, []);

//  const animatedStyle = useAnimatedStyle(() => {
//   return {
//     transform: [
//       { translateX: translateX.value },
//       { translateY: translateY.value },
//       { scale: scale.value },
//     ],
//     opacity: opacity.value,
//   } as any;
// });



//   return (
//     <Animated.View
//       style={[
//         {
//           position: "absolute",
//         },
//         animatedStyle,
//       ]}
//     >
//       <StyledText style={{ fontSize: 48 }}>{emoji}</StyledText>
//     </Animated.View>
//   );
// }

//prefect top 
// import { Header } from '@/components/Header';   
// import { HeartIcon, MapPinIcon, MessageCircleIcon, StyledImage, StyledText, StyledTouchableOpacity, StyledView, XIcon } from "@/components/NativeWind";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Dimensions, ScrollView } from "react-native";
// import Animated, {
//   Easing,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withSequence,
//   withSpring,
//   withTiming,
// } from "react-native-reanimated";

// const { width, height } = Dimensions.get("window");

// type Profile = {
//   id: string;
//   name: string;
//   age: number;
//   location: string;
//   distance: string;
//   image: string;
//   bio: string;
//   interests: string[];
//   verified: boolean;
// };

// const mockProfiles: Profile[] = [
//   {
//     id: "1",
//     name: "Alex",
//     age: 28,
//     location: "New York, NY",
//     distance: "2 miles away",
//     image: "https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60",
//     bio: "Coffee enthusiast ☕ | Dog lover 🐕 | Adventure seeker",
//     interests: ["Travel", "Photography", "Yoga"],
//     verified: true,
//   },
//   {
//     id: "2",
//     name: "Jordan",
//     age: 26,
//     location: "Brooklyn, NY",
//     distance: "5 miles away",
//     image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=900&auto=format&fit=crop&q=60",
//     bio: "Foodie 🍕 | Gym rat 💪 | Netflix binger",
//     interests: ["Cooking", "Fitness", "Music"],
//     verified: true,
//   },
//   {
//     id: "3",
//     name: "Sam",
//     age: 25,
//     location: "Manhattan, NY",
//     distance: "3 miles away",
//     image: "https://images.unsplash.com/photo-1546572797-e8c933a75a1f?w=900&auto=format&fit=crop&q=60",
//     bio: "Artist 🎨 | Book lover 📚 | Cat parent",
//     interests: ["Art", "Reading", "Coffee"],
//     verified: false,
//   },
//   {
//     id: "4",
//     name: "Taylor",
//     age: 29,
//     location: "Queens, NY",
//     distance: "7 miles away",
//     image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60",
//     bio: "Music producer 🎵 | Foodie | Night owl 🦉",
//     interests: ["Music", "Concerts", "Food"],
//     verified: true,
//   },
//   {
//     id: "5",
//     name: "Morgan",
//     age: 27,
//     location: "Bronx, NY",
//     distance: "6 miles away",
//     image: "https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60",
//     bio: "Entrepreneur 💼 | Fitness enthusiast | Dog trainer",
//     interests: ["Business", "Fitness", "Dogs"],
//     verified: true,
//   },
// ];

// type FlyingEmoji = {
//   id: number;
//   emoji: string;
//   angle: number;
// };

// export default function DiscoverScreen() {
//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmoji[]>([]);
//   const cardScale = useSharedValue(1);
//   const cardOpacity = useSharedValue(1);

//   const currentProfile = mockProfiles[currentIndex];

//   const animatedCardStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: cardScale.value }],
//     opacity: cardOpacity.value,
//   }));

//   const nextProfile = () => {
//     setFlyingEmojis([]);
//     if (currentIndex < mockProfiles.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setCurrentIndex(0);
//     }
//     cardScale.value = 1;
//     cardOpacity.value = 1;
//   };

//   const handleLike = () => {
//     const hearts: FlyingEmoji[] = [];
//     for (let i = 0; i < 10; i++) {
//       hearts.push({ id: Date.now() + i, emoji: "❤️", angle: (360 / 10) * i });
//     }
//     setFlyingEmojis(hearts);
//     cardScale.value = withSpring(0.8, { damping: 15 });
//     cardOpacity.value = withTiming(0, { duration: 600, easing: Easing.ease }, (finished) => {
//       if (finished) runOnJS(nextProfile)();
//     });
//   };

//   const handlePass = () => {
//     const emojis: FlyingEmoji[] = [];
//     for (let i = 0; i < 8; i++) {
//       emojis.push({ id: Date.now() + i, emoji: "💔", angle: (360 / 8) * i });
//     }
//     setFlyingEmojis(emojis);
//     cardScale.value = withSpring(0.8, { damping: 15 });
//     cardOpacity.value = withTiming(0, { duration: 600, easing: Easing.ease }, (finished) => {
//       if (finished) runOnJS(nextProfile)();
//     });
//   };

//   const handleMessage = () => {
//     router.push("/(tabs)/inbox");
//   };

//   return (
//     <StyledView style={{ flex: 1 }} className="bg-background">
//       <Header notificationCount={3} showNotifications={true} isLoggedIn={true} />

//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Main Card Container */}
//         <StyledView className="px-6 mt-4">
//           <StyledView className="relative" style={{ minHeight: 600 }}>
//             {/* Profile Card */}
//             <Animated.View style={animatedCardStyle}>
//               <StyledView className="bg-card rounded-3xl overflow-hidden shadow-lg">
//                 <StyledView className="relative">
//                   <StyledImage
//                     source={{ uri: currentProfile.image }}
//                     className="w-full h-96"
//                     resizeMode="cover"
//                   />
//                   <LinearGradient
//                     colors={["transparent", "rgba(0,0,0,0.8)"]}
//                     style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200 }}
//                   />

//                   {currentProfile.verified && (
//                     <StyledView className="absolute top-4 right-4 bg-blue-500 rounded-full p-2">
//                       <StyledText className="text-white font-bold text-xs">✓</StyledText>
//                     </StyledView>
//                   )}

//                   <StyledView className="absolute bottom-0 left-0 right-0 p-6">
//                     <StyledView className="flex-row items-end justify-between">
//                       <StyledView className="flex-1">
//                         <StyledView className="flex-row items-center gap-2 mb-2">
//                           <StyledText className="text-white font-bold text-3xl">
//                             {currentProfile.name}
//                           </StyledText>
//                           <StyledText className="text-white/90 font-semibold text-2xl">
//                             {currentProfile.age}
//                           </StyledText>
//                         </StyledView>
//                         <StyledView className="flex-row items-center gap-1 mb-1">
//                           <MapPinIcon className="text-white/80" size={16} />
//                           <StyledText className="text-white/90 text-sm">
//                             {currentProfile.location}
//                           </StyledText>
//                         </StyledView>
//                         <StyledText className="text-white/70 text-xs">
//                           {currentProfile.distance}
//                         </StyledText>
//                       </StyledView>
//                     </StyledView>
//                   </StyledView>
//                 </StyledView>

//                 <StyledView className="p-6 bg-card">
//                   <StyledText className="text-foreground text-base mb-4 leading-6">
//                     {currentProfile.bio}
//                   </StyledText>
//                   <StyledView className="flex-row flex-wrap gap-2">
//                     {currentProfile.interests.map((interest, index) => (
//                       <StyledView key={index} className="bg-primary/10 px-4 py-2 rounded-full">
//                         <StyledText className="text-primary font-medium text-sm">
//                           {interest}
//                         </StyledText>
//                       </StyledView>
//                     ))}
//                   </StyledView>
//                 </StyledView>
//               </StyledView>
//             </Animated.View>

//             {/* Flying Emojis */}
//             <StyledView
//               style={{
//                 position: "absolute", top: 200, left: 0, right: 0,
//                 alignItems: "center", justifyContent: "center",
//                 height: 400, pointerEvents: "none",
//               }}
//             >
//               {flyingEmojis.map((emoji) => (
//                 <FlyingEmoji key={emoji.id} emoji={emoji.emoji} angle={emoji.angle} />
//               ))}
//             </StyledView>

//             {/* Action Buttons */}
//             <StyledView className="flex-row items-center justify-center gap-6 mt-8">
//               <StyledTouchableOpacity
//                 onPress={handlePass}
//                 activeOpacity={0.7}
//                 style={{
//                   width: 64, height: 64, borderRadius: 32,
//                   backgroundColor: "#fee2e2", alignItems: "center", justifyContent: "center",
//                   shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
//                   shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
//                 }}
//               >
//                 <XIcon color="#dc2626" size={32} strokeWidth={3} />
//               </StyledTouchableOpacity>

//               <StyledTouchableOpacity
//                 onPress={handleLike}
//                 activeOpacity={0.7}
//                 style={{
//                   width: 80, height: 80, borderRadius: 40,
//                   backgroundColor: "#fb7185", alignItems: "center", justifyContent: "center",
//                   shadowColor: "#fb7185", shadowOffset: { width: 0, height: 6 },
//                   shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
//                 }}
//               >
//                 <HeartIcon color="#ffffff" size={40} fill="#ffffff" strokeWidth={0} />
//               </StyledTouchableOpacity>

//               <StyledTouchableOpacity
//                 onPress={handleMessage}
//                 activeOpacity={0.7}
//                 style={{
//                   width: 64, height: 64, borderRadius: 32,
//                   backgroundColor: "#dbeafe", alignItems: "center", justifyContent: "center",
//                   shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
//                   shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
//                 }}
//               >
//                 <MessageCircleIcon color="#3b82f6" size={28} strokeWidth={2.5} />
//               </StyledTouchableOpacity>
//             </StyledView>
//           </StyledView>
//         </StyledView>

//         {/* Quick Stats */}
//         <StyledView className="px-6 mt-8">
//           <StyledText className="text-xl font-bold text-foreground mb-4">Your Activity</StyledText>
//           <StyledView className="flex-row gap-4">
//             <StyledView className="flex-1 bg-card p-4 rounded-2xl border border-border">
//               <StyledText className="text-3xl font-bold text-primary mb-1">24</StyledText>
//               <StyledText className="text-muted-foreground text-sm">Likes Sent</StyledText>
//             </StyledView>
//             <StyledView className="flex-1 bg-card p-4 rounded-2xl border border-border">
//               <StyledText className="text-3xl font-bold text-primary mb-1">12</StyledText>
//               <StyledText className="text-muted-foreground text-sm">Matches</StyledText>
//             </StyledView>
//             <StyledView className="flex-1 bg-card p-4 rounded-2xl border border-border">
//               <StyledText className="text-3xl font-bold text-primary mb-1">8</StyledText>
//               <StyledText className="text-muted-foreground text-sm">Chats</StyledText>
//             </StyledView>
//           </StyledView>
//         </StyledView>

//         {/* Tips Section */}
//         <StyledView className="px-6 mt-8 mb-6">
//           <StyledView
//             className="p-6 rounded-2xl border"
//             style={{ backgroundColor: "#fef2f2", borderColor: "#fecdd3" }}
//           >
//             <StyledText className="text-foreground font-bold text-lg mb-2">💡 Profile Tip</StyledText>
//             <StyledText className="text-muted-foreground text-sm leading-5">
//               Add more photos to your profile to increase your chances of getting matches by up to 40%!
//             </StyledText>
//           </StyledView>
//         </StyledView>
//       </ScrollView>
//     </StyledView>
//   );
// }

// function FlyingEmoji({ emoji, angle }: { emoji: string; angle: number }) {
//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const opacity = useSharedValue(1);
//   const scale = useSharedValue(0);

//   React.useEffect(() => {
//     const distance = 150;
//     const radians = (angle * Math.PI) / 180;
//     const targetX = Math.cos(radians) * distance;
//     const targetY = Math.sin(radians) * distance;

//     scale.value = withSequence(
//       withSpring(1.5, { damping: 8 }),
//       withSpring(1, { damping: 10 })
//     );
//     translateX.value = withSpring(targetX, { damping: 12, stiffness: 80 });
//     translateY.value = withSpring(targetY, { damping: 12, stiffness: 80 });
//     opacity.value = withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) });
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: translateX.value },
//       { translateY: translateY.value },
//       { scale: scale.value },
//     ],
//     opacity: opacity.value,
//   } as any));

//   return (
//     <Animated.View style={[{ position: "absolute" }, animatedStyle]}>
//       <StyledText style={{ fontSize: 48 }}>{emoji}</StyledText>
//     </Animated.View>
//   );
// }

import { Header } from '@/components/Header';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Heart, MapPin, MessageCircle, X } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  primaryLight: '#fb7185',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
  white: '#ffffff',
};

type Profile = {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  image: string;
  bio: string;
  interests: string[];
  verified: boolean;
};

const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Alex",
    age: 28,
    location: "New York, NY",
    distance: "2 miles away",
    image: "https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60",
    bio: "Coffee enthusiast ☕ | Dog lover 🐕 | Adventure seeker",
    interests: ["Travel", "Photography", "Yoga"],
    verified: true,
  },
  {
    id: "2",
    name: "Jordan",
    age: 26,
    location: "Brooklyn, NY",
    distance: "5 miles away",
    image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=900&auto=format&fit=crop&q=60",
    bio: "Foodie 🍕 | Gym rat 💪 | Netflix binger",
    interests: ["Cooking", "Fitness", "Music"],
    verified: true,
  },
  {
    id: "3",
    name: "Sam",
    age: 25,
    location: "Manhattan, NY",
    distance: "3 miles away",
    image: "https://images.unsplash.com/photo-1546572797-e8c933a75a1f?w=900&auto=format&fit=crop&q=60",
    bio: "Artist 🎨 | Book lover 📚 | Cat parent",
    interests: ["Art", "Reading", "Coffee"],
    verified: false,
  },
  {
    id: "4",
    name: "Taylor",
    age: 29,
    location: "Queens, NY",
    distance: "7 miles away",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60",
    bio: "Music producer 🎵 | Foodie | Night owl 🦉",
    interests: ["Music", "Concerts", "Food"],
    verified: true,
  },
  {
    id: "5",
    name: "Morgan",
    age: 27,
    location: "Bronx, NY",
    distance: "6 miles away",
    image: "https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60",
    bio: "Entrepreneur 💼 | Fitness enthusiast | Dog trainer",
    interests: ["Business", "Fitness", "Dogs"],
    verified: true,
  },
];

type FlyingEmoji = { id: number; emoji: string; angle: number };

export default function DiscoverScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmoji[]>([]);
  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const currentProfile = mockProfiles[currentIndex];

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const nextProfile = () => {
    setFlyingEmojis([]);
    setCurrentIndex(prev => (prev < mockProfiles.length - 1 ? prev + 1 : 0));
    cardScale.value = 1;
    cardOpacity.value = 1;
  };

  const handleLike = () => {
    const hearts: FlyingEmoji[] = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i, emoji: "❤️", angle: (360 / 10) * i,
    }));
    setFlyingEmojis(hearts);
    cardScale.value = withSpring(0.8, { damping: 15 });
    cardOpacity.value = withTiming(0, { duration: 600, easing: Easing.ease }, (finished) => {
      if (finished) runOnJS(nextProfile)();
    });
  };

  const handlePass = () => {
    const emojis: FlyingEmoji[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i, emoji: "💔", angle: (360 / 8) * i,
    }));
    setFlyingEmojis(emojis);
    cardScale.value = withSpring(0.8, { damping: 15 });
    cardOpacity.value = withTiming(0, { duration: 600, easing: Easing.ease }, (finished) => {
      if (finished) runOnJS(nextProfile)();
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header notificationCount={3} showNotifications={true} isLoggedIn={true} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Animated.View style={[animatedCardStyle, { borderRadius: 24, overflow: 'hidden', backgroundColor: COLORS.card }]}>
            
            {/* Profile Image */}
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: currentProfile.image }}
                style={{ width: '100%', height: 400 }}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.85)"]}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 220 }}
              />

              {/* Verified Badge */}
              {currentProfile.verified && (
                <View style={{
                  position: 'absolute', top: 16, right: 16,
                  backgroundColor: '#3b82f6', borderRadius: 20,
                  paddingHorizontal: 10, paddingVertical: 4,
                  flexDirection: 'row', alignItems: 'center',
                }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓ Verified</Text>
                </View>
              )}

              {/* Profile Info Overlay */}
              <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 }}>
                  <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', marginRight: 8 }}>
                    {currentProfile.name}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 24, fontWeight: '600', marginBottom: 2 }}>
                    {currentProfile.age}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <MapPin color="rgba(255,255,255,0.8)" size={14} />
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginLeft: 4 }}>
                    {currentProfile.location}
                  </Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                  {currentProfile.distance}
                </Text>
              </View>
            </View>

            {/* Bio + Interests */}
            <View style={{ padding: 20, backgroundColor: COLORS.card }}>
              <Text style={{ color: COLORS.text, fontSize: 15, lineHeight: 22, marginBottom: 14 }}>
                {currentProfile.bio}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {currentProfile.interests.map((interest, i) => (
                  <View key={i} style={{
                    backgroundColor: 'rgba(230,57,70,0.15)',
                    paddingHorizontal: 14, paddingVertical: 7,
                    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(230,57,70,0.3)',
                  }}>
                    <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>
                      {interest}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Flying Emojis */}
          <View style={{ position: 'absolute', top: 200, left: 0, right: 0, height: 400, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            {flyingEmojis.map((emoji) => (
              <FlyingEmoji key={emoji.id} emoji={emoji.emoji} angle={emoji.angle} />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 28, marginBottom: 8 }}>
            <TouchableOpacity
              onPress={handlePass}
              activeOpacity={0.7}
              style={{
                width: 64, height: 64, borderRadius: 32,
                backgroundColor: "#fee2e2",
                alignItems: 'center', justifyContent: 'center',
                shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
              }}
            >
              <X color="#dc2626" size={32} strokeWidth={3} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLike}
              activeOpacity={0.7}
              style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: "#fb7185",
                alignItems: 'center', justifyContent: 'center',
                shadowColor: "#fb7185", shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
              }}
            >
              <Heart color="#ffffff" size={40} fill="#ffffff" strokeWidth={0} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/inbox")}
              activeOpacity={0.7}
              style={{
                width: 64, height: 64, borderRadius: 32,
                backgroundColor: "#dbeafe",
                alignItems: 'center', justifyContent: 'center',
                shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
              }}
            >
              <MessageCircle color="#3b82f6" size={28} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
          <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: 'bold', marginBottom: 14 }}>
            Your Activity
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[{ value: '24', label: 'Likes Sent' }, { value: '12', label: 'Matches' }, { value: '8', label: 'Chats' }].map((stat) => (
              <View key={stat.label} style={{
                flex: 1, backgroundColor: COLORS.card,
                padding: 16, borderRadius: 16,
                borderWidth: 1, borderColor: COLORS.border,
              }}>
                <Text style={{ color: COLORS.primary, fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>
                  {stat.value}
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tip Card */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 16 }}>
          <View style={{
            padding: 20, borderRadius: 16,
            backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecdd3',
          }}>
            <Text style={{ color: '#111', fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>
              💡 Profile Tip
            </Text>
            <Text style={{ color: '#78716c', fontSize: 13, lineHeight: 20 }}>
              Add more photos to your profile to increase your chances of getting matches by up to 40%!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FlyingEmoji({ emoji, angle }: { emoji: string; angle: number }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  React.useEffect(() => {
    const distance = 150;
    const radians = (angle * Math.PI) / 180;
    scale.value = withSequence(withSpring(1.5, { damping: 8 }), withSpring(1, { damping: 10 }));
    translateX.value = withSpring(Math.cos(radians) * distance, { damping: 12, stiffness: 80 });
    translateY.value = withSpring(Math.sin(radians) * distance, { damping: 12, stiffness: 80 });
    opacity.value = withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  } as any));

  return (
    <Animated.View style={[{ position: 'absolute' }, animatedStyle]}>
      <Text style={{ fontSize: 48 }}>{emoji}</Text>
    </Animated.View>
  );
}