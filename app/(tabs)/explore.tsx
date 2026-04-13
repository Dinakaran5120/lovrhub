// import { Header } from '@/components/Header';
// import { BookmarkIcon, HeartIcon, MessageCircleIcon, StyledSafeAreaView, StyledText, StyledTouchableOpacity, StyledView } from '@/components/NativeWind';
// import { useState } from 'react';
// import { ScrollView, TextInput } from 'react-native';

// // Mock data for anonymous mood feed
// const mockMoods = [
//   {
//     id: '1',
//     emoji: '😔',
//     mood: 'Lonely',
//     text: "Sometimes I feel like I'm the only one who truly understands what it's like to crave connection but fear rejection at the same time.",
//     time: '2m ago',
//     reactions: { relate: 42, respond: 8, save: 12 },
//   },
//   {
//     id: '2',
//     emoji: '💔',
//     mood: 'Heartbroken',
//     text: "It's been 3 months and I still check their Instagram every day. When does it stop hurting?",
//     time: '15m ago',
//     reactions: { relate: 156, respond: 34, save: 23 },
//   },
//   {
//     id: '3',
//     emoji: '🙂',
//     mood: 'Happy',
//     text: "Had the best first date today! We talked for 4 hours straight and didn't even notice the time passing. Feeling hopeful for the first time in months 💕",
//     time: '1h ago',
//     reactions: { relate: 89, respond: 21, save: 45 },
//   },
//   {
//     id: '4',
//     emoji: '😵',
//     mood: 'Stressed',
//     text: "Juggling three different conversations and I have no idea what I'm doing. Why is modern dating so complicated?",
//     time: '2h ago',
//     reactions: { relate: 203, respond: 67, save: 18 },
//   },
//   {
//     id: '5',
//     emoji: '🔥',
//     mood: 'Adult feelings',
//     text: "Is it just me or does anyone else get butterflies when you see that 'typing...' notification from your crush?",
//     time: '3h ago',
//     reactions: { relate: 312, respond: 45, save: 89 },
//   },
//   {
//     id: '6',
//     emoji: '😔',
//     mood: 'Lonely',
//     text: "Friday night and all my friends are out with their partners. Just me and Netflix again. Starting to wonder if I'll ever find my person.",
//     time: '4h ago',
//     reactions: { relate: 178, respond: 52, save: 34 },
//   },
// ];

// const moods = [
//   { emoji: '😔', label: 'Lonely', color: '#6B7280' },
//   { emoji: '🙂', label: 'Happy', color: '#2ECC71' },
//   { emoji: '😵', label: 'Stressed', color: '#F4C430' },
//   { emoji: '💔', label: 'Heartbroken', color: '#E63946' },
//   { emoji: '🔥', label: 'Adult feelings', color: '#FF8C6B' },
// ];

// export default function ExploreScreen() {
//   const [selectedMood, setSelectedMood] = useState<string | null>(null);
//   const [moodText, setMoodText] = useState('');
//   const [feedData, setFeedData] = useState(mockMoods);

//   const handleShare = () => {
//     if (!selectedMood || !moodText.trim()) return;

//     const newMood = {
//       id: Date.now().toString(),
//       emoji: moods.find(m => m.label === selectedMood)?.emoji || '🙂',
//       mood: selectedMood,
//       text: moodText,
//       time: 'Just now',
//       reactions: { relate: 0, respond: 0, save: 0 },
//     };

//     setFeedData([newMood, ...feedData]);
//     setMoodText('');
//     setSelectedMood(null);
//   };

//   const filteredFeed = selectedMood
//     ? feedData.filter(item => item.mood === selectedMood)
//     : feedData;

//   return (
//     <StyledSafeAreaView className="flex-1 bg-background">
//       <Header notificationCount={5} showNotifications={true} isLoggedIn={true} />
//       <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Header */}
//         <StyledView className="px-6 pt-4 pb-6">
//           <StyledText className="text-3xl font-bold text-foreground">Mood Space</StyledText>
//           <StyledText className="text-muted-foreground mt-1">
//             Share your feelings anonymously. You're not alone.
//           </StyledText>
//         </StyledView>

//         {/* Mood Selector Row */}
//         <StyledView className="px-6 mb-6">
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ gap: 12 }}
//           >
//             {moods.map((mood) => (
//               <StyledTouchableOpacity
//                 key={mood.label}
//                 onPress={() => setSelectedMood(selectedMood === mood.label ? null : mood.label)}
//                 className={`px-4 py-3 rounded-full flex-row items-center gap-2 ${
//                   selectedMood === mood.label ? 'bg-primary' : 'bg-card'
//                 }`}
//                 style={{
//                   borderWidth: 1,
//                   borderColor: selectedMood === mood.label ? '#E63946' : '#e5e7eb',
//                   shadowColor: '#000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.05,
//                   shadowRadius: 4,
//                   elevation: 2,
//                 }}
//               >
//                 <StyledText style={{ fontSize: 20 }}>{mood.emoji}</StyledText>
//                 <StyledText
//                   className={`font-medium ${
//                     selectedMood === mood.label ? 'text-white' : 'text-foreground'
//                   }`}
//                 >
//                   {mood.label}
//                 </StyledText>
//               </StyledTouchableOpacity>
//             ))}
//           </ScrollView>
//         </StyledView>

