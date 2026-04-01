import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface LovrHubLogoProps {
  size?: number;
  color?: string;
  useGradient?: boolean;
}

export function LovrHubLogo({ 
  size = 80, 
  color = '#FB7185',
  useGradient = true 
}: LovrHubLogoProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FB7185" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F43F5E" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Heart shape with two facing profiles */}
        <Path
          d="M256 448C256 448 64 320 64 192C64 131.2 115.2 80 176 80C208 80 237.6 94.4 256 117.6C274.4 94.4 304 80 336 80C396.8 80 448 131.2 448 192C448 320 256 448 256 448Z"
          fill={useGradient ? "url(#logoGradient)" : color}
        />
        
        {/* Left profile cutout (facing right) */}
        <Path
          d="M180 160C180 160 200 160 200 180C200 200 200 220 180 240C160 260 140 280 140 300C140 320 160 340 180 340L180 160Z"
          fill="white"
          opacity="0.95"
        />
        
        {/* Right profile cutout (facing left) */}
        <Path
          d="M332 160C332 160 312 160 312 180C312 200 312 220 332 240C352 260 372 280 372 300C372 320 352 340 332 340L332 160Z"
          fill="white"
          opacity="0.95"
        />
        
        {/* Enhanced profile details - left side */}
        <Path
          d="M200 180C200 180 210 175 215 180C215 185 215 195 200 210L200 180Z"
          fill="white"
          opacity="0.9"
        />
        
        {/* Enhanced profile details - right side */}
        <Path
          d="M312 180C312 180 302 175 297 180C297 185 297 195 312 210L312 180Z"
          fill="white"
          opacity="0.9"
        />
      </Svg>
    </View>
  );
}