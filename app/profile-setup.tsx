// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, Camera, Globe, Heart, MessageCircle, User } from 'lucide-react-native';
// import React, { useState } from 'react';
// import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// type ProfileStep = 'basic' | 'gender' | 'orientation' | 'interested' | 'relationship' | 'languages' | 'interests' | 'photo';

// export default function ProfileSetupScreen() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState<ProfileStep>('basic');
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [selectedGender, setSelectedGender] = useState('');
//   const [selectedOrientation, setSelectedOrientation] = useState('');
//   const [interestedIn, setInterestedIn] = useState<string[]>([]);
//   const [relationshipType, setRelationshipType] = useState('');
//   const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
//   const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
//   const [photoPreview, setPhotoPreview] = useState('');

//   const genders = ['Man', 'Woman', 'Non-binary', 'Prefer not to say', 'Other'];
//   const orientations = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Queer'];
//   const interestedOptions = ['Men', 'Women', 'Non-binary', 'Everyone'];
//   const relationships = ['Serious relationship', 'Casual dating', 'Friendship', 'Not sure yet'];
//   const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'];
//   const interests = ['Travel', 'Fitness', 'Music', 'Movies', 'Art', 'Food', 'Gaming', 'Reading', 'Sports', 'Photography', 'Dance', 'Yoga'];

//   const steps: ProfileStep[] = ['basic', 'gender', 'orientation', 'interested', 'relationship', 'languages', 'interests', 'photo'];
//   const currentStepIndex = steps.indexOf(currentStep);
//   const progress = ((currentStepIndex + 1) / steps.length) * 100;

//   const handleNext = () => {
//     const nextIndex = currentStepIndex + 1;
//     if (nextIndex < steps.length) {
//       setCurrentStep(steps[nextIndex]);
//     } else {
//       // Complete setup
//       router.replace('/(tabs)');
//     }
//   };

//   const handleBack = () => {
//     const prevIndex = currentStepIndex - 1;
//     if (prevIndex >= 0) {
//       setCurrentStep(steps[prevIndex]);
//     } else {
//       router.back();
//     }
//   };

//   const toggleSelection = (item: string, list: string[], setter: (val: string[]) => void) => {
//     if (list.includes(item)) {
//       setter(list.filter(i => i !== item));
//     } else {
//       setter([...list, item]);
//     }
//   };

//   const mockUploadPhoto = () => {
//     setPhotoPreview('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400');
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       <View className="flex-1">
//         {/* Header */}
//         <View className="px-6 py-4">
//           <View className="flex-row items-center justify-between mb-4">
//             <TouchableOpacity onPress={handleBack}>
//               <ArrowLeft size={24} color="#2B2B2B" />
//             </TouchableOpacity>
//             <Text className="text-sm text-foreground/60">
//               Step {currentStepIndex + 1} of {steps.length}
//             </Text>
//           </View>

//           {/* Progress Bar */}
//           <View className="h-2 bg-border rounded-full overflow-hidden">
//             <View 
//               className="h-full bg-primary rounded-full"
//               style={{ width: `${progress}%` }}
//             />
//           </View>
//         </View>

//         <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>
//           {/* Step 1: Basic Info */}
//           {currentStep === 'basic' && (
//             <View>
//               <User size={48} color="#E63946" style={{ marginBottom: 16 }} />
//               <Text className="text-3xl font-bold text-foreground mb-3">What's your name?</Text>
//               <Text className="text-foreground/70 mb-8">This is how you'll appear to others</Text>

//               <View className="mb-5">
//                 <Text className="text-sm font-semibold text-foreground mb-2">Name</Text>
//                 <TextInput
//                   className="bg-card rounded-2xl border-2 border-border p-4 text-foreground text-base"
//                   placeholder="Enter your name"
//                   placeholderTextColor="#2B2B2B80"
//                   value={name}
//                   onChangeText={setName}
//                 />
//               </View>

//               <View className="mb-8">
//                 <Text className="text-sm font-semibold text-foreground mb-2">Age</Text>
//                 <TextInput
//                   className="bg-card rounded-2xl border-2 border-border p-4 text-foreground text-base"
//                   placeholder="18"
//                   placeholderTextColor="#2B2B2B80"
//                   value={age}
//                   onChangeText={setAge}
//                   keyboardType="number-pad"
//                   maxLength={2}
//                 />
//               </View>
//             </View>
//           )}

//           {/* Step 2: Gender */}
//           {currentStep === 'gender' && (
//             <View>
//               <Heart size={48} color="#E63946" style={{ marginBottom: 16 }} />
//               <Text className="text-3xl font-bold text-foreground mb-3">I am a...</Text>
//               <Text className="text-foreground/70 mb-8">Select your gender identity</Text>

