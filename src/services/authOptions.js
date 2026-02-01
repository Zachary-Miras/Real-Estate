import prisma from "@/services/prismaClient";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

function parseEmailList(value) {
	return String(value || "")
		.split(/[\s,;]+/)
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean);
}

function isEmailAllowed(email) {
	const admin = new Set(parseEmailList(process.env.ADMIN_EMAILS));
	const staff = parseEmailList(process.env.STAFF_EMAILS);
	if (staff.length > 0) {
		return staff.includes(email) || admin.has(email);
	}
	// Si STAFF_EMAILS n'est pas défini, on ne bloque pas les comptes déjà créés.
	// La sécurité repose alors sur l'existence d'un compte en DB + mot de passe.
	// (La création de compte reste protégée via /api/register.)
	return true;
}

function getRoleForEmail(email) {
	const admin = new Set(parseEmailList(process.env.ADMIN_EMAILS));
	return admin.has(email) ? "ADMIN" : "AGENT";
}

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Mot de passe", type: "password" },
			},
			authorize: async (credentials) => {
				const email = String(credentials?.email || "")
					.trim()
					.toLowerCase();
				const password = String(credentials?.password || "");

				if (!email || !password) return null;

				const selectUser = {
					id: true,
					email: true,
					name: true,
					passwordHash: true,
					role: true,
				};

				let user = await prisma.user.findUnique({
					where: { email },
					select: selectUser,
				});

				// MongoDB + emails non normalisés : la comparaison est case-sensitive.
				// Fallback safe pour backoffice: scan (faible volumétrie) pour matcher
				// en case-insensitive et éviter un lock-out en prod.
				if (!user) {
					const candidates = await prisma.user.findMany({ select: selectUser });
					user = candidates.find(
						(u) =>
							String(u?.email || "")
								.trim()
								.toLowerCase() === email,
					);
				}

				if (!user) return null;
				// Allowlist (équipe) : si configurée, on la respecte. Sinon, on laisse
				// les comptes existants se connecter (évite un lock-out en prod).
				if (!isEmailAllowed(email)) return null;

				const ok = await bcrypt.compare(password, user.passwordHash);
				if (!ok) return null;

				// En mode backoffice, le rôle vient de l'allowlist.
				const expectedRole = getRoleForEmail(email);
				if (user.role !== expectedRole) {
					await prisma.user.update({
						where: { email },
						data: { role: expectedRole },
					});
					user.role = expectedRole;
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.uid = user.id;
				token.role = user.role;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.uid;
				session.user.role = token.role;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};
