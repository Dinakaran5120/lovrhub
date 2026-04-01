// import {
//   CameraIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CropIcon,
//   ImageIcon,
//   StyledImage,
//   StyledSafeAreaView,
//   StyledText,
//   StyledTouchableOpacity,
//   StyledView,
//   VideoIcon,
// } from '@/components/NativeWind';
// import { ThemeToggle } from '@/components/ThemeToggle';
// import { useState } from 'react';
// import { Alert, Dimensions, ScrollView, TextInput } from 'react-native';

// const { width } = Dimensions.get('window');

// type MediaType = 'image' | 'video';
// type UploadStep = 'select' | 'preview' | 'crop' | 'details' | 'final';
// type Mood = '😔 Lonely' | '🙂 Happy' | '😵 Stressed' | '💔 Heartbroken' | '🔥 Adult feelings';

// interface MediaItem {
//   uri: string;
//   type: MediaType;
// }

// export default function UploadScreen() {
//   const [step, setStep] = useState<UploadStep>('select');
//   const [media, setMedia] = useState<MediaItem[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [caption, setCaption] = useState('');
//   const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
//   const [isPublic, setIsPublic] = useState(true);

//   const moods: Mood[] = ['😔 Lonely', '🙂 Happy', '😵 Stressed', '💔 Heartbroken', '🔥 Adult feelings'];

//   // Mock images for demo
//   const mockImages = [
//     'https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60',
//     'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?w=900&auto=format&fit=crop&q=60',
//     'https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60',
//   ];

//   const handleMockUpload = (type: MediaType) => {
//     const mockMedia: MediaItem[] = mockImages.slice(0, type === 'video' ? 1 : 3).map(uri => ({
//       uri,
//       type,
//     }));
//     setMedia(mockMedia);
//     setStep('preview');
//   };

//   const handleNext = () => {
//     if (step === 'preview') setStep('crop');
//     else if (step === 'crop') setStep('details');
//     else if (step === 'details') setStep('final');
//   };

//   const handlePost = () => {
//     // Mock post action
//     Alert.alert('Success', 'Post shared! 🎉');
//     resetUpload();
//   };

//   const resetUpload = () => {
//     setStep('select');
//     setMedia([]);
//     setCurrentIndex(0);
//     setCaption('');
//     setSelectedMood(null);
//     setIsPublic(true);
//   };

//   const renderSelectMedia = () => (
//     <StyledView className="flex-1 items-center justify-center px-6 gap-6">
//       <StyledView className="items-center mb-4">
//         <StyledView className="w-24 h-24 rounded-full bg-secondary/20 items-center justify-center mb-4">
//           <CameraIcon className="text-primary" size={40} />
//         </StyledView>
//         <StyledText className="text-2xl font-bold text-foreground">Create a Post</StyledText>
//         <StyledText className="text-muted-foreground text-center mt-2">
//           Share your moments with the community
//         </StyledText>
//       </StyledView>

//       <StyledTouchableOpacity
//         onPress={() => handleMockUpload('image')}
//         className="w-full bg-primary rounded-2xl p-6 flex-row items-center justify-between active:opacity-80"
//       >
//         <StyledView className="flex-row items-center gap-4">
//           <StyledView className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
//             <ImageIcon className="text-white" size={24} />
//           </StyledView>
//           <StyledView>
//             <StyledText className="text-white font-bold text-lg">Upload Photos</StyledText>
//             <StyledText className="text-white/80 text-sm">Up to 3 images</StyledText>
//           </StyledView>
//         </StyledView>
//         <ChevronRightIcon className="text-white" size={24} />
//       </StyledTouchableOpacity>

//       <StyledTouchableOpacity
//         onPress={() => handleMockUpload('video')}
//         className="w-full bg-accent rounded-2xl p-6 flex-row items-center justify-between active:opacity-80"
//       >
//         <StyledView className="flex-row items-center gap-4">
//           <StyledView className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
//             <VideoIcon className="text-white" size={24} />
//           </StyledView>
//           <StyledView>
//             <StyledText className="text-white font-bold text-lg">Upload Video</StyledText>
//             <StyledText className="text-white/80 text-sm">Max 1 minute</StyledText>
//           </StyledView>
//         </StyledView>
//         <ChevronRightIcon className="text-white" size={24} />
//       </StyledTouchableOpacity>

//       <StyledView className="bg-card rounded-2xl p-4 mt-4">
//         <StyledText className="text-muted-foreground text-sm text-center">
//           💡 Tip: Authentic posts get more engagement!
//         </StyledText>
//       </StyledView>
//     </StyledView>
//   );

//   const renderPreview = () => (
//     <StyledView className="flex-1">
//       {/* Image Slider */}
//       <StyledView className="relative" style={{ height: width }}>
//         <StyledImage
//           source={{ uri: media[currentIndex].uri }}
//           className="w-full h-full"
//           resizeMode="cover"
//         />
        