//         {/* Share Mood Card */}
//         <StyledView className="px-6 mb-8">
//           <StyledView
//             className="bg-card rounded-2xl p-5"
//             style={{
//               borderWidth: 1,
//               borderColor: '#e5e7eb',
//               shadowColor: '#000',
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.08,
//               shadowRadius: 12,
//               elevation: 4,
//             }}
//           >
//             <StyledText className="text-lg font-semibold text-foreground mb-3">
//               How are you feeling?
//             </StyledText>

//             <TextInput
//               value={moodText}
//               onChangeText={setMoodText}
//               placeholder="Share your thoughts anonymously... (120 chars)"
//               placeholderTextColor="#9ca3af"
//               multiline
//               maxLength={120}
//               className="bg-background rounded-xl p-4 text-foreground mb-4"
//               style={{
//                 minHeight: 100,
//                 textAlignVertical: 'top',
//                 fontSize: 15,
//                 borderWidth: 1,
//                 borderColor: '#e5e7eb',
//               }}
//             />

//             <StyledView className="flex-row items-center justify-between">
//               <StyledText className="text-sm text-muted-foreground">
//                 {moodText.length}/120
//               </StyledText>

//               <StyledTouchableOpacity
//                 onPress={handleShare}
//                 disabled={!selectedMood || !moodText.trim()}
//                 className={`px-6 py-3 rounded-full ${
//                   selectedMood && moodText.trim() ? 'bg-primary' : 'bg-muted'
//                 }`}
//               >
//                 <StyledText
//                   className={`font-semibold ${
//                     selectedMood && moodText.trim() ? 'text-white' : 'text-muted-foreground'
//                   }`}
//                 >
//                   Share Anonymously
//                 </StyledText>
//               </StyledTouchableOpacity>
//             </StyledView>
//           </StyledView>
//         </StyledView>

//         {/* Anonymous Mood Feed */}
//         <StyledView className="px-6">
//           <StyledText className="text-xl font-bold text-foreground mb-4">
//             {selectedMood ? `${selectedMood} Moods` : 'Community Moods'}
//           </StyledText>

//           <StyledView className="gap-4">
//             {filteredFeed.map((item) => (
//               <StyledView
//                 key={item.id}
//                 className="bg-card rounded-2xl p-5"
//                 style={{
//                   borderWidth: 1,
//                   borderColor: '#e5e7eb',
//                   shadowColor: '#000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.06,
//                   shadowRadius: 8,
//                   elevation: 3,
//                 }}
//               >
//                 {/* Emoji & Time */}
//                 <StyledView className="flex-row items-center justify-between mb-3">
//                   <StyledView className="flex-row items-center gap-2">
//                     <StyledText style={{ fontSize: 28 }}>{item.emoji}</StyledText>
//                     <StyledView
//                       className="px-3 py-1 rounded-full"
//                       style={{
//                         backgroundColor:
//                           item.mood === 'Lonely'
//                             ? '#f3f4f6'
//                             : item.mood === 'Happy'
//                             ? '#d1fae5'
//                             : item.mood === 'Stressed'
//                             ? '#fef3c7'
//                             : item.mood === 'Heartbroken'
//                             ? '#fee2e2'
//                             : '#fed7aa',
//                       }}
//                     >
//                       <StyledText className="text-xs font-medium text-foreground">
//                         {item.mood}
//                       </StyledText>
//                     </StyledView>
//                   </StyledView>
//                   <StyledText className="text-sm text-muted-foreground">{item.time}</StyledText>
//                 </StyledView>

//                 {/* Mood Text */}
//                 <StyledText className="text-foreground leading-6 mb-4">{item.text}</StyledText>

//                 {/* Interactions */}
//                 <StyledView className="flex-row items-center gap-6 pt-3 border-t border-border">
//                   <StyledTouchableOpacity className="flex-row items-center gap-2">
//                     <HeartIcon size={20} color="#E63946" />
//                     <StyledText className="text-sm font-medium text-foreground">
//                       {item.reactions.relate}
//                     </StyledText>
//                     <StyledText className="text-sm text-muted-foreground">Relate</StyledText>
//                   </StyledTouchableOpacity>

//                   <StyledTouchableOpacity className="flex-row items-center gap-2">
//                     <MessageCircleIcon size={20} color="#6B7280" />
//                     <StyledText className="text-sm font-medium text-foreground">
//                       {item.reactions.respond}
//                     </StyledText>
//                     <StyledText className="text-sm text-muted-foreground">Respond</StyledText>
//                   </StyledTouchableOpacity>

//                   <StyledTouchableOpacity className="flex-row items-center gap-2">
//                     <BookmarkIcon size={20} color="#6B7280" />
//                     <StyledText className="text-sm font-medium text-foreground">
//                       {item.reactions.save}
//                     </StyledText>
//                     <StyledText className="text-sm text-muted-foreground">Save</StyledText>
//                   </StyledTouchableOpacity>
//                 </StyledView>
//               </StyledView>
//             ))}
//           </StyledView>
//         </StyledView>

//         {/* Empty State */}
//         {filteredFeed.length === 0 && (
//           <StyledView className="items-center py-12 px-6">
//             <StyledText style={{ fontSize: 48 }} className="mb-4">
//               {selectedMood
//                 ? moods.find(m => m.label === selectedMood)?.emoji
//                 : '💭'}
//             </StyledText>
//             <StyledText className="text-xl font-semibold text-foreground text-center mb-2">
//               No moods yet
//             </StyledText>
//             <StyledText className="text-muted-foreground text-center">
//               {selectedMood
//                 ? `Be the first to share a ${selectedMood.toLowerCase()} mood`
//                 : 'Share how you"re feeling to start the conversation'}
//             </StyledText>
//           </StyledView>
//         )}
//       </ScrollView>
//     </StyledSafeAreaView>
//   );
// }

