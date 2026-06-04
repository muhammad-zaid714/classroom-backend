import type { CorsOptions } from 'cors';

const normalizeOrigin = (origin: string): string => origin.replace(/\/+$/, '');

const parseCommaSeparatedOrigins = (value: string | undefined): string[] => {
	if (!value) return [];
	return value
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean)
		.map(normalizeOrigin);
};

const isVercelOrigin = (origin: string): boolean => {
	try {
		return new URL(origin).hostname.endsWith('.vercel.app');
	} catch {
		return false;
	}
};

const frontendUrl = process.env.FRONTEND_URL;
const allowVercelPreview = process.env.ALLOW_VERCEL_PREVIEW !== 'false';

const configuredOrigins = new Set<string>([
	...parseCommaSeparatedOrigins(frontendUrl),
	...parseCommaSeparatedOrigins(process.env.FRONTEND_ORIGINS),
]);

export const corsOptions: CorsOptions = {
	origin(origin, callback) {
		// Allow non-browser clients and server-to-server requests without Origin header.
		if (!origin) return callback(null, true);

		const normalizedOrigin = normalizeOrigin(origin);
		const isConfiguredOrigin = configuredOrigins.has(normalizedOrigin);
		const isAllowedPreviewOrigin = allowVercelPreview && isVercelOrigin(normalizedOrigin);

		if (isConfiguredOrigin || isAllowedPreviewOrigin) {
			return callback(null, true);
		}

		return callback(new Error('Not allowed by CORS'));
	},
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	credentials: true,
	optionsSuccessStatus: 204,
};
