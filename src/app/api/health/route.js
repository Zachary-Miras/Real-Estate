import prisma from "@/services/prismaClient";

export async function GET() {
	let db = false;
	let error = null;

	try {
		// Prisma MongoDB: ping via runCommandRaw
		await prisma.$runCommandRaw({ ping: 1 });
		db = true;
	} catch (e) {
		error = e instanceof Error ? e.message : String(e);
	}

	return Response.json(
		{
			ok: true,
			db,
			error,
			timestamp: new Date().toISOString(),
		},
		{ status: db ? 200 : 503 },
	);
}