//         {/* Navigation Arrows */}
//         {media.length > 1 && (
//           <>
//             {currentIndex > 0 && (
//               <StyledTouchableOpacity
//                 onPress={() => setCurrentIndex(currentIndex - 1)}
//                 className="absolute left-4 top-1/2 -mt-6 w-12 h-12 rounded-full bg-black/50 items-center justify-center"
//               >
//                 <ChevronLeftIcon className="text-white" size={24} />
//               </StyledTouchableOpacity>
//             )}
//             {currentIndex < media.length - 1 && (
//               <StyledTouchableOpacity
//                 onPress={() => setCurrentIndex(currentIndex + 1)}
//                 className="absolute right-4 top-1/2 -mt-6 w-12 h-12 rounded-full bg-black/50 items-center justify-center"
//               >
//                 <ChevronRightIcon className="text-white" size={24} />
//               </StyledTouchableOpacity>
//             )}
//           </>
//         )}

//         {/* Indicator Dots */}
//         {media.length > 1 && (
//           <StyledView className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
//             {media.map((_, index) => (
//               <StyledView
//                 key={index}
//                 className={`h-2 rounded-full ${
//                   index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
//                 }`}
//               />
//             ))}
//           </StyledView>
//         )}
//       </StyledView>

//       <StyledView className="p-6 gap-4">
//         <StyledText className="text-xl font-bold text-foreground">
//           {media.length} {media[0].type === 'video' ? 'Video' : 'Photo(s)'} Selected
//         </StyledText>
        
//         <StyledTouchableOpacity
//           onPress={handleNext}
//           className="bg-primary rounded-2xl py-4 items-center active:opacity-80"
//         >
//           <StyledText className="text-white font-bold text-lg">Continue to Crop</StyledText>
//         </StyledTouchableOpacity>

//         <StyledTouchableOpacity
//           onPress={resetUpload}
//           className="bg-card rounded-2xl py-4 items-center active:opacity-80"
//         >
//           <StyledText className="text-muted-foreground font-semibold">Cancel</StyledText>
//         </StyledTouchableOpacity>
//       </StyledView>
//     </StyledView>
//   );

//   const renderCrop = () => (
//     <StyledView className="flex-1">
//       {/* Crop UI Mock */}
//       <StyledView className="relative" style={{ height: width }}>
//         <StyledImage
//           source={{ uri: media[currentIndex].uri }}
//           className="w-full h-full"
//           resizeMode="cover"
//         />
        
//         {/* Crop Grid Overlay */}
//         <StyledView className="absolute inset-0 border-2 border-white">
//           <StyledView className="flex-1 flex-row">
//             <StyledView className="flex-1 border-r border-white/50" />
//             <StyledView className="flex-1 border-r border-white/50" />
//             <StyledView className="flex-1" />
//           </StyledView>
//           <StyledView className="absolute inset-0 flex-col">
//             <StyledView className="flex-1 border-b border-white/50" />
//             <StyledView className="flex-1 border-b border-white/50" />
//             <StyledView className="flex-1" />
//           </StyledView>
//         </StyledView>

//         <StyledView className="absolute top-4 left-4 bg-black/70 rounded-full px-4 py-2">
//           <StyledText className="text-white font-semibold">Pinch to zoom</StyledText>
//         </StyledView>
//       </StyledView>

//       <StyledView className="p-6 gap-4">
//         <StyledView className="flex-row items-center gap-3 mb-2">
//           <CropIcon className="text-primary" size={24} />
//           <StyledText className="text-xl font-bold text-foreground">Adjust & Crop</StyledText>
//         </StyledView>

//         <StyledView className="flex-row gap-3">
//           <StyledTouchableOpacity className="flex-1 bg-card rounded-2xl py-3 items-center active:opacity-80">
//             <StyledText className="text-foreground font-semibold">Square</StyledText>
//           </StyledTouchableOpacity>
//           <StyledTouchableOpacity className="flex-1 bg-card rounded-2xl py-3 items-center active:opacity-80">
//             <StyledText className="text-foreground font-semibold">Portrait</StyledText>
//           </StyledTouchableOpacity>
//           <StyledTouchableOpacity className="flex-1 bg-card rounded-2xl py-3 items-center active:opacity-80">
//             <StyledText className="text-foreground font-semibold">Landscape</StyledText>
//           </StyledTouchableOpacity>
//         </StyledView>

//         <StyledTouchableOpacity
//           onPress={handleNext}
//           className="bg-primary rounded-2xl py-4 items-center active:opacity-80"
//         >
//           <StyledText className="text-white font-bold text-lg">Apply & Continue</StyledText>
//         </StyledTouchableOpacity>
//       </StyledView>
//     </StyledView>
//   );

//   const renderDetails = () => (
//     <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 24 }}>
//       <StyledText className="text-2xl font-bold text-foreground">Post Details</StyledText>

//       {/* Caption */}
//       <StyledView>
//         <StyledText className="text-foreground font-semibold mb-2">Caption</StyledText>
//         <TextInput
//           value={caption}
//           onChangeText={setCaption}
//           placeholder="Share what's on your mind..."
//           placeholderTextColor="#999"
//           multiline
//           maxLength={280}
//           className="bg-card rounded-2xl p-4 text-foreground min-h-[100px]"
//           style={{ textAlignVertical: 'top' }}
//         />
//         <StyledText className="text-muted-foreground text-sm text-right mt-1">
//           {caption.length}/280
//         </StyledText>
//       </StyledView>

