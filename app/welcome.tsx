
// import { LovrHubLogo } from "@/components/LovrHubLogo";
// import { LinearGradient } from "expo-linear-gradient";
// import { Link } from "expo-router";
// import { Chrome, Mail, Smartphone } from "lucide-react-native";
// import { Text, TouchableOpacity, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const COLORS = {
//   background: '#111111',
//   card: '#1c1c1e',
//   primary: '#E63946',
//   border: '#3f3f46',
//   text: '#ffffff',
//   textMuted: '#9ca3af',
// };

// export default function WelcomeScreen() {
//   const insets = useSafeAreaInsets();

//   return (
//     <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top, paddingBottom: insets.bottom }}>
//       <View style={{ flex: 1, justifyContent: 'space-between', padding: 24 }}>

//         {/* Hero */}
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <View style={{ marginBottom: 24 }}>
//             <LovrHubLogo size={120} useGradient={true} />
//           </View>
//           <Text style={{ color: COLORS.text, fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
//             Welcome to LovrHub
//           </Text>
//           <Text style={{ color: COLORS.textMuted, fontSize: 16, textAlign: 'center', paddingHorizontal: 32, lineHeight: 24 }}>
//             Find meaningful connections in a safe, inclusive space for everyone
//           </Text>
//         </View>

//         {/* Auth Options */}
//         <View style={{ gap: 12 }}>

//           {/* Sign up with Email */}
//           <Link href="/signup" asChild>
//             <TouchableOpacity activeOpacity={0.85}>
//               <LinearGradient
//                 colors={["#E63946", "#FF8C6B"]}
//                 start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//                 style={{ borderRadius: 16, paddingVertical: 18 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
//                   <Mail size={22} color="white" />
//                   <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Sign up with Email</Text>
//                 </View>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Link>

//           {/* Sign up with Phone */}
//           <Link href="/signup-phone" asChild>
//             <TouchableOpacity
//               activeOpacity={0.85}
//               style={{
//                 backgroundColor: 'rgba(230,57,70,0.08)', borderRadius: 16,
//                 paddingVertical: 18, borderWidth: 1.5, borderColor: COLORS.primary,
//               }}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
//                 <Smartphone size={22} color={COLORS.primary} />
//                 <Text style={{ color: COLORS.primary, fontSize: 17, fontWeight: 'bold' }}>Sign up with Phone</Text>
//               </View>
//             </TouchableOpacity>
//           </Link>

//           {/* Continue with Google */}
//           <Link href="/(tabs)" asChild>
//             <TouchableOpacity
//               activeOpacity={0.85}
//               style={{
//                 backgroundColor: COLORS.card, borderRadius: 16,
//                 paddingVertical: 18, borderWidth: 1, borderColor: COLORS.border,
//               }}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
//                 <Chrome size={22} color={COLORS.textMuted} />
//                 <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: 'bold' }}>Continue with Google</Text>
//               </View>
//             </TouchableOpacity>
//           </Link>

//           {/* Login link */}
//           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
//             <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>Already have an account?</Text>
//             <Link href="/login" asChild>
//               <TouchableOpacity>
//                 <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }}>Log In</Text>
//               </TouchableOpacity>
//             </Link>
//           </View>

//           {/* Terms */}
//           <Text style={{ color: COLORS.textMuted, fontSize: 11, textAlign: 'center', paddingHorizontal: 24, lineHeight: 16, marginTop: 4 }}>
//             By continuing, you agree to our Terms of Service and Privacy Policy
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// }

import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Chrome, Mail, Smartphone } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  background: '#111111',
  card: '#1c1c1e',
  primary: '#E63946',
  border: '#3f3f46',
  text: '#ffffff',
  textMuted: '#9ca3af',
};

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View style={{ flex: 1, justifyContent: 'space-between', padding: 24 }}>

        {/* Hero */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* ✅ Logo image — replace LovrHubLogo component */}
          <Image
            source={require('../assets/images/lovrhub-logo.png')}
            style={{ width: 120, height: 120, marginBottom: 24 }}
            resizeMode="contain"
          />
          <Text style={{ color: COLORS.text, fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
            Welcome to LovrHub
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 16, textAlign: 'center', paddingHorizontal: 32, lineHeight: 24 }}>
            Find meaningful connections in a safe, inclusive space for everyone
          </Text>
        </View>

        {/* Auth Options */}
        <View style={{ gap: 12 }}>

          {/* Sign up with Email */}
          <Link href="/signup" asChild>
            <TouchableOpacity activeOpacity={0.85}>
              <LinearGradient
                colors={["#E63946", "#FF8C6B"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, paddingVertical: 18 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <Mail size={22} color="white" />
                  <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Sign up with Email</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Link>

          {/* Sign up with Phone */}
          <Link href="/signup-phone" asChild>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                backgroundColor: 'rgba(230,57,70,0.08)', borderRadius: 16,
                paddingVertical: 18, borderWidth: 1.5, borderColor: COLORS.primary,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Smartphone size={22} color={COLORS.primary} />
                <Text style={{ color: COLORS.primary, fontSize: 17, fontWeight: 'bold' }}>Sign up with Phone</Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Continue with Google */}
          <Link href="/(tabs)" asChild>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                backgroundColor: COLORS.card, borderRadius: 16,
                paddingVertical: 18, borderWidth: 1, borderColor: COLORS.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Chrome size={22} color={COLORS.textMuted} />
                <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: 'bold' }}>Continue with Google</Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Login link */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>Already have an account?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }}>Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Terms */}
          <Text style={{ color: COLORS.textMuted, fontSize: 11, textAlign: 'center', paddingHorizontal: 24, lineHeight: 16, marginTop: 4 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}