//top perfect 
// import { Header } from '@/components/Header';
// import { BookmarkIcon, HeartIcon, MessageCircleIcon, StyledText, StyledTouchableOpacity, StyledView } from '@/components/NativeWind';
// import { useState } from 'react';
// import { ScrollView, TextInput } from 'react-native';

// const mockMoods = [
//   {
//     id: '1',
//     emoji: '😔',
//     mood: 'Lonely',
//     text: "Sometimes I feel like I'm the only one who truly understands what it's like to crave connection but fear rejection at the same time.",
//     time: '2m ago',
//     reactions: { relate: 42, respond: 8, save: 12 },
//   },
//   {
//     id: '2',
//     emoji: '💔',
//     mood: 'Heartbroken',
//     text: "It's been 3 months and I still check their Instagram every day. When does it stop hurting?",
//     time: '15m ago',
//     reactions: { relate: 156, respond: 34, save: 23 },
//   },
//   {
//     id: '3',
//     emoji: '🙂',
//     mood: 'Happy',
//     text: "Had the best first date today! We talked for 4 hours straight and didn't even notice the time passing. Feeling hopeful for the first time in months 💕",
//     time: '1h ago',
//     reactions: { relate: 89, respond: 21, save: 45 },
//   },
//   {
//     id: '4',
//     emoji: '😵',
//     mood: 'Stressed',
//     text: "Juggling three different conversations and I have no idea what I'm doing. Why is modern dating so complicated?",
//     time: '2h ago',
//     reactions: { relate: 203, respond: 67, save: 18 },
//   },
//   {
//     id: '5',
//     emoji: '🔥',
//     mood: 'Adult feelings',
//     text: "Is it just me or does anyone else get butterflies when you see that 'typing...' notification from your crush?",
//     time: '3h ago',
//     reactions: { relate: 312, respond: 45, save: 89 },
//   },
//   {
//     id: '6',
//     emoji: '😔',
//     mood: 'Lonely',
//     text: "Friday night and all my friends are out with their partners. Just me and Netflix again. Starting to wonder if I'll ever find my person.",
//     time: '4h ago',
//     reactions: { relate: 178, respond: 52, save: 34 },
//   },
// ];

// const moods = [
//   { emoji: '😔', label: 'Lonely', color: '#6B7280' },
//   { emoji: '🙂', label: 'Happy', color: '#2ECC71' },
//   { emoji: '😵', label: 'Stressed', color: '#F4C430' },
//   { emoji: '💔', label: 'Heartbroken', color: '#E63946' },
//   { emoji: '🔥', label: 'Adult feelings', color: '#FF8C6B' },
// ];

// export default function ExploreScreen() {
//   const [selectedMood, setSelectedMood] = useState<string | null>(null);
//   const [moodText, setMoodText] = useState('');
//   const [feedData, setFeedData] = useState(mockMoods);

//   const handleShare = () => {
//     if (!selectedMood || !moodText.trim()) return;
//     const newMood = {
//       id: Date.now().toString(),
//       emoji: moods.find(m => m.label === selectedMood)?.emoji || '🙂',
//       mood: selectedMood,
//       text: moodText,
//       time: 'Just now',
//       reactions: { relate: 0, respond: 0, save: 0 },
//     };
//     setFeedData([newMood, ...feedData]);
//     setMoodText('');
//     setSelectedMood(null);
//   };

//   const filteredFeed = selectedMood
//     ? feedData.filter(item => item.mood === selectedMood)
//     : feedData;

//   return (
//     <StyledView style={{ flex: 1 }} className="bg-background">
//       <Header notificationCount={5} showNotifications={true} isLoggedIn={true} />

//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       >
//         <StyledView className="px-6 pt-4 pb-6">
//           <StyledText className="text-3xl font-bold text-foreground">Mood Space</StyledText>
//           <StyledText className="text-muted-foreground mt-1">
//             Share your feelings anonymously. You're not alone.
//           </StyledText>
//         </StyledView>

//         {/* Mood Selector Row */}
//         <StyledView className="px-6 mb-6">
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ gap: 12 }}
//           >
//             {moods.map((mood) => (
//               <StyledTouchableOpacity
//                 key={mood.label}
//                 onPress={() => setSelectedMood(selectedMood === mood.label ? null : mood.label)}
//                 className={`px-4 py-3 rounded-full flex-row items-center gap-2 ${
//                   selectedMood === mood.label ? 'bg-primary' : 'bg-card'
//                 }`}
//                 style={{
//                   borderWidth: 1,
//                   borderColor: selectedMood === mood.label ? '#E63946' : '#e5e7eb',
//                   shadowColor: '#000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.05,
//                   shadowRadius: 4,
//                   elevation: 2,
//                 }}
//               >
//                 <StyledText style={{ fontSize: 20 }}>{mood.emoji}</StyledText>
//                 <StyledText
//                   className={`font-medium ${
//                     selectedMood === mood.label ? 'text-white' : 'text-foreground'
//                   }`}
//                 >
//                   {mood.label}
//                 </StyledText>
//               </StyledTouchableOpacity>
//             ))}
//           </ScrollView>
//         </StyledView>