//               <View className="gap-3">
//                 {genders.map((gender) => (
//                   <TouchableOpacity
//                     key={gender}
//                     onPress={() => setSelectedGender(gender)}
//                     className={`rounded-2xl p-5 border-2 ${
//                       selectedGender === gender
//                         ? 'bg-primary/10 border-primary'
//                         : 'bg-card border-border'
//                     }`}
//                   >
//                     <Text className={`text-base font-semibold ${
//                       selectedGender === gender ? 'text-primary' : 'text-foreground'
//                     }`}>
//                       {gender}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Step 3: Sexual Orientation */}
//           {currentStep === 'orientation' && (
//             <View>
//               <Heart size={48} color="#E63946" style={{ marginBottom: 16 }} />
//               <Text className="text-3xl font-bold text-foreground mb-3">My orientation</Text>
//               <Text className="text-foreground/70 mb-8">How do you identify?</Text>

//               <View className="gap-3">
//                 {orientations.map((orientation) => (
//                   <TouchableOpacity
//                     key={orientation}
//                     onPress={() => setSelectedOrientation(orientation)}
//                     className={`rounded-2xl p-5 border-2 ${
//                       selectedOrientation === orientation
//                         ? 'bg-primary/10 border-primary'
//                         : 'bg-card border-border'
//                     }`}
//                   >
//                     <Text className={`text-base font-semibold ${
//                       selectedOrientation === orientation ? 'text-primary' : 'text-foreground'
//                     }`}>
//                       {orientation}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Step 4: Interested In */}
//           {currentStep === 'interested' && (
//             <View>
//               <Heart size={48} color="#E63946" style={{ marginBottom: 16 }} />
//               <Text className="text-3xl font-bold text-foreground mb-3">Interested in</Text>
//               <Text className="text-foreground/70 mb-8">Select all that apply</Text>

//               <View className="gap-3">
//                 {interestedOptions.map((option) => (
//                   <TouchableOpacity
//                     key={option}
//                     onPress={() => toggleSelection(option, interestedIn, setInterestedIn)}
//                     className={`rounded-2xl p-5 border-2 ${
//                       interestedIn.includes(option)
//                         ? 'bg-primary/10 border-primary'
//                         : 'bg-card border-border'
//                     }`}
//                   >
//                     <Text className={`text-base font-semibold ${
//                       interestedIn.includes(option) ? 'text-primary' : 'text-foreground'
//                     }`}>
//                       {option}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Step 5: Relationship Type */}
//           {currentStep === 'relationship' && (
//             <View>
//               <Heart size={48} color="#E63946" style={{ marginBottom: 16 }} />
//               <Text className="text-3xl font-bold text-foreground mb-3">Looking for</Text>
//               <Text className="text-foreground/70 mb-8">What kind of connection?</Text>

//               <View className="gap-3">
//                 {relationships.map((type) => (
//                   <TouchableOpacity
//                     key={type}
//                     onPress={() => setRelationshipType(type)}
//                     className={`rounded-2xl p-5 border-2 ${
//                       relationshipType === type
//                         ? 'bg-primary/10 border-primary'
//                         : 'bg-card border-border'
//                     }`}
//                   >
//                     <Text className={`text-base font-semibold ${
//                       relationshipType === type ? 'text-primary' : 'text-foreground'
//                     }`}>
//                       {type}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Step 6: Languages */}
//           {currentStep === 'languages' && (
//             <View>
//               <Globe size={48} color="#E63946" style={{ marginBottom: 16 }} />
//               <Text className="text-3xl font-bold text-foreground mb-3">Languages I speak</Text>
//               <Text className="text-foreground/70 mb-8">Select all languages you're comfortable with</Text>

//               <View className="flex-row flex-wrap gap-3">
//                 {languages.map((lang) => (
//                   <TouchableOpacity
//                     key={lang}
//                     onPress={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
//                     className={`rounded-full px-6 py-3 border-2 ${
//                       selectedLanguages.includes(lang)
//                         ? 'bg-primary/10 border-primary'
//                         : 'bg-card border-border'
//                     }`}
//                   >
//                     <Text className={`text-sm font-semibold ${
//                       selectedLanguages.includes(lang) ? 'text-primary' : 'text-foreground'
//                     }`}>
//                       {lang}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Step 7: Interests */}
//           {currentStep === 'interests' && (
//             <View>
//               <MessageCircle size={48} color="#E63946" style={{ marginBottom: 16 }} />
//               <Text className="text-3xl font-bold text-foreground mb-3">My interests</Text>
//               <Text className="text-foreground/70 mb-8">Choose at least 3 to help us find your match</Text>

