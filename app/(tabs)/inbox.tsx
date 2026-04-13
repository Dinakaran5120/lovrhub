// import { Header } from "@/components/Header";
// import {
//   HeartIcon,
//   MessageCircleIcon,
//   SearchIcon,
//   SendIcon,
//   StyledImage,
//   StyledSafeAreaView,
//   StyledText,
//   StyledTouchableOpacity,
//   StyledView,
//   UsersIcon,
// } from "@/components/NativeWind";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   ScrollView,
//   TextInput,
// } from "react-native";

// type VibedProfile = {
//   id: string;
//   name: string;
//   avatar: string;
//   isOnline: boolean;
// };

// type Chat = {
//   id: string;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp: string;
//   unreadCount: number;
//   isOnline: boolean;
//   isGroup?: boolean;
//   mood?: string;
// };

// const VIBED_PROFILES: VibedProfile[] = [
//   {
//     id: "1",
//     name: "Alex",
//     avatar:
//       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60",
//     isOnline: true,
//   },
//   {
//     id: "2",
//     name: "Jordan",
//     avatar:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60",
//     isOnline: true,
//   },
//   {
//     id: "3",
//     name: "Sam",
//     avatar:
//       "https://images.unsplash.com/photo-1546572797-e8c933a75a1f?w=900&auto=format&fit=crop&q=60",
//     isOnline: false,
//   },
//   {
//     id: "4",
//     name: "Taylor",
//     avatar:
//       "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?w=900&auto=format&fit=crop&q=60",
//     isOnline: true,
//   },
//   {
//     id: "5",
//     name: "Morgan",
//     avatar:
//       "https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60",
//     isOnline: false,
//   },
// ];

// const CHATS: Chat[] = [
//   {
//     id: "1",
//     name: "Alex Rivera",
//     avatar:
//       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60",
//     lastMessage: "Hey! Would love to grab coffee this weekend 😊",
//     timestamp: "2m ago",
//     unreadCount: 2,
//     isOnline: true,
//     mood: "🙂",
//   },
//   {
//     id: "2",
//     name: "Jordan Lee",
//     avatar:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60",
//     lastMessage: "That sounds amazing! Count me in 🎉",
//     timestamp: "15m ago",
//     unreadCount: 0,
//     isOnline: true,
//     mood: "🔥",
//   },
//   {
//     id: "3",
//     name: "LGBTQ+ Community",
//     avatar:
//       "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=900&auto=format&fit=crop&q=60",
//     lastMessage: "Sam: Anyone up for pride parade planning?",
//     timestamp: "1h ago",
//     unreadCount: 5,
//     isOnline: true,
//     isGroup: true,
//   },
//   {
//     id: "4",
//     name: "Sam Chen",
//     avatar:
//       "https://images.unsplash.com/photo-1546572797-e8c933a75a1f?w=900&auto=format&fit=crop&q=60",
//     lastMessage: "Thanks for the recommendation!",
//     timestamp: "3h ago",
//     unreadCount: 0,
//     isOnline: false,
//     mood: "😔",
//   },
//   {
//     id: "5",
//     name: "Taylor Swift",
//     avatar:
//       "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?w=900&auto=format&fit=crop&q=60",
//     lastMessage: "See you tomorrow! 💕",
//     timestamp: "5h ago",
//     unreadCount: 0,
//     isOnline: true,
//     mood: "💔",
//   },
//   {
//     id: "6",
//     name: "Morgan Blake",
//     avatar:
//       "https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60",
//     lastMessage: "Loved our conversation yesterday",
//     timestamp: "Yesterday",
//     unreadCount: 1,
//     isOnline: false,
//     mood: "😵",
//   },
// ];

// export default function InboxScreen() {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedTab, setSelectedTab] = useState<"all" | "unread">("all");

//   const filteredChats = CHATS.filter((chat) => {
//     const matchesSearch = chat.name
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesTab =
//       selectedTab === "all" ||
//       (selectedTab === "unread" && chat.unreadCount > 0);
//     return matchesSearch && matchesTab;
//   });

//   const handleChatPress = (chat: Chat) => {
//     // Navigate to chat detail screen
//     router.push("/chat-detail");
//   };

//   return (
//     <StyledSafeAreaView className="flex-1 bg-background">
//       <Header
//         notificationCount={3}
//         showNotifications={true}
//         isLoggedIn={true}
//       />

