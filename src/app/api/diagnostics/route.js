export const runtime = "nodejs";

function present(name) {
	return Boolean(process.env[name] && String(process.env[name]).trim().length);
}

function mask(value) {
	if (!value) return null;
	const s = String(value);
	if (s.length <= 8) return "***";
	return `${s.slice(0, 4)}***${s.slice(-4)}`;
}

export async function GET(req) {
	const headers = req?.headers;
	const host = headers?.get("host") || null;
	const xfHost = headers?.get("x-forwarded-host") || null;
	const xfProto = headers?.get("x-forwarded-proto") || null;
	const origin = host && xfProto ? `${xfProto}://${host}` : null;

	const data = {
		ok: true,
		at: new Date().toISOString(),
		node: process.version,
		request: {
			host,
			xForwardedHost: xfHost,
			xForwardedProto: xfProto,
			origin,
		},
		vercel: {
			env: process.env.VERCEL_ENV || null,
			url: process.env.VERCEL_URL || null,
			region: process.env.VERCEL_REGION || null,
			commitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
			commitMsg: process.env.VERCEL_GIT_COMMIT_MESSAGE || null,
			branch: process.env.VERCEL_GIT_COMMIT_REF || null,
		},
		app: {
			nextauthUrl: process.env.NEXTAUTH_URL || null,
			nextauthUrlMasked: mask(process.env.NEXTAUTH_URL),
			varsPresent: {
				DATABASE_URL: present("DATABASE_URL"),
				NEXTAUTH_URL: present("NEXTAUTH_URL"),
				NEXTAUTH_SECRET: present("NEXTAUTH_SECRET"),
				ADMIN_EMAILS: present("ADMIN_EMAILS"),
				STAFF_EMAILS: present("STAFF_EMAILS"),
				NEXT_PUBLIC_MAPS_API_KEY: present("NEXT_PUBLIC_MAPS_API_KEY"),
				NEXT_PUBLIC_GOOGLE_MAP_ID: present("NEXT_PUBLIC_GOOGLE_MAP_ID"),
				NEXT_PUBLIC_EMAILJS_SERVICE_ID: present(
					"NEXT_PUBLIC_EMAILJS_SERVICE_ID",
				),
				NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: present(
					"NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
				),
				NEXT_PUBLIC_EMAILJS_USER_ID: present("NEXT_PUBLIC_EMAILJS_USER_ID"),
			},
			// Info non sensible: on masque juste pour éviter d'afficher des URLs longues.
			databaseUrlMasked: mask(process.env.DATABASE_URL),
			mapsKeyMasked: mask(process.env.NEXT_PUBLIC_MAPS_API_KEY),
			googleMapIdMasked: mask(process.env.NEXT_PUBLIC_GOOGLE_MAP_ID),
		},
	};

	return Response.json(data);
}
