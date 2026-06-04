const rawOrigins = process.env.CORS_ORIGINS ?? process.env.FRONTEND_URL;

if (!rawOrigins) {
  throw new Error('CORS_ORIGINS or FRONTEND_URL is not defined in environment variables');
}

export const allowedOrigins = rawOrigins
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

export function isAllowedOrigin(origin: string | undefined) {
  if (!origin) {
    return false;
  }

  const normalizedOrigin = origin.replace(/\/+$/, '');

  return allowedOrigins.includes(normalizedOrigin);
}

if (allowedOrigins.length === 0) {
  throw new Error('No valid frontend origins were provided');
}