//       {/* Mood Selection */}
//       <StyledView>
//         <StyledText className="text-foreground font-semibold mb-3">How are you feeling?</StyledText>
//         <StyledView className="flex-row flex-wrap gap-2">
//           {moods.map((mood) => (
//             <StyledTouchableOpacity
//               key={mood}
//               onPress={() => setSelectedMood(mood)}
//               className={`rounded-full px-4 py-2 ${
//                 selectedMood === mood ? 'bg-primary' : 'bg-card'
//               }`}
//             >
//               <StyledText className={selectedMood === mood ? 'text-white font-semibold' : 'text-foreground'}>
//                 {mood}
//               </StyledText>
//             </StyledTouchableOpacity>
//           ))}
//         </StyledView>
//       </StyledView>

//       {/* Privacy Toggle */}
//       <StyledView className="bg-card rounded-2xl p-4">
//         <StyledView className="flex-row items-center justify-between mb-2">
//           <StyledText className="text-foreground font-semibold">Post Visibility</StyledText>
//           <StyledTouchableOpacity
//             onPress={() => setIsPublic(!isPublic)}
//             className={`w-14 h-8 rounded-full ${isPublic ? 'bg-primary' : 'bg-muted'}`}
//           >
//             <StyledView className={`w-6 h-6 rounded-full bg-white m-1 ${isPublic ? 'ml-auto' : ''}`} />
//           </StyledTouchableOpacity>
//         </StyledView>
//         <StyledText className="text-muted-foreground text-sm">
//           {isPublic ? '🌍 Public - Everyone can see' : '🔒 Private - Only connections'}
//         </StyledText>
//       </StyledView>

//       <StyledTouchableOpacity
//         onPress={handleNext}
//         className="bg-primary rounded-2xl py-4 items-center active:opacity-80"
//       >
//         <StyledText className="text-white font-bold text-lg">Preview Post</StyledText>
//       </StyledTouchableOpacity>
//     </ScrollView>
//   );

//   const renderFinalPreview = () => (
//     <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 24 }}>
//       <StyledText className="text-2xl font-bold text-foreground">Preview Your Post</StyledText>

//       {/* Post Preview Card */}
//       <StyledView className="bg-card rounded-2xl overflow-hidden shadow-sm">
//         {/* User Header */}
//         <StyledView className="p-4 flex-row items-center gap-3">
//           <StyledView className="w-12 h-12 rounded-full bg-primary items-center justify-center">
//             <StyledText className="text-white font-bold text-lg">You</StyledText>
//           </StyledView>
//           <StyledView className="flex-1">
//             <StyledText className="text-foreground font-bold">Your Name</StyledText>
//             <StyledText className="text-muted-foreground text-sm">Just now</StyledText>
//           </StyledView>
//           {selectedMood && (
//             <StyledView className="bg-primary/10 rounded-full px-3 py-1">
//               <StyledText className="text-primary text-sm font-semibold">{selectedMood}</StyledText>
//             </StyledView>
//           )}
//         </StyledView>

//         {/* Caption */}
//         {caption && (
//           <StyledView className="px-4 pb-3">
//             <StyledText className="text-foreground">{caption}</StyledText>
//           </StyledView>
//         )}

//         {/* Media */}
//         <StyledImage
//           source={{ uri: media[0].uri }}
//           style={{ width: '100%', height: width - 48 }}
//           resizeMode="cover"
//         />

//         {/* Interaction Buttons */}
//         <StyledView className="p-4 flex-row items-center gap-6">
//           <StyledTouchableOpacity className="flex-row items-center gap-2">
//             <StyledText className="text-2xl">❤️</StyledText>
//             <StyledText className="text-muted-foreground font-semibold">Like</StyledText>
//           </StyledTouchableOpacity>
//           <StyledTouchableOpacity className="flex-row items-center gap-2">
//             <StyledText className="text-2xl">💬</StyledText>
//             <StyledText className="text-muted-foreground font-semibold">Comment</StyledText>
//           </StyledTouchableOpacity>
//           <StyledTouchableOpacity className="flex-row items-center gap-2">
//             <StyledText className="text-2xl">✨</StyledText>
//             <StyledText className="text-muted-foreground font-semibold">Vibe</StyledText>
//           </StyledTouchableOpacity>
//         </StyledView>
//       </StyledView>

//       {/* Privacy Notice */}
//       <StyledView className="bg-secondary/10 rounded-2xl p-4">
//         <StyledText className="text-foreground font-semibold mb-1">
//           {isPublic ? '🌍 Public Post' : '🔒 Private Post'}
//         </StyledText>
//         <StyledText className="text-muted-foreground text-sm">
//           {isPublic
//             ? 'This post will be visible to everyone on LovеHub'
//             : 'This post will only be visible to your connections'}
//         </StyledText>
//       </StyledView>

//       <StyledView className="gap-3">
//         <StyledTouchableOpacity
//           onPress={handlePost}
//           className="bg-primary rounded-2xl py-4 items-center active:opacity-80"
//         >
//           <StyledText className="text-white font-bold text-lg">Share Post 🎉</StyledText>
//         </StyledTouchableOpacity>

//         <StyledTouchableOpacity
//           onPress={() => setStep('details')}
//           className="bg-card rounded-2xl py-4 items-center active:opacity-80"
//         >
//           <StyledText className="text-muted-foreground font-semibold">Edit Details</StyledText>
//         </StyledTouchableOpacity>

