import { authOptions } from "@/services/authOptions";
import prisma from "@/services/prismaClient";
import { getServerSession } from "next-auth";

function requireBackoffice(session) {
	const role = session?.user?.role;
	return role === "ADMIN" || role === "AGENT";
}

export async function GET(req) {
	const session = await getServerSession(authOptions);
	if (!requireBackoffice(session)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const status = searchParams.get("status");

	const where = {};
	if (status && status !== "ALL") {
		where.status = status;
	}

	const leads = await prisma.lead.findMany({
		where,
		orderBy: { createdAt: "desc" },
		include: {
			property: { select: { id: true, title: true } },
		},
	});

	return Response.json({ ok: true, leads });
}