//         {/* Share Mood Card */}
//         <StyledView className="px-6 mb-8">
//           <StyledView
//             className="bg-card rounded-2xl p-5"
//             style={{
//               borderWidth: 1, borderColor: '#e5e7eb',
//               shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
//             }}
//           >
//             <StyledText className="text-lg font-semibold text-foreground mb-3">
//               How are you feeling?
//             </StyledText>

//             <TextInput
//               value={moodText}
//               onChangeText={setMoodText}
//               placeholder="Share your thoughts anonymously... (120 chars)"
//               placeholderTextColor="#9ca3af"
//               multiline
//               maxLength={120}
//               className="bg-background rounded-xl p-4 text-foreground mb-4"
//               style={{
//                 minHeight: 100, textAlignVertical: 'top', fontSize: 15,
//                 borderWidth: 1, borderColor: '#e5e7eb',
//               }}
//             />

//             <StyledView className="flex-row items-center justify-between">
//               <StyledText className="text-sm text-muted-foreground">
//                 {moodText.length}/120
//               </StyledText>
//               <StyledTouchableOpacity
//                 onPress={handleShare}
//                 disabled={!selectedMood || !moodText.trim()}
//                 className={`px-6 py-3 rounded-full ${
//                   selectedMood && moodText.trim() ? 'bg-primary' : 'bg-muted'
//                 }`}
//               >
//                 <StyledText
//                   className={`font-semibold ${
//                     selectedMood && moodText.trim() ? 'text-white' : 'text-muted-foreground'
//                   }`}
//                 >
//                   Share Anonymously
//                 </StyledText>
//               </StyledTouchableOpacity>
//             </StyledView>
//           </StyledView>
//         </StyledView>

//         {/* Mood Feed */}
//         <StyledView className="px-6">
//           <StyledText className="text-xl font-bold text-foreground mb-4">
//             {selectedMood ? `${selectedMood} Moods` : 'Community Moods'}
//           </StyledText>

//           <StyledView className="gap-4">
//             {filteredFeed.map((item) => (
//               <StyledView
//                 key={item.id}
//                 className="bg-card rounded-2xl p-5"
//                 style={{
//                   borderWidth: 1, borderColor: '#e5e7eb',
//                   shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
//                 }}
//               >
//                 <StyledView className="flex-row items-center justify-between mb-3">
//                   <StyledView className="flex-row items-center gap-2">
//                     <StyledText style={{ fontSize: 28 }}>{item.emoji}</StyledText>
//                     <StyledView
//                       className="px-3 py-1 rounded-full"
//                       style={{
//                         backgroundColor:
//                           item.mood === 'Lonely' ? '#f3f4f6' :
//                           item.mood === 'Happy' ? '#d1fae5' :
//                           item.mood === 'Stressed' ? '#fef3c7' :
//                           item.mood === 'Heartbroken' ? '#fee2e2' : '#fed7aa',
//                       }}
//                     >
//                       <StyledText className="text-xs font-medium text-foreground">
//                         {item.mood}
//                       </StyledText>
//                     </StyledView>
//                   </StyledView>
//                   <StyledText className="text-sm text-muted-foreground">{item.time}</StyledText>
//                 </StyledView>

//                 <StyledText className="text-foreground leading-6 mb-4">{item.text}</StyledText>

//                 <StyledView className="flex-row items-center gap-6 pt-3 border-t border-border">
//                   <StyledTouchableOpacity className="flex-row items-center gap-2">
//                     <HeartIcon size={20} color="#E63946" />
//                     <StyledText className="text-sm font-medium text-foreground">{item.reactions.relate}</StyledText>
//                     <StyledText className="text-sm text-muted-foreground">Relate</StyledText>
//                   </StyledTouchableOpacity>

//                   <StyledTouchableOpacity className="flex-row items-center gap-2">
//                     <MessageCircleIcon size={20} color="#6B7280" />
//                     <StyledText className="text-sm font-medium text-foreground">{item.reactions.respond}</StyledText>
//                     <StyledText className="text-sm text-muted-foreground">Respond</StyledText>
//                   </StyledTouchableOpacity>

//                   <StyledTouchableOpacity className="flex-row items-center gap-2">
//                     <BookmarkIcon size={20} color="#6B7280" />
//                     <StyledText className="text-sm font-medium text-foreground">{item.reactions.save}</StyledText>
//                     <StyledText className="text-sm text-muted-foreground">Save</StyledText>
//                   </StyledTouchableOpacity>
//                 </StyledView>
//               </StyledView>
//             ))}
//           </StyledView>
//         </StyledView>

//         {/* Empty State */}
//         {filteredFeed.length === 0 && (
//           <StyledView className="items-center py-12 px-6">
//             <StyledText style={{ fontSize: 48 }} className="mb-4">
//               {selectedMood ? moods.find(m => m.label === selectedMood)?.emoji : '💭'}
//             </StyledText>
//             <StyledText className="text-xl font-semibold text-foreground text-center mb-2">
//               No moods yet
//             </StyledText>
//             <StyledText className="text-muted-foreground text-center">
//               {selectedMood
//                 ? `Be the first to share a ${selectedMood.toLowerCase()} mood`
//                 : "Share how you're feeling to start the conversation"}
//             </StyledText>
//           </StyledView>
//         )}
//       </ScrollView>
//     </StyledView>
//   );
// }

import { Header } from '@/components/Header';
import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Compass, Heart, Lock, MessageCircle, Plus, Search, Send, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

// ── Types ─────────────────────────────────────────────────────────────────────

