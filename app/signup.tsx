// import { LovrHubLogo } from "@/components/LovrHubLogo";
// import {
//   ArrowLeftIcon,
//   EyeIcon,
//   EyeOffIcon,
//   LockIcon,
//   MailIcon,
//   StyledSafeAreaView,
//   StyledText,
//   StyledTouchableOpacity,
//   StyledView,
// } from "@/components/NativeWind";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TextInput,
// } from "react-native";

// export default function SignupScreen() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSignup = () => {
//     // Mock signup - navigate to OTP
//     router.push("/otp-verify");
//   };

//   return (
//     <StyledSafeAreaView className="flex-1 bg-background">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>
//           {/* Back Button */}
//           <StyledTouchableOpacity onPress={() => router.back()} className="mb-6">
//             <ArrowLeftIcon size={24} color="#2B2B2B" />
//           </StyledTouchableOpacity>

//           {/* Logo */}
//           <StyledView className="items-center mb-6">
//             <LovrHubLogo size={80} useGradient={true} />
//           </StyledView>

//           {/* Header */}
//           <StyledText className="text-2xl font-bold text-foreground text-center mb-2">
//             Create Account
//           </StyledText>
//           <StyledText className="text-foreground/70 mb-8 text-center">
//             Join LovrHub and start your journey to meaningful connections
//           </StyledText>

//           {/* Email Input */}
//           <StyledView className="mb-5">
//             <StyledText className="text-sm font-semibold text-foreground mb-2">
//               Email Address
//             </StyledText>
//             <StyledView className="bg-card rounded-2xl border-2 border-border flex-row items-center px-4">
//               <MailIcon size={20} color="#E63946" />
//               <TextInput
//                 className="flex-1 p-4 text-foreground text-base"
//                 placeholder="your@email.com"
//                 placeholderTextColor="#2B2B2B80"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             </StyledView>
//           </StyledView>

//           {/* Password Input */}
//           <StyledView className="mb-5">
//             <StyledText className="text-sm font-semibold text-foreground mb-2">
//               Password
//             </StyledText>
//             <StyledView className="bg-card rounded-2xl border-2 border-border flex-row items-center px-4">
//               <LockIcon size={20} color="#E63946" />
//               <TextInput
//                 className="flex-1 p-4 text-foreground text-base"
//                 placeholder="Create a strong password"
//                 placeholderTextColor="#2B2B2B80"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//               />
//               <StyledTouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                 {showPassword ? (
//                   <EyeOffIcon size={20} color="#2B2B2B80" />
//                 ) : (
//                   <EyeIcon size={20} color="#2B2B2B80" />
//                 )}
//               </StyledTouchableOpacity>
//             </StyledView>
//           </StyledView>

//           {/* Confirm Password Input */}
//           <StyledView className="mb-8">
//             <StyledText className="text-sm font-semibold text-foreground mb-2">
//               Confirm Password
//             </StyledText>
//             <StyledView className="bg-card rounded-2xl border-2 border-border flex-row items-center px-4">
//               <LockIcon size={20} color="#E63946" />
//               <TextInput
//                 className="flex-1 p-4 text-foreground text-base"
//                 placeholder="Re-enter your password"
//                 placeholderTextColor="#2B2B2B80"
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 secureTextEntry={!showConfirmPassword}
//               />
//               <StyledTouchableOpacity
//                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? (
//                   <EyeOffIcon size={20} color="#2B2B2B80" />
//                 ) : (
//                   <EyeIcon size={20} color="#2B2B2B80" />
//                 )}
//               </StyledTouchableOpacity>
//             </StyledView>
//           </StyledView>

//           {/* Password Requirements */}
//           <StyledView className="bg-secondary/10 rounded-2xl p-4 mb-8">
//             <StyledText className="text-xs text-foreground/70 mb-2">
//               Password must contain:
//             </StyledText>
//             <StyledText className="text-xs text-foreground/70">
//               • At least 8 characters
//             </StyledText>
//             <StyledText className="text-xs text-foreground/70">
//               • One uppercase letter
//             </StyledText>
//             <StyledText className="text-xs text-foreground/70">• One number</StyledText>
//           </StyledView>

//           {/* Signup Button */}
//           <StyledTouchableOpacity onPress={handleSignup}>
//             <LinearGradient
//               colors={["#E63946", "#FF8C6B"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={{ borderRadius: 16, padding: 18 }}
//             >
//               <StyledText className="text-lg font-bold text-[#FFF8F5] text-center">
//                 Continue
//               </StyledText>
//             </LinearGradient>
//           </StyledTouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </StyledSafeAreaView>
//   );
// }


import { LovrHubLogo } from "@/components/LovrHubLogo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
};

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>

          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <LovrHubLogo size={80} useGradient={true} />
          </View>

          {/* Title */}
          <Text style={{ color: COLORS.text, fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
            Create Account
          </Text>
          <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginBottom: 32, fontSize: 14 }}>
            Join LovrHub and start your journey to meaningful connections
          </Text>

          {/* Email */}
          <View style={{ marginBottom: 18 }}>
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>
              Email Address
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: COLORS.card, borderRadius: 16,
              borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 14,
            }}>
              <Mail size={20} color={COLORS.primary} />
              <TextInput
                placeholder="your@email.com"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, color: COLORS.text, fontSize: 15 }}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ marginBottom: 18 }}>
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>
              Password
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: COLORS.card, borderRadius: 16,
              borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 14,
            }}>
              <Lock size={20} color={COLORS.primary} />
              <TextInput
                placeholder="Create a strong password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, color: COLORS.text, fontSize: 15 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={COLORS.textMuted} /> : <Eye size={20} color={COLORS.textMuted} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>
              Confirm Password
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: COLORS.card, borderRadius: 16,
              borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 14,
            }}>
              <Lock size={20} color={COLORS.primary} />
              <TextInput
                placeholder="Re-enter your password"
                placeholderTextColor={COLORS.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, color: COLORS.text, fontSize: 15 }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} color={COLORS.textMuted} /> : <Eye size={20} color={COLORS.textMuted} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          <View style={{
            backgroundColor: 'rgba(230,57,70,0.08)', borderRadius: 16,
            padding: 16, marginBottom: 28,
            borderWidth: 1, borderColor: 'rgba(230,57,70,0.2)',
          }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 6 }}>Password must contain:</Text>
            {['At least 8 characters', 'One uppercase letter', 'One number'].map((req) => (
              <Text key={req} style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 3 }}>• {req}</Text>
            ))}
          </View>

          {/* Signup Button */}
          <TouchableOpacity onPress={() => router.push("/otp-verify")} activeOpacity={0.85}>
            <LinearGradient
              colors={["#E63946", "#FF8C6B"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login link */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}