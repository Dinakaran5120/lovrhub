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

// export default function LoginScreen() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = () => {
//     // Mock login - navigate to main app
//     router.replace("/(tabs)");
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
//             Welcome Back
//           </StyledText>
//           <StyledText className="text-foreground/70 mb-8 text-center">
//             Log in to continue your journey on LovrHub
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
//                 placeholder="Enter your password"
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

//           {/* Forgot Password */}
//           <StyledTouchableOpacity className="self-end mb-8">
//             <StyledText className="text-primary font-semibold">Forgot Password?</StyledText>
//           </StyledTouchableOpacity>

//           {/* Login Button */}
//           <StyledTouchableOpacity onPress={handleLogin}>
//             <LinearGradient
//               colors={["#E63946", "#FF8C6B"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={{ borderRadius: 16, padding: 18 }}
//             >
//               <StyledText className="text-lg font-bold text-[#FFF8F5] text-center">
//                 Log In
//               </StyledText>
//             </LinearGradient>
//           </StyledTouchableOpacity>

//           {/* Divider */}
//           <StyledView className="flex-row items-center my-8">
//             <StyledView className="flex-1 h-px bg-border" />
//             <StyledText className="px-4 text-muted-foreground">or</StyledText>
//             <StyledView className="flex-1 h-px bg-border" />
//           </StyledView>

//           {/* Sign Up Link */}
//           <StyledView className="flex-row items-center justify-center gap-2">
//             <StyledText className="text-foreground/60">Don't have an account?</StyledText>
//             <StyledTouchableOpacity onPress={() => router.push("/signup")}>
//               <StyledText className="text-primary font-bold">Sign Up</StyledText>
//             </StyledTouchableOpacity>
//           </StyledView>
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

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            Welcome Back
          </Text>
          <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginBottom: 32, fontSize: 14 }}>
            Log in to continue your journey on LovrHub
          </Text>

          {/* Email */}
          <View style={{ marginBottom: 18 }}>
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>Email Address</Text>
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
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>Password</Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: COLORS.card, borderRadius: 16,
              borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 14,
            }}>
              <Lock size={20} color={COLORS.primary} />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, color: COLORS.text, fontSize: 15 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword
                  ? <EyeOff size={20} color={COLORS.textMuted} />
                  : <Eye size={20} color={COLORS.textMuted} />
                }
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 28 }}>
            <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity onPress={() => router.replace("/(tabs)")} activeOpacity={0.85}>
            <LinearGradient
              colors={["#E63946", "#FF8C6B"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 28 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <Text style={{ color: COLORS.textMuted, paddingHorizontal: 14, fontSize: 13 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </View>

          {/* Sign Up */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}