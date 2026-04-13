import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LovrHubLogo } from './LovrHubLogo';

const { width, height } = Dimensions.get('window');

type Props = { onFinish: () => void };

export function SplashScreen({ onFinish }: Props) {
  const logoScale   = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const tagOpacity  = useSharedValue(0);
  const rootOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Logo fades + scales in
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    logoScale.value   = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.6)) });

    // 2. Title fades in 400 ms after logo starts
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));

    // 3. Tagline fades in 700 ms after logo starts
    tagOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));

    // 4. After 2.4 s total, fade entire screen out, then call onFinish
    rootOpacity.value = withDelay(
      2400,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, finished => {
        if (finished) runOnJS(onFinish)();
      }),
    );
  }, []);

  const rootStyle  = useAnimatedStyle(() => ({ opacity: rootOpacity.value }));
  const logoStyle  = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const textStyle  = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const tagStyle   = useAnimatedStyle(() => ({ opacity: tagOpacity.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, rootStyle]}>
      <LinearGradient
        colors={['#1c1917', '#2d1418', '#1c1917']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.container]}
      >
        {/* Logo */}
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <LinearGradient
            colors={['#E63946', '#C2185B', '#7B1FA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ring}
          >
            <LovrHubLogo size={80} useGradient={false} color="#ffffff" />
          </LinearGradient>
        </Animated.View>

        {/* App name */}
        <Animated.View style={textStyle}>
          <Text style={styles.title}>LovrHub</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={tagStyle}>
          <Text style={styles.tagline}>Find your person 💕</Text>
        </Animated.View>

        {/* Bottom dot-pulse loader */}
        <Animated.View style={[styles.dotsRow, tagStyle]}>
          {[0, 1, 2].map(i => (
            <PulseDot key={i} delay={i * 180} />
          ))}
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

function PulseDot({ delay }: { delay: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    // Repeating pulse using a sequence with a loop-like pattern via withDelay + withSequence
    const pulse = () => {
      scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1.6, { duration: 380 }),
          withTiming(1,   { duration: 380 }),
        ),
      );
    };
    pulse();
    const interval = setInterval(pulse, 900);
    return () => clearInterval(interval);
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.4 + (scale.value - 1) * 0.6,
  }));

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  logoWrap: {
    marginBottom: 24,
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E63946',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.3,
    marginBottom: 48,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E63946',
  },
});
