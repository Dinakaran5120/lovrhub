// import { useRouter } from "expo-router";
// import {
//     ArrowLeft,
//     MoreVertical,
//     Paperclip,
//     Phone,
//     Plus,
//     Send,
//     Smile,
//     Video,
// } from "lucide-react-native";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     Image,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// type Message = {
//   id: string;
//   text: string;
//   timestamp: string;
//   isMine: boolean;
//   isRead?: boolean;
// };

// const MOCK_MESSAGES: Message[] = [
//   {
//     id: "1",
//     text: "Hey! How are you doing?",
//     timestamp: "10:30 AM",
//     isMine: false,
//   },
//   {
//     id: "2",
//     text: "I'm great! Just finished work. How about you?",
//     timestamp: "10:32 AM",
//     isMine: true,
//     isRead: true,
//   },
//   {
//     id: "3",
//     text: "Same here! Would love to grab coffee this weekend 😊",
//     timestamp: "10:35 AM",
//     isMine: false,
//   },
//   {
//     id: "4",
//     text: "That sounds perfect! Saturday afternoon?",
//     timestamp: "10:36 AM",
//     isMine: true,
//     isRead: true,
//   },
//   {
//     id: "5",
//     text: "Yes! There's a new place downtown I've been wanting to try",
//     timestamp: "10:38 AM",
//     isMine: false,
//   },
//   {
//     id: "6",
//     text: "Perfect! Let's meet at 3 PM?",
//     timestamp: "10:40 AM",
//     isMine: true,
//     isRead: false,
//   },
// ];

// export default function ChatDetailScreen() {
//   const router = useRouter();
//   const scrollViewRef = useRef<ScrollView>(null);

//   const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
//   const [inputText, setInputText] = useState("");

//   // Mock chat data - in production, this would come from navigation params or state
//   const name = "Alex Rivera";
//   const avatar =
//     "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60";
//   const isUserOnline = true;
//   const isGroupChat = false;
//   const mood = "🙂";

//   useEffect(() => {
//     // Scroll to bottom on mount
//     setTimeout(() => {
//       scrollViewRef.current?.scrollToEnd({ animated: false });
//     }, 100);
//   }, []);

//   const handleSend = () => {
//     if (inputText.trim()) {
//       const newMessage: Message = {
//         id: Date.now().toString(),
//         text: inputText.trim(),
//         timestamp: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         isMine: true,
//         isRead: false,
//       };
//       setMessages([...messages, newMessage]);
//       setInputText("");

//       // Scroll to bottom after sending
//       setTimeout(() => {
//         scrollViewRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       {/* Custom Header */}
//       <View className="px-4 py-3 flex-row items-center justify-between border-b border-border bg-card">
//         {/* Left: Back + Avatar + Name */}
//         <View className="flex-row items-center flex-1">
//           <TouchableOpacity
//             onPress={() => router.back()}
//             className="mr-3 p-2 -ml-2"
//           >
//             <ArrowLeft size={24} className="text-foreground" />
//           </TouchableOpacity>

//           <View className="relative mr-3">
//             <Image
//               source={{ uri: avatar }}
//               className="w-10 h-10 rounded-full"
//             />
//             {isUserOnline && !isGroupChat && (
//               <View
//                 className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card"
//                 style={{ backgroundColor: "#2ECC71" }}
//               />
//             )}
//           </View>

//           <View className="flex-1">
//             <View className="flex-row items-center gap-2">
//               <Text
//                 className="font-bold text-base text-foreground"
//                 numberOfLines={1}
//               >
//                 {name}
//               </Text>
//               {mood && <Text className="text-sm">{mood}</Text>}
//             </View>
//             {!isGroupChat && (
//               <Text className="text-xs text-muted-foreground">
//                 {isUserOnline ? "Online" : "Offline"}
//               </Text>
//             )}
//             {isGroupChat && (
//               <Text className="text-xs text-muted-foreground">12 members</Text>
//             )}
//           </View>
//         </View>

