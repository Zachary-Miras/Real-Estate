import prisma from "@/services/prismaClient";

function isValidEmail(email) {
	const e = String(email || "").trim();
	return e.includes("@") && e.includes(".");
}

function toNullableString(value) {
	const s = String(value ?? "").trim();
	return s ? s : null;
}

export async function POST(req) {
	try {
		const body = await req.json().catch(() => ({}));

		const name = String(body?.name || "").trim();
		const email = String(body?.email || "")
			.trim()
			.toLowerCase();
		const phone = toNullableString(body?.phone);
		const subject = String(body?.subject || "").trim();
		const message = String(body?.message || "").trim();
		const pageUrl = toNullableString(body?.pageUrl);
		const propertyId = toNullableString(body?.propertyId);
		const propertyTitle = toNullableString(body?.propertyTitle);

		if (!name) return Response.json({ error: "Nom requis" }, { status: 400 });
		if (!isValidEmail(email))
			return Response.json({ error: "Email invalide" }, { status: 400 });
		if (!subject)
			return Response.json({ error: "Sujet requis" }, { status: 400 });
		if (!message)
			return Response.json({ error: "Message requis" }, { status: 400 });

		const lead = await prisma.lead.create({
			data: {
				name,
				email,
				phone,
				subject,
				message,
				pageUrl,
				propertyTitle,
				propertyId,
			},
			select: { id: true },
		});

		return Response.json({ ok: true, id: lead.id }, { status: 201 });
	} catch (e) {
		return Response.json(
			{ error: e?.message || "Erreur serveur" },
			{ status: 500 },
		);
	}
}
