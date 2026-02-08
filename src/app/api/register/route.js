import { authOptions } from "@/services/authOptions";
import prisma from "@/services/prismaClient";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";

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
	// Si STAFF_EMAILS n'est pas défini, on ne bloque pas la création
	return true;
}

function getRoleForEmail(email) {
	const admin = new Set(parseEmailList(process.env.ADMIN_EMAILS));
	return admin.has(email) ? "ADMIN" : "AGENT";
}

function isEmailAdmin(email) {
	const admin = new Set(parseEmailList(process.env.ADMIN_EMAILS));
	return admin.has(email);
}

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		const isAdminSession = session?.user?.role === "ADMIN";

		const body = await req.json();
		const email = String(body?.email || "")
			.trim()
			.toLowerCase();
		const password = String(body?.password || "");
		const name = String(body?.name || "").trim();

		if (!email.includes("@")) {
			return Response.json({ error: "Email invalide" }, { status: 400 });
		}

		// Politique backoffice :
		// - Après bootstrap, seule une session ADMIN peut créer des comptes.
		// - Bootstrap : si aucun ADMIN n'existe, on autorise uniquement la création d'un compte ADMIN (email présent dans ADMIN_EMAILS).
		const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
		if (!isAdminSession) {
			if (adminCount === 0) {
				if (!isEmailAdmin(email)) {
					return Response.json(
						{
							error:
								"Initialisation: seul un email admin (ADMIN_EMAILS) peut créer le premier compte.",
						},
						{ status: 403 },
					);
				}
			} else {
				return Response.json({ error: "Accès admin requis." }, { status: 403 });
			}
		}

		if (!isEmailAllowed(email)) {
			return Response.json(
				{ error: "Inscription réservée à l'équipe." },
				{ status: 403 },
			);
		}
		if (password.length < 8) {
			return Response.json(
				{ error: "Mot de passe: 8 caractères minimum" },
				{ status: 400 },
			);
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return Response.json({ error: "Email déjà utilisé" }, { status: 409 });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				name: name || null,
				passwordHash,
				role: getRoleForEmail(email),
			},
			select: { id: true, email: true },
		});

		return Response.json({ ok: true, user }, { status: 201 });
	} catch (e) {
		return Response.json(
			{ error: e?.message || "Erreur serveur" },
			{ status: 500 },
		);
	}
}