//         <StyledTouchableOpacity
//           onPress={resetUpload}
//           className="py-3 items-center active:opacity-80"
//         >
//           <StyledText className="text-destructive font-semibold">Cancel Post</StyledText>
//         </StyledTouchableOpacity>
//       </StyledView>
//     </ScrollView>
//   );

//   return (
//     <StyledSafeAreaView className="flex-1 bg-background">
//       {/* Header */}
//       <StyledView className="px-6 py-4 flex-row items-center justify-between border-b border-border">
//         {step !== 'select' ? (
//           <StyledTouchableOpacity
//             onPress={() => {
//               if (step === 'preview') resetUpload();
//               else if (step === 'crop') setStep('preview');
//               else if (step === 'details') setStep('crop');
//               else if (step === 'final') setStep('details');
//             }}
//             className="w-10 h-10 items-center justify-center"
//           >
//             <ChevronLeftIcon className="text-foreground" size={28} />
//           </StyledTouchableOpacity>
//         ) : (
//           <StyledView className="w-10" />
//         )}
        
//         <StyledText className="text-xl font-bold text-foreground">
//           {step === 'select' && 'Upload'}
//           {step === 'preview' && 'Preview'}
//           {step === 'crop' && 'Crop'}
//           {step === 'details' && 'Details'}
//           {step === 'final' && 'Final Preview'}
//         </StyledText>
        
//         <ThemeToggle />
//       </StyledView>

//       {/* Step Content */}
//       {step === 'select' && renderSelectMedia()}
//       {step === 'preview' && renderPreview()}
//       {step === 'crop' && renderCrop()}
//       {step === 'details' && renderDetails()}
//       {step === 'final' && renderFinalPreview()}
//     </StyledSafeAreaView>
//   );
// }

// import { ThemeToggle } from '@/components/ThemeToggle';
// import { Camera, ChevronLeft, ChevronRight, Crop, Image as ImageIcon, Video } from 'lucide-react-native';
// import { useState } from 'react';
// import { Alert, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// const { width } = Dimensions.get('window');

// const COLORS = {
//   background: '#111111',
//   card: '#1c1c1e',
//   primary: '#E63946',
//   border: '#3f3f46',
//   text: '#ffffff',
//   textMuted: '#9ca3af',
// };

// type MediaType = 'image' | 'video';
// type UploadStep = 'select' | 'preview' | 'crop' | 'details' | 'final';
// type Mood = '😔 Lonely' | '🙂 Happy' | '😵 Stressed' | '💔 Heartbroken' | '🔥 Adult feelings';
// interface MediaItem { uri: string; type: MediaType; }

// const mockImages = [
//   'https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60',
//   'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?w=900&auto=format&fit=crop&q=60',
//   'https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60',
// ];

// const moods: Mood[] = ['😔 Lonely', '🙂 Happy', '😵 Stressed', '💔 Heartbroken', '🔥 Adult feelings'];

// export default function UploadScreen() {
//   const [step, setStep] = useState<UploadStep>('select');
//   const [media, setMedia] = useState<MediaItem[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [caption, setCaption] = useState('');
//   const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
//   const [isPublic, setIsPublic] = useState(true);

//   const handleMockUpload = (type: MediaType) => {
//     setMedia(mockImages.slice(0, type === 'video' ? 1 : 3).map(uri => ({ uri, type })));
//     setStep('preview');
//   };

//   const handleNext = () => {
//     if (step === 'preview') setStep('crop');
//     else if (step === 'crop') setStep('details');
//     else if (step === 'details') setStep('final');
//   };

//   const handlePost = () => {
//     Alert.alert('Success', 'Post shared! 🎉');
//     resetUpload();
//   };

//   const resetUpload = () => {
//     setStep('select'); setMedia([]); setCurrentIndex(0);
//     setCaption(''); setSelectedMood(null); setIsPublic(true);
//   };

//   const stepTitle: Record<UploadStep, string> = {
//     select: 'Upload', preview: 'Preview', crop: 'Crop',
//     details: 'Details', final: 'Final Preview',
//   };

//   const renderSelectMedia = () => (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 }}>
//       <View style={{ alignItems: 'center', marginBottom: 8 }}>
//         <View style={{
//           width: 96, height: 96, borderRadius: 48,
//           backgroundColor: 'rgba(230,57,70,0.15)',
//           alignItems: 'center', justifyContent: 'center', marginBottom: 16,
//         }}>
//           <Camera color={COLORS.primary} size={40} />
//         </View>
//         <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>Create a Post</Text>
//         <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginTop: 6, fontSize: 14 }}>
//           Share your moments with the community
//         </Text>
//       </View>

//       {/* Upload Photos */}
//       <TouchableOpacity
//         onPress={() => handleMockUpload('image')}
//         activeOpacity={0.8}
//         style={{
//           width: '100%', backgroundColor: COLORS.primary, borderRadius: 20,
//           padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//         }}
//       >
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
//           <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
//             <ImageIcon color="white" size={24} />
//           </View>
//           <View>
//             <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Upload Photos</Text>
//             <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>Up to 3 images</Text>
//           </View>
//         </View>
//         <ChevronRight color="white" size={22} />
//       </TouchableOpacity>

