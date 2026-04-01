// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, Smartphone } from 'lucide-react-native';
// import React, { useState } from 'react';
// import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function SignupPhoneScreen() {
//   const router = useRouter();
//   const [phone, setPhone] = useState('');
//   const [countryCode, setCountryCode] = useState('+1');

//   const handleSendOTP = () => {
//     // Mock OTP send - navigate to verification
//     router.push('/otp-verify');
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         className="flex-1"
//       >
//         <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>
//           {/* Header */}
//           <View className="flex-row items-center mb-8">
//             <TouchableOpacity onPress={() => router.back()} className="mr-4">
//               <ArrowLeft size={24} color="#2B2B2B" />
//             </TouchableOpacity>
//             <Text className="text-2xl font-bold text-foreground">Phone Verification</Text>
//           </View>

//           <Text className="text-foreground/70 mb-8">
//             We'll send you a verification code to confirm your number
//           </Text>

//           {/* Phone Input */}
//           <View className="mb-8">
//             <Text className="text-sm font-semibold text-foreground mb-2">Phone Number</Text>
//             <View className="flex-row gap-3">
//               <View className="bg-card rounded-2xl border-2 border-border px-4 py-4 w-24">
//                 <TextInput
//                   className="text-foreground text-base text-center font-semibold"
//                   value={countryCode}
//                   onChangeText={setCountryCode}
//                   keyboardType="phone-pad"
//                 />
//               </View>
//               <View className="flex-1 bg-card rounded-2xl border-2 border-border flex-row items-center px-4">
//                 <Smartphone size={20} color="#E63946" />
//                 <TextInput
//                   className="flex-1 p-4 text-foreground text-base"
//                   placeholder="(555) 123-4567"
//                   placeholderTextColor="#2B2B2B80"
//                   value={phone}
//                   onChangeText={setPhone}
//                   keyboardType="phone-pad"
//                 />
//               </View>
//             </View>
//           </View>

//           {/* Info Card */}
//           <View className="bg-accent/10 rounded-2xl p-4 mb-8">
//             <Text className="text-sm text-foreground/70">
//               💡 Your phone number will be kept private and used only for account security
//             </Text>
//           </View>

//           {/* Send OTP Button */}
//           <TouchableOpacity onPress={handleSendOTP}>
//             <LinearGradient
//               colors={['#E63946', '#FF8C6B']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={{ borderRadius: 16, padding: 18 }}
//             >
//               <Text className="text-lg font-bold text-[#FFF8F5] text-center">
//                 Send Verification Code
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Smartphone } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
};

export default function SignupPhoneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 14, padding: 4 }}>
              <ArrowLeft size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: 'bold' }}>Phone Verification</Text>
          </View>

          <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32, lineHeight: 21 }}>
            We'll send you a verification code to confirm your number
          </Text>

          {/* Phone Input */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 10 }}>
              Phone Number
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Country Code */}
              <View style={{
                backgroundColor: COLORS.card, borderRadius: 16,
                borderWidth: 1.5, borderColor: COLORS.border,
                paddingHorizontal: 14, justifyContent: 'center', width: 80,
              }}>
                <TextInput
                  value={countryCode}
                  onChangeText={setCountryCode}
                  keyboardType="phone-pad"
                  style={{ color: COLORS.text, fontSize: 16, fontWeight: '600', textAlign: 'center', paddingVertical: 14 }}
                />
              </View>
              {/* Phone Number */}
              <View style={{
                flex: 1, flexDirection: 'row', alignItems: 'center',
                backgroundColor: COLORS.card, borderRadius: 16,
                borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 14,
              }}>
                <Smartphone size={20} color={COLORS.primary} />
                <TextInput
                  placeholder="(555) 123-4567"
                  placeholderTextColor={COLORS.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, color: COLORS.text, fontSize: 15 }}
                />
              </View>
            </View>
          </View>

          {/* Info Card */}
          <View style={{
            backgroundColor: 'rgba(230,57,70,0.08)', borderRadius: 16,
            padding: 16, marginBottom: 32,
            borderWidth: 1, borderColor: 'rgba(230,57,70,0.2)',
          }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 20 }}>
              💡 Your phone number will be kept private and used only for account security
            </Text>
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity onPress={() => router.push('/otp-verify')} activeOpacity={0.85}>
            <LinearGradient
              colors={['#E63946', '#FF8C6B']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>
                Send Verification Code
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to email */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>Prefer email instead?</Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }}>Sign up with Email</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}