//               <View className="flex-row flex-wrap gap-3">
//                 {interests.map((interest) => (
//                   <TouchableOpacity
//                     key={interest}
//                     onPress={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
//                     className={`rounded-full px-6 py-3 border-2 ${
//                       selectedInterests.includes(interest)
//                         ? 'bg-primary/10 border-primary'
//                         : 'bg-card border-border'
//                     }`}
//                   >
//                     <Text className={`text-sm font-semibold ${
//                       selectedInterests.includes(interest) ? 'text-primary' : 'text-foreground'
//                     }`}>
//                       {interest}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Step 8: Profile Photo */}
//           {currentStep === 'photo' && (
//             <View>
//               <Camera size={48} color="#E63946" style={{ marginBottom: 16 }} />
//               <Text className="text-3xl font-bold text-foreground mb-3">Add your photo</Text>
//               <Text className="text-foreground/70 mb-8">Show your best self!</Text>

//               <TouchableOpacity 
//                 onPress={mockUploadPhoto}
//                 className="bg-card rounded-2xl border-2 border-dashed border-primary/50 p-8 items-center mb-6"
//               >
//                 {photoPreview ? (
//                   <Image 
//                     source={{ uri: photoPreview }}
//                     className="w-48 h-48 rounded-2xl mb-4"
//                   />
//                 ) : (
//                   <View className="items-center">
//                     <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
//                       <Camera size={40} color="#E63946" />
//                     </View>
//                     <Text className="text-primary font-bold text-lg">Upload Photo</Text>
//                     <Text className="text-foreground/60 text-sm mt-2">Tap to select from gallery</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>

//               <View className="bg-accent/10 rounded-2xl p-4">
//                 <Text className="text-sm text-foreground/70">
//                   💡 Profiles with photos get 10x more matches!
//                 </Text>
//               </View>
//             </View>
//           )}
//         </ScrollView>

//         {/* Bottom Button */}
//         <View className="p-6 bg-background border-t border-border">
//           <TouchableOpacity onPress={handleNext}>
//             <LinearGradient
//               colors={['#E63946', '#FF8C6B']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={{ borderRadius: 16, padding: 18 }}
//             >
//               <Text className="text-lg font-bold text-[#FFF8F5] text-center">
//                 {currentStep === 'photo' ? 'Complete Setup' : 'Continue'}
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Globe, Heart, MessageCircle, User } from 'lucide-react-native';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
  primaryBg: 'rgba(230,57,70,0.12)',
  primaryBorder: 'rgba(230,57,70,0.6)',
};

type ProfileStep = 'basic' | 'gender' | 'orientation' | 'interested' | 'relationship' | 'languages' | 'interests' | 'photo';

const steps: ProfileStep[] = ['basic', 'gender', 'orientation', 'interested', 'relationship', 'languages', 'interests', 'photo'];