//         {/* Right: Action Buttons */}
//         <View className="flex-row items-center gap-2">
//           <TouchableOpacity className="p-2">
//             <Phone size={22} className="text-primary" />
//           </TouchableOpacity>
//           <TouchableOpacity className="p-2">
//             <Video size={22} className="text-primary" />
//           </TouchableOpacity>
//           {isGroupChat && (
//             <TouchableOpacity className="p-2">
//               <Plus size={22} className="text-primary" />
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity className="p-2">
//             <MoreVertical size={22} className="text-muted-foreground" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Messages */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//         keyboardVerticalOffset={0}
//       >
//         <ScrollView
//           ref={scrollViewRef}
//           contentContainerStyle={{
//             paddingHorizontal: 16,
//             paddingVertical: 16,
//             paddingBottom: 8,
//           }}
//           showsVerticalScrollIndicator={false}
//         >
//           {messages.map((message, index) => {
//             const showTimestamp =
//               index === 0 ||
//               messages[index - 1].timestamp !== message.timestamp;

//             return (
//               <View key={message.id}>
//                 {/* Timestamp Divider */}
//                 {showTimestamp && (
//                   <View className="items-center my-4">
//                     <View className="px-3 py-1 rounded-full bg-muted">
//                       <Text className="text-xs text-muted-foreground">
//                         {message.timestamp}
//                       </Text>
//                     </View>
//                   </View>
//                 )}

//                 {/* Message Bubble */}
//                 <View
//                   className={`mb-2 ${message.isMine ? "items-end" : "items-start"}`}
//                 >
//                   <View
//                     className={`max-w-[75%] px-4 py-3 rounded-2xl ${
//                       message.isMine
//                         ? "bg-primary rounded-tr-sm"
//                         : "bg-card rounded-tl-sm"
//                     }`}
//                   >
//                     <Text
//                       className={`text-base ${message.isMine ? "text-white" : "text-foreground"}`}
//                     >
//                       {message.text}
//                     </Text>
//                   </View>

//                   {/* Read Status */}
//                   {message.isMine && (
//                     <Text className="text-xs text-muted-foreground mt-1 mr-1">
//                       {message.isRead ? "Read" : "Delivered"}
//                     </Text>
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </ScrollView>

//         {/* Input Bar */}
//         <View className="px-4 py-3 border-t border-border bg-card">
//           <View className="flex-row items-center gap-2">
//             {/* Attachment Button */}
//             <TouchableOpacity className="p-2">
//               <Paperclip size={22} className="text-muted-foreground" />
//             </TouchableOpacity>

//             {/* Input Field */}
//             <View className="flex-1 flex-row items-center px-4 py-2 rounded-full bg-muted">
//               <TextInput
//                 placeholder="Type a message..."
//                 placeholderTextColor="#999"
//                 value={inputText}
//                 onChangeText={setInputText}
//                 multiline
//                 maxLength={500}
//                 className="flex-1 text-base text-foreground max-h-24"
//               />
//               <TouchableOpacity className="ml-2">
//                 <Smile size={22} className="text-muted-foreground" />
//               </TouchableOpacity>
//             </View>

//             {/* Send Button */}
//             <TouchableOpacity
//               onPress={handleSend}
//               className="w-10 h-10 rounded-full items-center justify-center"
//               style={{ backgroundColor: inputText.trim() ? "#E63946" : "#CCC" }}
//               disabled={!inputText.trim()}
//             >
//               <Send size={20} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }


import { useRouter } from "expo-router";
import { ArrowLeft, MoreVertical, Paperclip, Phone, Send, Smile, Video } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
  muted: '#2a2a2a',
  online: '#2ECC71',
};

type Message = { id: string; text: string; timestamp: string; isMine: boolean; isRead?: boolean; };