type MoodComment = { id: string; text: string; time: string };
type MoodItem = {
  id: string; emoji: string; mood: string; text: string; time: string;
  reactions: { relate: number; comments: number };
  liked: boolean;
  comments: MoodComment[];
};
type Community = {
  id: string; name: string; description: string;
  members: number; emoji: string; isPrivate: boolean;
  joined: boolean; requested: boolean;
};

// ── Static data ──────────────────────────────────────────────────────────────

const initialMoods: MoodItem[] = [
  { id: '1', emoji: '😔', mood: 'Lonely', text: "Sometimes I feel like I'm the only one who truly understands what it's like to crave connection but fear rejection at the same time.", time: '2m ago', reactions: { relate: 42, comments: 8 }, liked: false, comments: [{ id: 'c1', text: 'You're not alone 💕', time: '1m ago' }, { id: 'c2', text: 'Same here, sending hugs', time: '30s ago' }] },
  { id: '2', emoji: '💔', mood: 'Heartbroken', text: "It's been 3 months and I still check their Instagram every day. When does it stop hurting?", time: '15m ago', reactions: { relate: 156, comments: 34 }, liked: false, comments: [{ id: 'c3', text: 'It gets better, I promise 🌸', time: '10m ago' }] },
  { id: '3', emoji: '🙂', mood: 'Happy', text: "Had the best first date today! We talked for 4 hours straight and didn't even notice the time passing. Feeling hopeful 💕", time: '1h ago', reactions: { relate: 89, comments: 21 }, liked: false, comments: [] },
  { id: '4', emoji: '😵', mood: 'Stressed', text: "Juggling three different conversations and I have no idea what I'm doing. Why is modern dating so complicated?", time: '2h ago', reactions: { relate: 203, comments: 67 }, liked: false, comments: [{ id: 'c4', text: 'Felt this 😅', time: '1h ago' }] },
  { id: '5', emoji: '🔥', mood: 'Adult feelings', text: "Is it just me or does anyone else get butterflies when you see that 'typing...' notification from your crush?", time: '3h ago', reactions: { relate: 312, comments: 45 }, liked: false, comments: [] },
  { id: '6', emoji: '😔', mood: 'Lonely', text: "Friday night and all my friends are out with their partners. Just me and Netflix again.", time: '4h ago', reactions: { relate: 178, comments: 52 }, liked: false, comments: [] },
];

const moods = [
  { emoji: '😔', label: 'Lonely' },
  { emoji: '🙂', label: 'Happy' },
  { emoji: '😵', label: 'Stressed' },
  { emoji: '💔', label: 'Heartbroken' },
  { emoji: '🔥', label: 'Adult feelings' },
];

const moodTagColors: Record<string, { bg: string; text: string }> = {
  Lonely:           { bg: '#e0e7ff', text: '#3730a3' },
  Happy:            { bg: '#d1fae5', text: '#065f46' },
  Stressed:         { bg: '#fef3c7', text: '#92400e' },
  Heartbroken:      { bg: '#fee2e2', text: '#991b1b' },
  'Adult feelings': { bg: '#fed7aa', text: '#9a3412' },
};

const initialCommunities: Community[] = [
  { id: '1', name: 'Night Owls', description: 'For those who come alive after midnight', members: 2840, emoji: '🦉', isPrivate: false, joined: true, requested: false },
  { id: '2', name: 'Book & Coffee Lovers', description: 'Discuss your latest read over a virtual latte', members: 1593, emoji: '📚', isPrivate: false, joined: false, requested: false },
  { id: '3', name: 'Fitness & Dating', description: 'Gym buddies who are also dating', members: 987, emoji: '💪', isPrivate: true, joined: false, requested: false },
  { id: '4', name: 'LGBTQ+ Safe Space', description: 'Inclusive community for all identities', members: 4210, emoji: '🏳️‍🌈', isPrivate: false, joined: false, requested: false },
  { id: '5', name: 'Travel Romantics', description: 'Explore the world and find love', members: 3120, emoji: '✈️', isPrivate: false, joined: true, requested: false },
  { id: '6', name: 'VIP Lounge', description: 'Private premium community', members: 340, emoji: '👑', isPrivate: true, joined: false, requested: true },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const C = useTheme();
  const { addNotification } = useNotifications();

  // Mood Space state
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodText, setMoodText] = useState('');
  const [feedData, setFeedData] = useState<MoodItem[]>(initialMoods);

  // Comment modal state
  const [commentTarget, setCommentTarget] = useState<MoodItem | null>(null);
  const [newComment, setNewComment] = useState('');

  // Communities state
  const [activeTab, setActiveTab] = useState<'mood' | 'communities'>('mood');
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);
  const [communitySearch, setCommunitySearch] = useState('');

  // + FAB modal state
  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDesc, setNewCommunityDesc] = useState('');
  const [newCommunityPrivate, setNewCommunityPrivate] = useState(false);

  const handleShare = () => {
    if (!selectedMood || !moodText.trim()) return;
    const newItem: MoodItem = {
      id: Date.now().toString(),
      emoji: moods.find(m => m.label === selectedMood)?.emoji || '🙂',
      mood: selectedMood, text: moodText, time: 'Just now',
      reactions: { relate: 0, comments: 0 },
      liked: false, comments: [],
    };
    setFeedData(prev => [newItem, ...prev]);
    setMoodText(''); setSelectedMood(null);
  };

  // Optimistic like toggle — instant UI update + notification
  const handleLike = (id: string) => {
    setFeedData(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nowLiked = !item.liked;
      if (nowLiked) addNotification('like', 'Someone related to your mood post');
      return {
        ...item,
        liked: nowLiked,
        reactions: { ...item.reactions, relate: item.reactions.relate + (nowLiked ? 1 : -1) },
      };
    }));
  };

  // Open comments modal
  const openComments = (item: MoodItem) => setCommentTarget(item);

  // Submit a comment
  const handleAddComment = () => {
    if (!newComment.trim() || !commentTarget) return;
    const comment: MoodComment = { id: Date.now().toString(), text: newComment.trim(), time: 'Just now' };
    setFeedData(prev => prev.map(item => {
      if (item.id !== commentTarget.id) return item;
      return {
        ...item,
        comments: [...item.comments, comment],
        reactions: { ...item.reactions, comments: item.reactions.comments + 1 },
      };
    }));
    // Update the modal target too so the list refreshes
    setCommentTarget(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null);
    addNotification('comment', 'Your comment was added to the mood space');
    setNewComment('');
  };

  const handleJoinToggle = (id: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id !== id) return c;
      if (c.isPrivate && !c.joined) {
        const requesting = !c.requested;
        if (requesting) addNotification('join_request', `Your request to join ${c.name} was sent`);
        return { ...c, requested: requesting };
      }
      const joining = !c.joined;
      if (joining) addNotification('follow', `You joined ${c.name} ${c.emoji}`);
      return { ...c, joined: joining, members: c.joined ? c.members - 1 : c.members + 1 };
    }));
  };

  const handleCreateCommunity = () => {
    if (!newCommunityName.trim()) return;
    const newC: Community = {
      id: Date.now().toString(),
      name: newCommunityName.trim(),
      description: newCommunityDesc.trim() || 'A new community on LovrHub',
      members: 1, emoji: '💖',
      isPrivate: newCommunityPrivate,
      joined: true, requested: false,
    };
    setCommunities(prev => [newC, ...prev]);
    setNewCommunityName(''); setNewCommunityDesc(''); setNewCommunityPrivate(false);
    setCreateModalVisible(false);
  };

  const filteredFeed = selectedMood ? feedData.filter(i => i.mood === selectedMood) : feedData;
  const filteredCommunities = communitySearch
    ? communities.filter(c => c.name.toLowerCase().includes(communitySearch.toLowerCase()))
    : communities;

  const formatMembers = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  // ── Mood Space tab ─────────────────────────────────────────────────────────
  const renderMoodSpace = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
        <Text style={{ color: C.text, fontSize: 26, fontWeight: 'bold' }}>Mood Space</Text>
        <Text style={{ color: C.textMuted, marginTop: 4, fontSize: 14 }}>
          Share your feelings anonymously. You're not alone.
        </Text>
      </View>

      {/* Mood filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 16 }}>
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.label;
          return (
            <TouchableOpacity
              key={mood.label}
              onPress={() => setSelectedMood(isSelected ? null : mood.label)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 8,
                paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999,
                backgroundColor: isSelected ? C.primary : C.card,
                borderWidth: 1, borderColor: isSelected ? C.primary : C.border,
              }}
            >
              <Text style={{ fontSize: 17 }}>{mood.emoji}</Text>
              <Text style={{ color: isSelected ? '#fff' : C.text, fontWeight: '600', fontSize: 14 }}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Share card */}
      <View style={{ paddingHorizontal: 20, marginBottom: 22 }}>
        <View style={{ backgroundColor: C.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: C.border }}>
          <Text style={{ color: C.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>How are you feeling?</Text>
          <TextInput
            value={moodText}
            onChangeText={setMoodText}
            placeholder="Share your thoughts anonymously... (120 chars)"
            placeholderTextColor={C.textMuted}
            multiline maxLength={120}
            style={{
              backgroundColor: C.input, borderRadius: 12, padding: 14,
              color: C.text, minHeight: 90, textAlignVertical: 'top',
              fontSize: 14, borderWidth: 1, borderColor: C.border, marginBottom: 12,
            }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: C.textMuted, fontSize: 13 }}>{moodText.length}/120</Text>
            <TouchableOpacity
              onPress={handleShare}
              disabled={!selectedMood || !moodText.trim()}
              style={{
                paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999,
                backgroundColor: selectedMood && moodText.trim() ? C.primary : C.cardAlt,
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: 14, color: selectedMood && moodText.trim() ? '#fff' : C.textMuted }}>
                Share Anonymously
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Feed title */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={{ color: C.text, fontSize: 18, fontWeight: 'bold' }}>
          {selectedMood ? `${selectedMood} Moods` : 'Community Moods'}
        </Text>
      </View>

      {/* Mood cards */}
      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        {filteredFeed.map((item) => {
          const tag = moodTagColors[item.mood] || { bg: '#f3f4f6', text: '#111' };
          return (
            <View key={item.id} style={{ backgroundColor: C.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: C.border }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: tag.bg }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: tag.text }}>{item.mood}</Text>
                  </View>
                </View>
                <Text style={{ color: C.textMuted, fontSize: 12 }}>{item.time}</Text>
              </View>

              {/* Body */}
              <Text style={{ color: C.text, fontSize: 14, lineHeight: 22, marginBottom: 14 }}>{item.text}</Text>

              {/* Reactions — Like (toggleable) + Comment (no Save) */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border }}>
                <TouchableOpacity
                  onPress={() => handleLike(item.id)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <Heart
                    size={18}
                    color={item.liked ? C.primary : C.textMuted}
                    fill={item.liked ? C.primary : 'transparent'}
                  />
                  <Text style={{ color: item.liked ? C.primary : C.text, fontSize: 13, fontWeight: '600' }}>
                    {item.reactions.relate}
                  </Text>
                  <Text style={{ color: C.textMuted, fontSize: 13 }}>Relate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => openComments(item)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <MessageCircle size={18} color={C.textMuted} />
                  <Text style={{ color: C.text, fontSize: 13, fontWeight: '600' }}>{item.reactions.comments}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 13 }}>Comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {filteredFeed.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>{selectedMood ? moods.find(m => m.label === selectedMood)?.emoji : '💭'}</Text>
          <Text style={{ color: C.text, fontSize: 20, fontWeight: '600', marginBottom: 8, textAlign: 'center' }}>No moods yet</Text>
          <Text style={{ color: C.textMuted, textAlign: 'center', fontSize: 14 }}>
            {selectedMood ? `Be the first to share a ${selectedMood.toLowerCase()} mood` : "Share how you're feeling"}
          </Text>
        </View>
      )}
    </ScrollView>
  );

  // ── Communities tab ────────────────────────────────────────────────────────
  const renderCommunities = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
        <Text style={{ color: C.text, fontSize: 26, fontWeight: 'bold' }}>Communities</Text>
        <Text style={{ color: C.textMuted, marginTop: 4, fontSize: 14 }}>Find your people, share your world.</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: C.border }}>
          <Search size={17} color={C.textMuted} />
          <TextInput
            placeholder="Search communities..."
            placeholderTextColor={C.textMuted}
            value={communitySearch}
            onChangeText={setCommunitySearch}
            style={{ flex: 1, marginLeft: 10, fontSize: 15, color: C.text }}
          />
        </View>
      </View>

      {/* Community cards */}
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        {filteredCommunities.map((community) => (
          <View key={community.id} style={{ backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
              {/* Emoji icon */}
              <LinearGradient
                colors={['#E63946', '#C2185B', '#7B1FA2']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 26 }}>{community.emoji}</Text>
              </LinearGradient>

              <View style={{ flex: 1 }}>
                {/* Name + lock */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <Text style={{ color: C.text, fontWeight: '700', fontSize: 16 }}>{community.name}</Text>
                  {community.isPrivate && <Lock size={13} color={C.textMuted} />}
                  {community.joined && (
                    <View style={{ backgroundColor: C.primary + '22', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: C.primary, fontSize: 10, fontWeight: '700' }}>Joined</Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }} numberOfLines={2}>
                  {community.description}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <Users size={13} color={C.textMuted} />
                  <Text style={{ color: C.textMuted, fontSize: 12 }}>{formatMembers(community.members)} members</Text>
                </View>
              </View>

              {/* Join button */}
              <TouchableOpacity
                onPress={() => handleJoinToggle(community.id)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
                  backgroundColor: community.joined ? C.cardAlt : C.primary,
                  borderWidth: community.joined ? 1 : 0,
                  borderColor: C.border,
                  alignItems: 'center', justifyContent: 'center',
                  minWidth: 70,
                }}
              >
                {community.joined ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Check size={13} color={C.textMuted} />
                    <Text style={{ color: C.textMuted, fontWeight: '600', fontSize: 12 }}>Joined</Text>
                  </View>
                ) : community.isPrivate && community.requested ? (
                  <Text style={{ color: C.textMuted, fontWeight: '600', fontSize: 12 }}>Requested</Text>
                ) : community.isPrivate ? (
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Request</Text>
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Join</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredCommunities.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
            <Text style={{ color: C.text, fontSize: 18, fontWeight: '600', marginBottom: 6 }}>No communities found</Text>
            <Text style={{ color: C.textMuted, fontSize: 14 }}>Try a different search term</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // ── Main return ────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header notificationCount={5} showNotifications={true} isLoggedIn={true} />

      {/* Tab switcher */}
      <View style={{
        flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 10,
        borderBottomWidth: 1, borderBottomColor: C.border,
        backgroundColor: C.bg,
      }}>
        {([
          { key: 'mood', label: '💭 Mood Space' },
          { key: 'communities', label: '👥 Communities' },
        ] as const).map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center',
              backgroundColor: activeTab === tab.key ? C.primary : C.card,
              borderWidth: 1, borderColor: activeTab === tab.key ? C.primary : C.border,
            }}
          >
            <Text style={{ color: activeTab === tab.key ? '#fff' : C.text, fontWeight: '700', fontSize: 13 }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      {activeTab === 'mood' ? renderMoodSpace() : renderCommunities()}

      {/* ── + FAB ── */}
      <TouchableOpacity
        onPress={() => setFabModalVisible(true)}
        style={{
          position: 'absolute', bottom: 90, right: 20,
          width: 56, height: 56, borderRadius: 28,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: '#E63946', shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={['#E63946', '#C2185B']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={26} color="#fff" strokeWidth={2.5} />
        </LinearGradient>
      </TouchableOpacity>

      {/* ── FAB choice modal ── */}
      <Modal visible={fabModalVisible} animationType="slide" transparent onRequestClose={() => setFabModalVisible(false)}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setFabModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()} style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            backgroundColor: C.card, padding: 28,
          }}>
            {/* Drag handle */}
            <View style={{ width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 22 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <Text style={{ color: C.text, fontSize: 22, fontWeight: 'bold' }}>What would you like to do?</Text>
              <TouchableOpacity onPress={() => setFabModalVisible(false)}>
                <X size={22} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 12 }}>
              {/* Explore Communities */}
              <TouchableOpacity
                onPress={() => { setFabModalVisible(false); setActiveTab('communities'); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.cardAlt, borderRadius: 18, padding: 18 }}
              >
                <LinearGradient
                  colors={['#7B1FA2', '#C2185B']}
                  style={{ width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Compass size={24} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: '700', fontSize: 16 }}>Explore Communities</Text>
                  <Text style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }}>Discover and join communities</Text>
                </View>
              </TouchableOpacity>

              {/* Add Community */}
              <TouchableOpacity
                onPress={() => { setFabModalVisible(false); setCreateModalVisible(true); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.cardAlt, borderRadius: 18, padding: 18 }}
              >
                <LinearGradient
                  colors={['#E63946', '#FF8C6B']}
                  style={{ width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={24} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: '700', fontSize: 16 }}>Add Community</Text>
                  <Text style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }}>Create a new community</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: 24 }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Create Community modal ── */}
      <Modal visible={createModalVisible} animationType="slide" transparent onRequestClose={() => setCreateModalVisible(false)}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setCreateModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()} style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            backgroundColor: C.card, padding: 28,
          }}>
            <View style={{ width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 22 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <Text style={{ color: C.text, fontSize: 22, fontWeight: 'bold' }}>Create Community</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <X size={22} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 14 }}>
              {/* Community name */}
              <View>
                <Text style={{ color: C.text, fontWeight: '600', marginBottom: 8 }}>Community Name *</Text>
                <TextInput
                  value={newCommunityName}
                  onChangeText={setNewCommunityName}
                  placeholder="e.g. Morning Runners Club"
                  placeholderTextColor={C.textMuted}
                  style={{ backgroundColor: C.cardAlt, borderRadius: 14, padding: 14, color: C.text, fontSize: 15, borderWidth: 1, borderColor: C.border }}
                />
              </View>

              {/* Description */}
              <View>
                <Text style={{ color: C.text, fontWeight: '600', marginBottom: 8 }}>Description</Text>
                <TextInput
                  value={newCommunityDesc}
                  onChangeText={setNewCommunityDesc}
                  placeholder="What's your community about?"
                  placeholderTextColor={C.textMuted}
                  multiline
                  style={{ backgroundColor: C.cardAlt, borderRadius: 14, padding: 14, color: C.text, fontSize: 15, borderWidth: 1, borderColor: C.border, minHeight: 80, textAlignVertical: 'top' }}
                />
              </View>

              {/* Private toggle */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.cardAlt, borderRadius: 14, padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Lock size={18} color={C.textMuted} />
                  <View>
                    <Text style={{ color: C.text, fontWeight: '600' }}>Private Community</Text>
                    <Text style={{ color: C.textMuted, fontSize: 12 }}>Members need approval to join</Text>
                  </View>
                </View>
                <Switch
                  value={newCommunityPrivate}
                  onValueChange={setNewCommunityPrivate}
                  trackColor={{ false: C.border, true: C.primary }}
                  thumbColor="#fff"
                />
              </View>

              {/* Create button */}
              <TouchableOpacity
                onPress={handleCreateCommunity}
                disabled={!newCommunityName.trim()}
                style={{ borderRadius: 16, overflow: 'hidden', opacity: newCommunityName.trim() ? 1 : 0.5 }}
              >
                <LinearGradient
                  colors={['#E63946', '#C2185B']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 16, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Create Community 💖</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={{ height: 20 }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Comments Modal ── */}
      <Modal
        visible={!!commentTarget}
        animationType="slide"
        transparent
        onRequestClose={() => setCommentTarget(null)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setCommentTarget(null)}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                borderTopLeftRadius: 28, borderTopRightRadius: 28,
                backgroundColor: C.card, maxHeight: '80%',
              }}
            >
              <View style={{ padding: 20, paddingBottom: 0 }}>
                <View style={{ width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 18 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text style={{ color: C.text, fontSize: 20, fontWeight: 'bold' }}>
                    Comments ({commentTarget?.reactions.comments ?? 0})
                  </Text>
                  <TouchableOpacity onPress={() => setCommentTarget(null)}>
                    <X size={22} color={C.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Comment list */}
              <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}>
                {(commentTarget?.comments ?? []).length === 0 && (
                  <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>💬</Text>
                    <Text style={{ color: C.textMuted, fontSize: 14 }}>No comments yet — be the first!</Text>
                  </View>
                )}
                {(commentTarget?.comments ?? []).map(c => (
                  <View key={c.id} style={{ backgroundColor: C.cardAlt, borderRadius: 14, padding: 14 }}>
                    <Text style={{ color: C.text, fontSize: 14, lineHeight: 20 }}>{c.text}</Text>
                    <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 6 }}>{c.time}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* New comment input */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 10,
                padding: 16, borderTopWidth: 1, borderTopColor: C.border,
              }}>
                <TextInput
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Add a supportive comment..."
                  placeholderTextColor={C.textMuted}
                  style={{
                    flex: 1, backgroundColor: C.cardAlt, borderRadius: 20,
                    paddingHorizontal: 16, paddingVertical: 10,
                    color: C.text, fontSize: 14,
                  }}
                  returnKeyType="send"
                  onSubmitEditing={handleAddComment}
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                  style={{
                    width: 42, height: 42, borderRadius: 21,
                    backgroundColor: newComment.trim() ? C.primary : C.cardAlt,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Send size={18} color={newComment.trim() ? '#fff' : C.textMuted} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}