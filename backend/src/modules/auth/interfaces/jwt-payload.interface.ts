export interface JwtPayload {
  /** Subject – user UUID */
  sub: string;
  email?: string;
  role: 'user' | 'admin';
  tier: 'free' | 'premium' | 'premium_plus';
  status: string;
  /** JWT ID used for token blacklisting */
  jti?: string;
  iat?: number;
  exp?: number;
}
