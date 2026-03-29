import { config } from 'dotenv';
import { z } from 'zod';
import { registerAs } from '@nestjs/config';

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['dev', 'prod', 'test']),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PORT: z
      .string()
      .min(1)
      .transform((v) => parseInt(v, 10)),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
  })
  .transform((env) => ({
    nodeEnv: env.NODE_ENV,
    postgresHost: env.POSTGRES_HOST,
    postgresPort: env.POSTGRES_PORT,
    postgresUser: env.POSTGRES_USER,
    postgresPassword: env.POSTGRES_PASSWORD,
    postgresDb: env.POSTGRES_DB,
  }));

export type Env = z.infer<typeof envSchema>;

export const registerEnv = registerAs('ENV', () =>
  envSchema.parse(process.env),
);

export function getEnv() {
  config();
  return envSchema.parse(process.env);
}
