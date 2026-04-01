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
import { Bookmark, Heart, MessageCircle } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
};

const mockMoods = [
  { id: '1', emoji: '😔', mood: 'Lonely', text: "Sometimes I feel like I'm the only one who truly understands what it's like to crave connection but fear rejection at the same time.", time: '2m ago', reactions: { relate: 42, respond: 8, save: 12 } },
  { id: '2', emoji: '💔', mood: 'Heartbroken', text: "It's been 3 months and I still check their Instagram every day. When does it stop hurting?", time: '15m ago', reactions: { relate: 156, respond: 34, save: 23 } },
  { id: '3', emoji: '🙂', mood: 'Happy', text: "Had the best first date today! We talked for 4 hours straight and didn't even notice the time passing. Feeling hopeful for the first time in months 💕", time: '1h ago', reactions: { relate: 89, respond: 21, save: 45 } },
  { id: '4', emoji: '😵', mood: 'Stressed', text: "Juggling three different conversations and I have no idea what I'm doing. Why is modern dating so complicated?", time: '2h ago', reactions: { relate: 203, respond: 67, save: 18 } },
  { id: '5', emoji: '🔥', mood: 'Adult feelings', text: "Is it just me or does anyone else get butterflies when you see that 'typing...' notification from your crush?", time: '3h ago', reactions: { relate: 312, respond: 45, save: 89 } },
  { id: '6', emoji: '😔', mood: 'Lonely', text: "Friday night and all my friends are out with their partners. Just me and Netflix again. Starting to wonder if I'll ever find my person.", time: '4h ago', reactions: { relate: 178, respond: 52, save: 34 } },
];

const moods = [
  { emoji: '😔', label: 'Lonely' },
  { emoji: '🙂', label: 'Happy' },
  { emoji: '😵', label: 'Stressed' },
  { emoji: '💔', label: 'Heartbroken' },
  { emoji: '🔥', label: 'Adult feelings' },
];

const moodBgColors: Record<string, string> = {
  Lonely: '#f3f4f6',
  Happy: '#d1fae5',
  Stressed: '#fef3c7',
  Heartbroken: '#fee2e2',
  'Adult feelings': '#fed7aa',
};

export default function ExploreScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodText, setMoodText] = useState('');
  const [feedData, setFeedData] = useState(mockMoods);

  const handleShare = () => {
    if (!selectedMood || !moodText.trim()) return;
    setFeedData([{
      id: Date.now().toString(),
      emoji: moods.find(m => m.label === selectedMood)?.emoji || '🙂',
      mood: selectedMood,
      text: moodText,
      time: 'Just now',
      reactions: { relate: 0, respond: 0, save: 0 },
    }, ...feedData]);
    setMoodText('');
    setSelectedMood(null);
  };

  const filteredFeed = selectedMood ? feedData.filter(i => i.mood === selectedMood) : feedData;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header notificationCount={5} showNotifications={true} isLoggedIn={true} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Page Title */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
          <Text style={{ color: COLORS.text, fontSize: 28, fontWeight: 'bold' }}>Mood Space</Text>
          <Text style={{ color: COLORS.textMuted, marginTop: 4, fontSize: 14 }}>
            Share your feelings anonymously. You're not alone.
          </Text>
        </View>

        {/* Mood Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 20 }}>
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.label;
            return (
              <TouchableOpacity
                key={mood.label}
                onPress={() => setSelectedMood(isSelected ? null : mood.label)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                  paddingHorizontal: 16, paddingVertical: 10,
                  borderRadius: 999,
                  backgroundColor: isSelected ? COLORS.primary : COLORS.card,
                  borderWidth: 1,
                  borderColor: isSelected ? COLORS.primary : COLORS.border,
                }}
              >
                <Text style={{ fontSize: 18 }}>{mood.emoji}</Text>
                <Text style={{ color: isSelected ? '#fff' : COLORS.text, fontWeight: '600', fontSize: 14 }}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Share Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{
            backgroundColor: COLORS.card, borderRadius: 20, padding: 18,
            borderWidth: 1, borderColor: COLORS.border,
          }}>
            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
              How are you feeling?
            </Text>
            <TextInput
              value={moodText}
              onChangeText={setMoodText}
              placeholder="Share your thoughts anonymously... (120 chars)"
              placeholderTextColor="#6b7280"
              multiline
              maxLength={120}
              style={{
                backgroundColor: '#1a1a1a', borderRadius: 12, padding: 14,
                color: COLORS.text, minHeight: 100, textAlignVertical: 'top',
                fontSize: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 14,
              }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>{moodText.length}/120</Text>
              <TouchableOpacity
                onPress={handleShare}
                disabled={!selectedMood || !moodText.trim()}
                style={{
                  paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999,
                  backgroundColor: selectedMood && moodText.trim() ? COLORS.primary : '#3f3f46',
                }}
              >
                <Text style={{
                  fontWeight: '700', fontSize: 14,
                  color: selectedMood && moodText.trim() ? '#fff' : COLORS.textMuted,
                }}>
                  Share Anonymously
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Feed Title */}
        <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
          <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: 'bold' }}>
            {selectedMood ? `${selectedMood} Moods` : 'Community Moods'}
          </Text>
        </View>

        {/* Mood Cards */}
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {filteredFeed.map((item) => (
            <View key={item.id} style={{
              backgroundColor: COLORS.card, borderRadius: 20, padding: 18,
              borderWidth: 1, borderColor: COLORS.border,
            }}>
              {/* Top Row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
                  <View style={{
                    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
                    backgroundColor: moodBgColors[item.mood] || '#f3f4f6',
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#111' }}>{item.mood}</Text>
                  </View>
                </View>
                <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>{item.time}</Text>
              </View>

              {/* Text */}
              <Text style={{ color: COLORS.text, fontSize: 14, lineHeight: 22, marginBottom: 14 }}>
                {item.text}
              </Text>

              {/* Reactions */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 20,
                paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border,
              }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Heart size={18} color={COLORS.primary} />
                  <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '600' }}>{item.reactions.relate}</Text>
                  <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>Relate</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MessageCircle size={18} color={COLORS.textMuted} />
                  <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '600' }}>{item.reactions.respond}</Text>
                  <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>Respond</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Bookmark size={18} color={COLORS.textMuted} />
                  <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '600' }}>{item.reactions.save}</Text>
                  <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Empty State */}
        {filteredFeed.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>
              {selectedMood ? moods.find(m => m.label === selectedMood)?.emoji : '💭'}
            </Text>
            <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '600', marginBottom: 8, textAlign: 'center' }}>
              No moods yet
            </Text>
            <Text style={{ color: COLORS.textMuted, textAlign: 'center', fontSize: 14 }}>
              {selectedMood ? `Be the first to share a ${selectedMood.toLowerCase()} mood` : "Share how you're feeling to start the conversation"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}