//       {/* Upload Video */}
//       <TouchableOpacity
//         onPress={() => handleMockUpload('video')}
//         activeOpacity={0.8}
//         style={{
//           width: '100%', backgroundColor: '#1c1c1e', borderRadius: 20,
//           padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//           borderWidth: 1, borderColor: COLORS.border,
//         }}
//       >
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
//           <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(230,57,70,0.15)', alignItems: 'center', justifyContent: 'center' }}>
//             <Video color={COLORS.primary} size={24} />
//           </View>
//           <View>
//             <Text style={{ color: COLORS.text, fontWeight: 'bold', fontSize: 17 }}>Upload Video</Text>
//             <Text style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 2 }}>Max 1 minute</Text>
//           </View>
//         </View>
//         <ChevronRight color={COLORS.textMuted} size={22} />
//       </TouchableOpacity>

//       <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, width: '100%', borderWidth: 1, borderColor: COLORS.border }}>
//         <Text style={{ color: COLORS.textMuted, fontSize: 13, textAlign: 'center' }}>
//           💡 Tip: Authentic posts get more engagement!
//         </Text>
//       </View>
//     </View>
//   );

//   const renderPreview = () => (
//     <View style={{ flex: 1 }}>
//       <View style={{ position: 'relative', height: width }}>
//         <Image source={{ uri: media[currentIndex].uri }} style={{ width: '100%', height: width }} resizeMode="cover" />

//         {media.length > 1 && currentIndex > 0 && (
//           <TouchableOpacity
//             onPress={() => setCurrentIndex(currentIndex - 1)}
//             style={{ position: 'absolute', left: 16, top: '50%', marginTop: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
//           >
//             <ChevronLeft color="white" size={24} />
//           </TouchableOpacity>
//         )}
//         {media.length > 1 && currentIndex < media.length - 1 && (
//           <TouchableOpacity
//             onPress={() => setCurrentIndex(currentIndex + 1)}
//             style={{ position: 'absolute', right: 16, top: '50%', marginTop: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
//           >
//             <ChevronRight color="white" size={24} />
//           </TouchableOpacity>
//         )}

//         {media.length > 1 && (
//           <View style={{ position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
//             {media.map((_, i) => (
//               <View key={i} style={{ height: 8, borderRadius: 4, backgroundColor: i === currentIndex ? 'white' : 'rgba(255,255,255,0.5)', width: i === currentIndex ? 28 : 8 }} />
//             ))}
//           </View>
//         )}
//       </View>

//       <View style={{ padding: 24, gap: 12 }}>
//         <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: 'bold' }}>
//           {media.length} {media[0].type === 'video' ? 'Video' : 'Photo(s)'} Selected
//         </Text>
//         <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
//           <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Continue to Crop</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={resetUpload} activeOpacity={0.8} style={{ backgroundColor: COLORS.card, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
//           <Text style={{ color: COLORS.textMuted, fontWeight: '600', fontSize: 16 }}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderCrop = () => (
//     <View style={{ flex: 1 }}>
//       <View style={{ position: 'relative', height: width }}>
//         <Image source={{ uri: media[currentIndex].uri }} style={{ width: '100%', height: width }} resizeMode="cover" />
//         {/* Grid overlay */}
//         <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 2, borderColor: 'white' }}>
//           <View style={{ flex: 1, flexDirection: 'row' }}>
//             <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.5)' }} />
//             <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.5)' }} />
//             <View style={{ flex: 1 }} />
//           </View>
//         </View>
//         <View style={{ position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }}>
//           <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>Pinch to zoom</Text>
//         </View>
//       </View>

//       <View style={{ padding: 24, gap: 12 }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
//           <Crop color={COLORS.primary} size={22} />
//           <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: 'bold' }}>Adjust & Crop</Text>
//         </View>
//         <View style={{ flexDirection: 'row', gap: 10 }}>
//           {['Square', 'Portrait', 'Landscape'].map((label) => (
//             <TouchableOpacity key={label} activeOpacity={0.8} style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
//               <Text style={{ color: COLORS.text, fontWeight: '600' }}>{label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//         <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
//           <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Apply & Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderDetails = () => (
//     <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 20 }}>
//       <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>Post Details</Text>

//       {/* Caption */}
//       <View>
//         <Text style={{ color: COLORS.text, fontWeight: '600', marginBottom: 8 }}>Caption</Text>
//         <TextInput
//           value={caption}
//           onChangeText={setCaption}
//           placeholder="Share what's on your mind..."
//           placeholderTextColor="#6b7280"
//           multiline
//           maxLength={280}
//           style={{
//             backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
//             color: COLORS.text, minHeight: 100, textAlignVertical: 'top',
//             fontSize: 14, borderWidth: 1, borderColor: COLORS.border,
//           }}
//         />
//         <Text style={{ color: COLORS.textMuted, fontSize: 12, textAlign: 'right', marginTop: 4 }}>
//           {caption.length}/280
//         </Text>
//       </View>