const genders = ['Man', 'Woman', 'Non-binary', 'Prefer not to say', 'Other'];
const orientations = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Queer'];
const interestedOptions = ['Men', 'Women', 'Non-binary', 'Everyone'];
const relationships = ['Serious relationship', 'Casual dating', 'Friendship', 'Not sure yet'];
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'];
const interests = ['Travel', 'Fitness', 'Music', 'Movies', 'Art', 'Food', 'Gaming', 'Reading', 'Sports', 'Photography', 'Dance', 'Yoga'];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<ProfileStep>('basic');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedOrientation, setSelectedOrientation] = useState('');
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [relationshipType, setRelationshipType] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState('');

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) setCurrentStep(steps[nextIndex]);
    else router.replace('/(tabs)');
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) setCurrentStep(steps[prevIndex]);
    else router.back();
  };

  const toggleSelection = (item: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  // Reusable single-select list item
  const SelectItem = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        borderRadius: 16, padding: 18, marginBottom: 10,
        backgroundColor: selected ? COLORS.primaryBg : COLORS.card,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? COLORS.primary : COLORS.border,
      }}
    >
      <Text style={{ color: selected ? COLORS.primary : COLORS.text, fontWeight: '600', fontSize: 15 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Reusable chip/pill item
  const ChipItem = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, marginBottom: 8,
        backgroundColor: selected ? COLORS.primaryBg : COLORS.card,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? COLORS.primary : COLORS.border,
      }}
    >
      <Text style={{ color: selected ? COLORS.primary : COLORS.text, fontWeight: '600', fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderStep = () => {
    switch (currentStep) {

      case 'basic':
        return (
          <View>
            <User size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>
              What's your name?
            </Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32 }}>
              This is how you'll appear to others
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>Name</Text>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
                style={{
                  backgroundColor: COLORS.card, borderRadius: 16,
                  borderWidth: 1.5, borderColor: COLORS.border,
                  padding: 16, color: COLORS.text, fontSize: 15,
                }}
              />
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>Age</Text>
              <TextInput
                placeholder="18"
                placeholderTextColor={COLORS.textMuted}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={2}
                style={{
                  backgroundColor: COLORS.card, borderRadius: 16,
                  borderWidth: 1.5, borderColor: COLORS.border,
                  padding: 16, color: COLORS.text, fontSize: 15,
                }}
              />
            </View>
          </View>
        );

      case 'gender':
        return (
          <View>
            <Heart size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>I am a...</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32 }}>Select your gender identity</Text>
            {genders.map(g => (
              <SelectItem key={g} label={g} selected={selectedGender === g} onPress={() => setSelectedGender(g)} />
            ))}
          </View>
        );

      case 'orientation':
        return (
          <View>
            <Heart size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>My orientation</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32 }}>How do you identify?</Text>
            {orientations.map(o => (
              <SelectItem key={o} label={o} selected={selectedOrientation === o} onPress={() => setSelectedOrientation(o)} />
            ))}
          </View>
        );

      case 'interested':
        return (
          <View>
            <Heart size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>Interested in</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32 }}>Select all that apply</Text>
            {interestedOptions.map(o => (
              <SelectItem key={o} label={o} selected={interestedIn.includes(o)} onPress={() => toggleSelection(o, interestedIn, setInterestedIn)} />
            ))}
          </View>
        );

      case 'relationship':
        return (
          <View>
            <Heart size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>Looking for</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32 }}>What kind of connection?</Text>
            {relationships.map(r => (
              <SelectItem key={r} label={r} selected={relationshipType === r} onPress={() => setRelationshipType(r)} />
            ))}
          </View>
        );

      case 'languages':
        return (
          <View>
            <Globe size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>
              Languages I speak
            </Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32 }}>
              Select all languages you're comfortable with
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {languages.map(l => (
                <ChipItem key={l} label={l} selected={selectedLanguages.includes(l)} onPress={() => toggleSelection(l, selectedLanguages, setSelectedLanguages)} />
              ))}
            </View>
          </View>
        );

      case 'interests':
        return (
          <View>
            <MessageCircle size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>My interests</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32 }}>
              Choose at least 3 to help us find your match
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {interests.map(i => (
                <ChipItem key={i} label={i} selected={selectedInterests.includes(i)} onPress={() => toggleSelection(i, selectedInterests, setSelectedInterests)} />
              ))}
            </View>
          </View>
        );

      case 'photo':
        return (
          <View>
            <Camera size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>Add your photo</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32 }}>Show your best self!</Text>

            <TouchableOpacity
              onPress={() => setPhotoPreview('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400')}
              activeOpacity={0.8}
              style={{
                backgroundColor: COLORS.card, borderRadius: 20,
                borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.primary,
                padding: 32, alignItems: 'center', marginBottom: 20,
              }}
            >
              {photoPreview ? (
                <Image
                  source={{ uri: photoPreview }}
                  style={{ width: 180, height: 180, borderRadius: 16, marginBottom: 12 }}
                />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <View style={{
                    width: 88, height: 88, borderRadius: 44,
                    backgroundColor: COLORS.primaryBg,
                    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                  }}>
                    <Camera size={40} color={COLORS.primary} />
                  </View>
                  <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 17 }}>Upload Photo</Text>
                  <Text style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 6 }}>Tap to select from gallery</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={{
              backgroundColor: COLORS.primaryBg, borderRadius: 16, padding: 16,
              borderWidth: 1, borderColor: 'rgba(230,57,70,0.2)',
            }}>
              <Text style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 20 }}>
                💡 Profiles with photos get 10x more matches!
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>

      {/* Header with progress */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <TouchableOpacity onPress={handleBack} style={{ padding: 4 }}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
            Step {currentStepIndex + 1} of {steps.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={{ height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
          <View style={{
            height: '100%', borderRadius: 3,
            backgroundColor: COLORS.primary,
            width: `${progress}%`,
          }} />
        </View>
      </View>

      {/* Step Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Bottom Button */}
      <View style={{
        padding: 24, paddingBottom: insets.bottom > 0 ? insets.bottom : 24,
        borderTopWidth: 1, borderTopColor: COLORS.border,
        backgroundColor: COLORS.background,
      }}>
        <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient
            colors={['#E63946', '#FF8C6B']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>
              {currentStep === 'photo' ? 'Complete Setup 🎉' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}