//       {/* Search & Filters */}
//       <StyledView className="px-6 py-4 flex-1">
//         {/* Search Bar */}
//         <StyledView className="flex-row items-center px-4 py-3 rounded-2xl mb-4 bg-card">
//           <SearchIcon size={20} className="text-muted-foreground" />
//           <TextInput
//             placeholder="Search messages..."
//             placeholderTextColor="#999"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             className="flex-1 ml-3 text-base text-foreground"
//           />
//         </StyledView>

//         {/* Tabs */}
//         <StyledView className="flex-row gap-3">
//           <StyledTouchableOpacity
//             onPress={() => setSelectedTab("all")}
//             className={`flex-1 py-3 rounded-xl items-center ${selectedTab === "all" ? "bg-primary" : "bg-card"}`}
//           >
//             <StyledText
//               className={`font-semibold ${selectedTab === "all" ? "text-white" : "text-foreground"}`}
//             >
//               All Messages
//             </StyledText>
//           </StyledTouchableOpacity>
//           <StyledTouchableOpacity
//             onPress={() => setSelectedTab("unread")}
//             className={`flex-1 py-3 rounded-xl items-center relative ${selectedTab === "unread" ? "bg-primary" : "bg-card"}`}
//           >
//             <StyledText
//               className={`font-semibold ${selectedTab === "unread" ? "text-white" : "text-foreground"}`}
//             >
//               Unread
//             </StyledText>
//             {CHATS.filter((c) => c.unreadCount > 0).length > 0 && (
//               <StyledView className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center bg-accent">
//                 <StyledText className="text-xs font-bold text-accent-foreground">
//                   {CHATS.filter((c) => c.unreadCount > 0).length}
//                 </StyledText>
//               </StyledView>
//             )}
//           </StyledTouchableOpacity>
//         </StyledView>
//       </StyledView>

//       {/* Vibed Profiles - Horizontal Scroll */}
//       <StyledView className="mb-4 flex-1">
//         <StyledView className="flex-row items-center justify-between px-6 mb-3">
//           <StyledText className="text-lg font-bold text-foreground">
//             Vibed Profiles
//           </StyledText>
//           <HeartIcon size={18} className="text-primary" fill="#E63946" />
//         </StyledView>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
//         >
//           {VIBED_PROFILES.map((profile) => (
//             <StyledTouchableOpacity key={profile.id} className="items-center">
//               <StyledView className="relative">
//                 <StyledImage
//                   source={{ uri: profile.avatar }}
//                   className="w-16 h-16 rounded-full"
//                 />
//                 {profile.isOnline && (
//                   <StyledView
//                     className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background"
//                     style={{ backgroundColor: "#2ECC71" }}
//                   />
//                 )}
//               </StyledView>
//               <StyledText className="text-xs mt-2 font-medium text-foreground">
//                 {profile.name}
//               </StyledText>
//             </StyledTouchableOpacity>
//           ))}
//         </ScrollView>
//       </StyledView>

//       {/* Chat List */}
//       <ScrollView
//        className="flex-1"
//         contentContainerStyle={{
//           paddingHorizontal: 24,
//           paddingBottom: 128,
//           gap: 12,
//         }}
//       >
//         {filteredChats.length === 0 ? (
//           <StyledView className="items-center justify-center py-12 flex-1">
//             <MessageCircleIcon size={48} className="text-muted-foreground" />
//             <StyledText className="text-center mt-4 text-base text-muted-foreground">
//               {searchQuery ? "No messages found" : "No unread messages"}
//             </StyledText>
//           </StyledView>
//         ) : (
//           filteredChats.map((chat) => (
//             <StyledTouchableOpacity
//               key={chat.id}
//               onPress={() => handleChatPress(chat)}
//               className="p-4 rounded-2xl flex-row items-center bg-card active:opacity-70"
//             >
//               {/* Avatar */}
//               <StyledView className="relative mr-3">
//                 <StyledImage
//                   source={{ uri: chat.avatar }}
//                   className="w-14 h-14 rounded-full"
//                 />
//                 {chat.isOnline && (
//                   <StyledView
//                     className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card"
//                     style={{ backgroundColor: "#2ECC71" }}
//                   />
//                 )}
//                 {chat.isGroup && (
//                   <StyledView
//                     className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
//                     style={{ backgroundColor: "#E63946" }}
//                   >
//                     <UsersIcon size={12} color="white" />
//                   </StyledView>
//                 )}
//               </StyledView>

