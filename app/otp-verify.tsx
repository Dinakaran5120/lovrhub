// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { ArrowLeft } from 'lucide-react-native';
// import React, { useRef, useState } from 'react';
// import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function OTPVerifyScreen() {
//   const router = useRouter();
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const inputRefs = useRef<(TextInput | null)[]>([]);

//   const handleOtpChange = (value: string, index: number) => {
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 3) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleVerify = () => {
//     // Mock verification - navigate to profile setup
//     router.push('/profile-setup');
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>
//         {/* Header */}
//         <View className="flex-row items-center mb-8">
//           <TouchableOpacity onPress={() => router.back()} className="mr-4">
//             <ArrowLeft size={24} color="#2B2B2B" />
//           </TouchableOpacity>
//           <Text className="text-2xl font-bold text-foreground">Enter Code</Text>
//         </View>

//         <Text className="text-foreground/70 mb-8">
//           We sent a 4-digit verification code to your email/phone
//         </Text>

//         {/* OTP Input */}
//         <View className="flex-row justify-between mb-8">
//           {otp.map((digit, index) => (
//             <TextInput
//               key={index}
//               ref={(ref) => (inputRefs.current[index] = ref)}
//               className="w-16 h-20 bg-card border-2 border-border rounded-2xl text-center text-3xl font-bold text-foreground"
//               value={digit}
//               onChangeText={(value) => handleOtpChange(value, index)}
//               keyboardType="number-pad"
//               maxLength={1}
//               selectTextOnFocus
//             />
//           ))}
//         </View>

//         {/* Resend */}
//         <View className="flex-row items-center justify-center mb-8">
//           <Text className="text-foreground/60">Didn't receive the code? </Text>
//           <TouchableOpacity>
//             <Text className="text-primary font-bold">Resend</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Verify Button */}
//         <TouchableOpacity onPress={handleVerify}>
//           <LinearGradient
//             colors={['#E63946', '#FF8C6B']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={{ borderRadius: 16, padding: 18 }}
//           >
//             <Text className="text-lg font-bold text-[#FFF8F5] text-center">
//               Verify & Continue
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
};

export default function OTPVerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every(d => d !== '');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 14, padding: 4 }}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: 'bold' }}>Enter Code</Text>
        </View>

        {/* Subtitle */}
        <Text style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 40, lineHeight: 21 }}>
          We sent a 4-digit verification code to your email/phone
        </Text>

        {/* OTP Inputs */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 36 }}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              style={{
                width: 72, height: 80,
                backgroundColor: COLORS.card,
                borderWidth: digit ? 2 : 1.5,
                borderColor: digit ? COLORS.primary : COLORS.border,
                borderRadius: 16,
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 'bold',
                color: COLORS.text,
              }}
            />
          ))}
        </View>

        {/* Resend */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 36 }}>
          <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>Didn't receive the code? </Text>
          <TouchableOpacity>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }}>Resend</Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={() => router.push('/profile-setup')}
          disabled={!isComplete}
          activeOpacity={0.85}
          style={{ opacity: isComplete ? 1 : 0.5 }}
        >
          <LinearGradient
            colors={['#E63946', '#FF8C6B']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>
              Verify & Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Info */}
        <View style={{
          marginTop: 24, backgroundColor: 'rgba(230,57,70,0.08)',
          borderRadius: 16, padding: 16,
          borderWidth: 1, borderColor: 'rgba(230,57,70,0.2)',
        }}>
          <Text style={{ color: COLORS.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
            🔒 Your verification code expires in 10 minutes
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}