//       {/* Mood */}
//       <View>
//         <Text style={{ color: COLORS.text, fontWeight: '600', marginBottom: 10 }}>How are you feeling?</Text>
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
//           {moods.map((mood) => (
//             <TouchableOpacity
//               key={mood}
//               onPress={() => setSelectedMood(mood)}
//               style={{
//                 paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
//                 backgroundColor: selectedMood === mood ? COLORS.primary : COLORS.card,
//                 borderWidth: 1, borderColor: selectedMood === mood ? COLORS.primary : COLORS.border,
//               }}
//             >
//               <Text style={{ color: selectedMood === mood ? 'white' : COLORS.text, fontWeight: '600', fontSize: 13 }}>
//                 {mood}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Visibility Toggle */}
//       <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
//           <Text style={{ color: COLORS.text, fontWeight: '600' }}>Post Visibility</Text>
//           <TouchableOpacity
//             onPress={() => setIsPublic(!isPublic)}
//             style={{
//               width: 52, height: 30, borderRadius: 15,
//               backgroundColor: isPublic ? COLORS.primary : COLORS.border,
//               justifyContent: 'center', paddingHorizontal: 3,
//             }}
//           >
//             <View style={{
//               width: 24, height: 24, borderRadius: 12, backgroundColor: 'white',
//               alignSelf: isPublic ? 'flex-end' : 'flex-start',
//             }} />
//           </TouchableOpacity>
//         </View>
//         <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
//           {isPublic ? '🌍 Public - Everyone can see' : '🔒 Private - Only connections'}
//         </Text>
//       </View>

//       <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
//         <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Preview Post</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );

//   const renderFinalPreview = () => (
//     <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 20 }}>
//       <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>Preview Your Post</Text>

//       {/* Post Card */}
//       <View style={{ backgroundColor: COLORS.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border }}>
//         {/* User Row */}
//         <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//           <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
//             <Text style={{ color: 'white', fontWeight: 'bold' }}>You</Text>
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>Your Name</Text>
//             <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>Just now</Text>
//           </View>
//           {selectedMood && (
//             <View style={{ backgroundColor: 'rgba(230,57,70,0.15)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
//               <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '600' }}>{selectedMood}</Text>
//             </View>
//           )}
//         </View>

//         {caption ? (
//           <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
//             <Text style={{ color: COLORS.text, fontSize: 14 }}>{caption}</Text>
//           </View>
//         ) : null}

//         <Image source={{ uri: media[0].uri }} style={{ width: '100%', height: width - 48 }} resizeMode="cover" />

//         <View style={{ padding: 16, flexDirection: 'row', gap: 24 }}>
//           {[['❤️', 'Like'], ['💬', 'Comment'], ['✨', 'Vibe']].map(([emoji, label]) => (
//             <TouchableOpacity key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//               <Text style={{ fontSize: 20 }}>{emoji}</Text>
//               <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>{label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Privacy Notice */}
//       <View style={{ backgroundColor: 'rgba(230,57,70,0.08)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(230,57,70,0.2)' }}>
//         <Text style={{ color: COLORS.text, fontWeight: '600', marginBottom: 4 }}>
//           {isPublic ? '🌍 Public Post' : '🔒 Private Post'}
//         </Text>
//         <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
//           {isPublic ? 'This post will be visible to everyone on LovrHub' : 'This post will only be visible to your connections'}
//         </Text>
//       </View>

//       <View style={{ gap: 10 }}>
//         <TouchableOpacity onPress={handlePost} activeOpacity={0.8} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
//           <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Share Post 🎉</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setStep('details')} activeOpacity={0.8} style={{ backgroundColor: COLORS.card, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
//           <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>Edit Details</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={resetUpload} activeOpacity={0.8} style={{ paddingVertical: 12, alignItems: 'center' }}>
//           <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Cancel Post</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: COLORS.background }}>
//       {/* Header */}
//       <View style={{
//         flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//         paddingHorizontal: 20, paddingVertical: 16,
//         borderBottomWidth: 1, borderBottomColor: COLORS.border,
//         backgroundColor: COLORS.card,
//       }}>
//         {step !== 'select' ? (
//           <TouchableOpacity
//             onPress={() => {
//               if (step === 'preview') resetUpload();
//               else if (step === 'crop') setStep('preview');
//               else if (step === 'details') setStep('crop');
//               else if (step === 'final') setStep('details');
//             }}
//             style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
//           >
//             <ChevronLeft color={COLORS.text} size={28} />
//           </TouchableOpacity>
//         ) : (
//           <View style={{ width: 40 }} />
//         )}

//         <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: 'bold' }}>
//           {stepTitle[step]}
//         </Text>

//         <ThemeToggle />
//       </View>

//       {step === 'select' && renderSelectMedia()}
//       {step === 'preview' && renderPreview()}
//       {step === 'crop' && renderCrop()}
//       {step === 'details' && renderDetails()}
//       {step === 'final' && renderFinalPreview()}
//     </View>
//   );
// }

import { ThemeToggle } from '@/components/ThemeToggle';
import { Camera, ChevronLeft, ChevronRight, Crop, Image as ImageIcon, Video } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Dimensions, Image, Platform, StatusBar as RNStatusBar, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
};

type MediaType = 'image' | 'video';
type UploadStep = 'select' | 'preview' | 'crop' | 'details' | 'final';
type Mood = '😔 Lonely' | '🙂 Happy' | '😵 Stressed' | '💔 Heartbroken' | '🔥 Adult feelings';
interface MediaItem { uri: string; type: MediaType; }