//               {/* Chat Info */}
//               <StyledView className="flex-1">
//                 <StyledView className="flex-row items-center justify-between mb-1">
//                   <StyledView className="flex-row items-center gap-2 flex-1">
//                     <StyledText
//                       className="font-bold text-base text-foreground"
//                       numberOfLines={1}
//                     >
//                       {chat.name}
//                     </StyledText>
//                     {chat.mood && <StyledText className="text-sm">{chat.mood}</StyledText>}
//                   </StyledView>
//                   <StyledText className="text-xs text-muted-foreground ml-2">
//                     {chat.timestamp}
//                   </StyledText>
//                 </StyledView>
//                 <StyledView className="flex-row items-center justify-between">
//                   <StyledText
//                     className={`flex-1 text-sm ${chat.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
//                     numberOfLines={1}
//                   >
//                     {chat.lastMessage}
//                   </StyledText>
//                   {chat.unreadCount > 0 && (
//                     <StyledView
//                       className="w-5 h-5 rounded-full items-center justify-center ml-2"
//                       style={{ backgroundColor: "#E63946" }}
//                     >
//                       <StyledText className="text-white text-xs font-bold">
//                         {chat.unreadCount}
//                       </StyledText>
//                     </StyledView>
//                   )}
//                 </StyledView>
//               </StyledView>
//             </StyledTouchableOpacity>
//           ))
//         )}
//       </ScrollView>

//       {/* Floating Action Button - New Message */}
//       <StyledView className="absolute bottom-24 right-6">
//         <StyledTouchableOpacity
//           className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
//           style={{ backgroundColor: "#E63946" }}
//         >
//           <SendIcon size={24} color="white" />
//         </StyledTouchableOpacity>
//       </StyledView>
//     </StyledSafeAreaView>
//   );
// }


import { Header } from "@/components/Header";
import { useRouter } from "expo-router";
import { Heart, MessageCircle, Search, Send, Users } from "lucide-react-native";
import { useColorScheme } from 'nativewind';
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type VibedProfile = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
};

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
  mood?: string;
};

