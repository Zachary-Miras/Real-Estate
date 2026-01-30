import { authOptions } from "@/services/authOptions";
import prisma from "@/services/prismaClient";
import { getServerSession } from "next-auth";

function requireBackoffice(session) {
	const role = session?.user?.role;
	return role === "ADMIN" || role === "AGENT";
}

export async function PATCH(req, { params }) {
	const session = await getServerSession(authOptions);
	if (!requireBackoffice(session)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json().catch(() => ({}));
	const status = String(body?.status || "").trim();
	const allowed = new Set(["NEW", "IN_PROGRESS", "DONE", "SPAM"]);
	if (!allowed.has(status)) {
		return Response.json({ error: "Status invalide" }, { status: 400 });
	}

	const lead = await prisma.lead.update({
		where: { id: params.id },
		data: { status },
		select: { id: true, status: true },
	});

	return Response.json({ ok: true, lead });
}