const MOCK_MESSAGES: Message[] = [
  { id: "1", text: "Hey! How are you doing?", timestamp: "10:30 AM", isMine: false },
  { id: "2", text: "I'm great! Just finished work. How about you?", timestamp: "10:32 AM", isMine: true, isRead: true },
  { id: "3", text: "Same here! Would love to grab coffee this weekend 😊", timestamp: "10:35 AM", isMine: false },
  { id: "4", text: "That sounds perfect! Saturday afternoon?", timestamp: "10:36 AM", isMine: true, isRead: true },
  { id: "5", text: "Yes! There's a new place downtown I've been wanting to try", timestamp: "10:38 AM", isMine: false },
  { id: "6", text: "Perfect! Let's meet at 3 PM?", timestamp: "10:40 AM", isMine: true, isRead: false },
];

const name = "Alex Rivera";
const avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60";
const isUserOnline = true;
const mood = "🙂";

export default function ChatDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMine: true, isRead: false,
    }]);
    setInputText("");
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 12, paddingVertical: 12,
        backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 4 }}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={{ position: 'relative', marginRight: 10 }}>
            <Image source={{ uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            {isUserOnline && (
              <View style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 12, height: 12, borderRadius: 6,
                backgroundColor: COLORS.online, borderWidth: 2, borderColor: COLORS.card,
              }} />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: COLORS.text, fontWeight: 'bold', fontSize: 15 }} numberOfLines={1}>
                {name}
              </Text>
              <Text style={{ fontSize: 14 }}>{mood}</Text>
            </View>
            <Text style={{ color: COLORS.online, fontSize: 12 }}>Online</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ padding: 8 }}><Phone size={20} color={COLORS.primary} /></TouchableOpacity>
          <TouchableOpacity style={{ padding: 8 }}><Video size={20} color={COLORS.primary} /></TouchableOpacity>
          <TouchableOpacity style={{ padding: 8 }}><MoreVertical size={20} color={COLORS.textMuted} /></TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => {
            const showTimestamp = index === 0 || messages[index - 1].timestamp !== message.timestamp;
            return (
              <View key={message.id}>
                {showTimestamp && (
                  <View style={{ alignItems: 'center', marginVertical: 14 }}>
                    <View style={{ backgroundColor: COLORS.muted, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 }}>
                      <Text style={{ color: COLORS.textMuted, fontSize: 11 }}>{message.timestamp}</Text>
                    </View>
                  </View>
                )}
                <View style={{ marginBottom: 8, alignItems: message.isMine ? 'flex-end' : 'flex-start' }}>
                  <View style={{
                    maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12,
                    borderRadius: 20,
                    borderTopRightRadius: message.isMine ? 4 : 20,
                    borderTopLeftRadius: message.isMine ? 20 : 4,
                    backgroundColor: message.isMine ? COLORS.primary : COLORS.card,
                  }}>
                    <Text style={{ color: 'white', fontSize: 15, lineHeight: 21 }}>{message.text}</Text>
                  </View>
                  {message.isMine && (
                    <Text style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 3, marginRight: 4 }}>
                      {message.isRead ? "Read" : "Delivered"}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          paddingHorizontal: 12, paddingVertical: 10,
          borderTopWidth: 1, borderTopColor: COLORS.border,
          backgroundColor: COLORS.card,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        }}>
          <TouchableOpacity style={{ padding: 6 }}>
            <Paperclip size={22} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={{
            flex: 1, flexDirection: 'row', alignItems: 'center',
            backgroundColor: COLORS.muted, borderRadius: 24,
            paddingHorizontal: 14, paddingVertical: 8,
            borderWidth: 1, borderColor: COLORS.border,
          }}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor={COLORS.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              style={{ flex: 1, color: COLORS.text, fontSize: 15, maxHeight: 96 }}
            />
            <TouchableOpacity style={{ marginLeft: 8 }}>
              <Smile size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={{
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: inputText.trim() ? COLORS.primary : COLORS.border,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Send size={18} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}