const VIBED_PROFILES: VibedProfile[] = [
  { id: "1", name: "Alex", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60", isOnline: true },
  { id: "2", name: "Jordan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60", isOnline: true },
  { id: "3", name: "Sam", avatar: "https://images.unsplash.com/photo-1546572797-e8c933a75a1f?w=900&auto=format&fit=crop&q=60", isOnline: false },
  { id: "4", name: "Taylor", avatar: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?w=900&auto=format&fit=crop&q=60", isOnline: true },
  { id: "5", name: "Morgan", avatar: "https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60", isOnline: false },
];

const CHATS: Chat[] = [
  { id: "1", name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60", lastMessage: "Hey! Would love to grab coffee this weekend 😊", timestamp: "2m ago", unreadCount: 2, isOnline: true, mood: "🙂" },
  { id: "2", name: "Jordan Lee", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60", lastMessage: "That sounds amazing! Count me in 🎉", timestamp: "15m ago", unreadCount: 0, isOnline: true, mood: "🔥" },
  { id: "3", name: "LGBTQ+ Community", avatar: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=900&auto=format&fit=crop&q=60", lastMessage: "Sam: Anyone up for pride parade planning?", timestamp: "1h ago", unreadCount: 5, isOnline: true, isGroup: true },
  { id: "4", name: "Sam Chen", avatar: "https://images.unsplash.com/photo-1546572797-e8c933a75a1f?w=900&auto=format&fit=crop&q=60", lastMessage: "Thanks for the recommendation!", timestamp: "3h ago", unreadCount: 0, isOnline: false, mood: "😔" },
  { id: "5", name: "Taylor Swift", avatar: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?w=900&auto=format&fit=crop&q=60", lastMessage: "See you tomorrow! 💕", timestamp: "5h ago", unreadCount: 0, isOnline: true, mood: "💔" },
  { id: "6", name: "Morgan Blake", avatar: "https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60", lastMessage: "Loved our conversation yesterday", timestamp: "Yesterday", unreadCount: 1, isOnline: false, mood: "😵" },
];

export default function InboxScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const COLORS = {
    background: isDark ? '#1c1917' : '#FFF8F5',
    card: isDark ? '#292524' : '#ffffff',
    primary: '#E63946',
    border: isDark ? '#44403c' : '#f0e6e1',
    text: isDark ? '#fafaf9' : '#2B2B2B',
    textMuted: isDark ? '#a8a29e' : '#78716c',
    online: '#2ECC71',
  };
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "unread">("all");

  const filteredChats = CHATS.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || (selectedTab === "unread" && chat.unreadCount > 0);
    return matchesSearch && matchesTab;
  });

  const unreadCount = CHATS.filter(c => c.unreadCount > 0).length;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header notificationCount={3} showNotifications={true} isLoggedIn={true} />

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: COLORS.card, borderRadius: 16,
          paddingHorizontal: 14, paddingVertical: 10,
          borderWidth: 1, borderColor: COLORS.border,
        }}>
          <Search size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="Search messages..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.text }}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16, marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => setSelectedTab("all")}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
            backgroundColor: selectedTab === "all" ? COLORS.primary : COLORS.card,
            borderWidth: 1, borderColor: selectedTab === "all" ? COLORS.primary : COLORS.border,
          }}
        >
          <Text style={{ fontWeight: '700', color: selectedTab === "all" ? '#fff' : COLORS.text }}>
            All Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab("unread")}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
            backgroundColor: selectedTab === "unread" ? COLORS.primary : COLORS.card,
            borderWidth: 1, borderColor: selectedTab === "unread" ? COLORS.primary : COLORS.border,
          }}
        >
          <Text style={{ fontWeight: '700', color: selectedTab === "unread" ? '#fff' : COLORS.text }}>
            Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vibed Profiles */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 }}>
          <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: 'bold' }}>Vibed Profiles</Text>
          <Heart size={18} color={COLORS.primary} fill={COLORS.primary} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
          {VIBED_PROFILES.map((profile) => (
            <TouchableOpacity key={profile.id} style={{ alignItems: 'center' }}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: profile.avatar }}
                  style={{ width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: profile.isOnline ? COLORS.online : COLORS.border }}
                />
                {profile.isOnline && (
                  <View style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: 14, height: 14, borderRadius: 7,
                    backgroundColor: COLORS.online,
                    borderWidth: 2, borderColor: COLORS.background,
                  }} />
                )}
              </View>
              <Text style={{ color: COLORS.text, fontSize: 12, marginTop: 6, fontWeight: '500' }}>
                {profile.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 10 }}>
        {filteredChats.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
            <MessageCircle size={48} color={COLORS.textMuted} />
            <Text style={{ color: COLORS.textMuted, marginTop: 12, fontSize: 15, textAlign: 'center' }}>
              {searchQuery ? "No messages found" : "No unread messages"}
            </Text>
          </View>
        ) : (
          filteredChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              onPress={() => router.push("/chat-detail")}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: COLORS.card, borderRadius: 18,
                padding: 14, borderWidth: 1, borderColor: COLORS.border,
              }}
            >
              {/* Avatar */}
              <View style={{ position: 'relative', marginRight: 12 }}>
                <Image
                  source={{ uri: chat.avatar }}
                  style={{ width: 54, height: 54, borderRadius: 27 }}
                />
                {chat.isOnline && (
                  <View style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: 13, height: 13, borderRadius: 7,
                    backgroundColor: COLORS.online,
                    borderWidth: 2, borderColor: COLORS.card,
                  }} />
                )}
                {chat.isGroup && (
                  <View style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 22, height: 22, borderRadius: 11,
                    backgroundColor: COLORS.primary,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Users size={11} color="white" />
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 6 }}>
                    <Text style={{ color: COLORS.text, fontWeight: 'bold', fontSize: 15 }} numberOfLines={1}>
                      {chat.name}
                    </Text>
                    {chat.mood && <Text style={{ fontSize: 13 }}>{chat.mood}</Text>}
                  </View>
                  <Text style={{ color: COLORS.textMuted, fontSize: 12, marginLeft: 8 }}>{chat.timestamp}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      flex: 1, fontSize: 13,
                      color: chat.unreadCount > 0 ? COLORS.text : COLORS.textMuted,
                      fontWeight: chat.unreadCount > 0 ? '600' : '400',
                    }}
                    numberOfLines={1}
                  >
                    {chat.lastMessage}
                  </Text>
                  {chat.unreadCount > 0 && (
                    <View style={{
                      width: 20, height: 20, borderRadius: 10,
                      backgroundColor: COLORS.primary,
                      alignItems: 'center', justifyContent: 'center', marginLeft: 8,
                    }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{chat.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <View style={{ position: 'absolute', bottom: 90, right: 20 }}>
        <TouchableOpacity
          style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: COLORS.primary,
            alignItems: 'center', justifyContent: 'center',
            shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
          }}
        >
          <Send size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