const mockImages = [
  'https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?w=900&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=900&auto=format&fit=crop&q=60',
];

const moods: Mood[] = ['😔 Lonely', '🙂 Happy', '😵 Stressed', '💔 Heartbroken', '🔥 Adult feelings'];

export default function UploadScreen() {
  const insets = useSafeAreaInsets();
  const STATUS_BAR_HEIGHT = Platform.OS === 'android'
    ? (RNStatusBar.currentHeight ?? 24)
    : 44;

  const [step, setStep] = useState<UploadStep>('select');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const handleMockUpload = (type: MediaType) => {
    setMedia(mockImages.slice(0, type === 'video' ? 1 : 3).map(uri => ({ uri, type })));
    setStep('preview');
  };

  const handleNext = () => {
    if (step === 'preview') setStep('crop');
    else if (step === 'crop') setStep('details');
    else if (step === 'details') setStep('final');
  };

  const handlePost = () => {
    Alert.alert('Success', 'Post shared! 🎉');
    resetUpload();
  };

  const resetUpload = () => {
    setStep('select'); setMedia([]); setCurrentIndex(0);
    setCaption(''); setSelectedMood(null); setIsPublic(true);
  };

  const stepTitle: Record<UploadStep, string> = {
    select: 'Upload', preview: 'Preview', crop: 'Crop',
    details: 'Details', final: 'Final Preview',
  };

  const renderSelectMedia = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 }}>
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <View style={{
          width: 96, height: 96, borderRadius: 48,
          backgroundColor: 'rgba(230,57,70,0.15)',
          alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <Camera color={COLORS.primary} size={40} />
        </View>
        <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>Create a Post</Text>
        <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginTop: 6, fontSize: 14 }}>
          Share your moments with the community
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleMockUpload('image')}
        activeOpacity={0.8}
        style={{
          width: '100%', backgroundColor: COLORS.primary, borderRadius: 20,
          padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon color="white" size={24} />
          </View>
          <View>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Upload Photos</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>Up to 3 images</Text>
          </View>
        </View>
        <ChevronRight color="white" size={22} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleMockUpload('video')}
        activeOpacity={0.8}
        style={{
          width: '100%', backgroundColor: COLORS.card, borderRadius: 20,
          padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          borderWidth: 1, borderColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(230,57,70,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Video color={COLORS.primary} size={24} />
          </View>
          <View>
            <Text style={{ color: COLORS.text, fontWeight: 'bold', fontSize: 17 }}>Upload Video</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 2 }}>Max 1 minute</Text>
          </View>
        </View>
        <ChevronRight color={COLORS.textMuted} size={22} />
      </TouchableOpacity>

      <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, width: '100%', borderWidth: 1, borderColor: COLORS.border }}>
        <Text style={{ color: COLORS.textMuted, fontSize: 13, textAlign: 'center' }}>
          💡 Tip: Authentic posts get more engagement!
        </Text>
      </View>
    </View>
  );

  const renderPreview = () => {
    // ✅ GUARD — prevents crash when media is empty
    if (!media || media.length === 0 || !media[currentIndex]) return null;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ position: 'relative', height: width }}>
          <Image
            source={{ uri: media[currentIndex].uri }}
            style={{ width: '100%', height: width }}
            resizeMode="cover"
          />

          {/* Navigation arrows using flex centering — fixes top:'50%' issue on Android */}
          {media.length > 1 && (
            <View style={{
              position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
              justifyContent: 'center', pointerEvents: 'box-none',
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, pointerEvents: 'box-none' }}>
                {currentIndex > 0 ? (
                  <TouchableOpacity
                    onPress={() => setCurrentIndex(currentIndex - 1)}
                    style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronLeft color="white" size={24} />
                  </TouchableOpacity>
                ) : <View style={{ width: 48 }} />}

                {currentIndex < media.length - 1 ? (
                  <TouchableOpacity
                    onPress={() => setCurrentIndex(currentIndex + 1)}
                    style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronRight color="white" size={24} />
                  </TouchableOpacity>
                ) : <View style={{ width: 48 }} />}
              </View>
            </View>
          )}

          {/* Dots */}
          {media.length > 1 && (
            <View style={{ position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
              {media.map((_, i) => (
                <View key={i} style={{
                  height: 8, borderRadius: 4,
                  backgroundColor: i === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  width: i === currentIndex ? 28 : 8,
                }} />
              ))}
            </View>
          )}
        </View>

        <View style={{ padding: 24, gap: 12 }}>
          <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: 'bold' }}>
            {media.length} {media[0].type === 'video' ? 'Video' : 'Photo(s)'} Selected
          </Text>
          <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Continue to Crop</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetUpload} activeOpacity={0.8} style={{ backgroundColor: COLORS.card, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.textMuted, fontWeight: '600', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCrop = () => {
    // ✅ GUARD
    if (!media || media.length === 0 || !media[currentIndex]) return null;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ position: 'relative', height: width }}>
          <Image
            source={{ uri: media[currentIndex].uri }}
            style={{ width: '100%', height: width }}
            resizeMode="cover"
          />
          {/* Grid overlay */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 2, borderColor: 'white' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.5)' }} />
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.5)' }} />
              <View style={{ flex: 1 }} />
            </View>
          </View>
          <View style={{ position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>Pinch to zoom</Text>
          </View>
        </View>

        <View style={{ padding: 24, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Crop color={COLORS.primary} size={22} />
            <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: 'bold' }}>Adjust & Crop</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {['Square', 'Portrait', 'Landscape'].map((label) => (
              <TouchableOpacity key={label} activeOpacity={0.8} style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                <Text style={{ color: COLORS.text, fontWeight: '600' }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Apply & Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDetails = () => (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 20 }}>
      <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>Post Details</Text>

      <View>
        <Text style={{ color: COLORS.text, fontWeight: '600', marginBottom: 8 }}>Caption</Text>
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Share what's on your mind..."
          placeholderTextColor="#6b7280"
          multiline
          maxLength={280}
          style={{
            backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
            color: COLORS.text, minHeight: 100, textAlignVertical: 'top',
            fontSize: 14, borderWidth: 1, borderColor: COLORS.border,
          }}
        />
        <Text style={{ color: COLORS.textMuted, fontSize: 12, textAlign: 'right', marginTop: 4 }}>
          {caption.length}/280
        </Text>
      </View>

      <View>
        <Text style={{ color: COLORS.text, fontWeight: '600', marginBottom: 10 }}>How are you feeling?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              onPress={() => setSelectedMood(mood)}
              style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
                backgroundColor: selectedMood === mood ? COLORS.primary : COLORS.card,
                borderWidth: 1, borderColor: selectedMood === mood ? COLORS.primary : COLORS.border,
              }}
            >
              <Text style={{ color: selectedMood === mood ? 'white' : COLORS.text, fontWeight: '600', fontSize: 13 }}>
                {mood}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: COLORS.text, fontWeight: '600' }}>Post Visibility</Text>
          <TouchableOpacity
            onPress={() => setIsPublic(!isPublic)}
            style={{
              width: 52, height: 30, borderRadius: 15,
              backgroundColor: isPublic ? COLORS.primary : COLORS.border,
              justifyContent: 'center', paddingHorizontal: 3,
            }}
          >
            <View style={{
              width: 24, height: 24, borderRadius: 12, backgroundColor: 'white',
              alignSelf: isPublic ? 'flex-end' : 'flex-start',
            }} />
          </TouchableOpacity>
        </View>
        <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
          {isPublic ? '🌍 Public - Everyone can see' : '🔒 Private - Only connections'}
        </Text>
      </View>

      <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Preview Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderFinalPreview = () => {
    // ✅ GUARD
    if (!media || media.length === 0 || !media[0]) return null;

    return (
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 20 }}>
        <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>Preview Your Post</Text>

        <View style={{ backgroundColor: COLORS.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border }}>
          <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>You</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>Your Name</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>Just now</Text>
            </View>
            {selectedMood && (
              <View style={{ backgroundColor: 'rgba(230,57,70,0.15)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '600' }}>{selectedMood}</Text>
              </View>
            )}
          </View>

          {caption ? (
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Text style={{ color: COLORS.text, fontSize: 14 }}>{caption}</Text>
            </View>
          ) : null}

          <Image
            source={{ uri: media[0].uri }}
            style={{ width: '100%', height: width - 48 }}
            resizeMode="cover"
          />

          <View style={{ padding: 16, flexDirection: 'row', gap: 24 }}>
            {[['❤️', 'Like'], ['💬', 'Comment'], ['✨', 'Vibe']].map(([emoji, label]) => (
              <TouchableOpacity key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 20 }}>{emoji}</Text>
                <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: 'rgba(230,57,70,0.08)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(230,57,70,0.2)' }}>
          <Text style={{ color: COLORS.text, fontWeight: '600', marginBottom: 4 }}>
            {isPublic ? '🌍 Public Post' : '🔒 Private Post'}
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
            {isPublic ? 'This post will be visible to everyone on LovrHub' : 'This post will only be visible to your connections'}
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          <TouchableOpacity onPress={handlePost} activeOpacity={0.8} style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Share Post 🎉</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('details')} activeOpacity={0.8} style={{ backgroundColor: COLORS.card, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>Edit Details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetUpload} activeOpacity={0.8} style={{ paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Cancel Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header — now with proper status bar padding */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: STATUS_BAR_HEIGHT + 12,
        paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
        backgroundColor: COLORS.card,
      }}>
        {step !== 'select' ? (
          <TouchableOpacity
            onPress={() => {
              if (step === 'preview') resetUpload();
              else if (step === 'crop') setStep('preview');
              else if (step === 'details') setStep('crop');
              else if (step === 'final') setStep('details');
            }}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft color={COLORS.text} size={28} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}

        <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: 'bold' }}>
          {stepTitle[step]}
        </Text>

        <ThemeToggle />
      </View>

      {/* ✅ Guards on all media-dependent steps */}
      {step === 'select' && renderSelectMedia()}
      {step === 'preview' && media.length > 0 && renderPreview()}
      {step === 'crop' && media.length > 0 && renderCrop()}
      {step === 'details' && renderDetails()}
      {step === 'final' && media.length > 0 && renderFinalPreview()}
    </View>
  );
}