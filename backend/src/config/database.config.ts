import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  poolMin: parseInt(process.env.DATABASE_POOL_MIN ?? '5', 10),
  poolMax: parseInt(process.env.DATABASE_POOL_MAX ?? '20', 10),
}));
