export const env = {
  get nodeEnv() { return process.env.NODE_ENV; },
  get apiPrefix() { return process.env.NEXT_PUBLIC_API_PREFIX ?? '/api'; },
  get serverUrl() { return process.env.SERVER_URL ?? 'http://localhost:3000'; },
};
