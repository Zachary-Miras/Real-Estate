const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
	// MongoDB: les docs existants peuvent ne pas avoir le champ `status`.
	// Selon les cas, Prisma peut ne pas matcher via `where: { status: null }`.
	// On fait donc 2 passes: Prisma updateMany + commande Mongo raw ($exists: false).

	let prismaUpdated = 0;
	try {
		const result = await prisma.property.updateMany({
			where: { status: null },
			data: { status: "PUBLISHED" },
		});
		prismaUpdated = result.count || 0;
	} catch {
		prismaUpdated = 0;
	}

	let rawModified = 0;
	try {
		const raw = await prisma.$runCommandRaw({
			update: "Property",
			updates: [
				{
					q: { status: { $exists: false } },
					u: { $set: { status: "PUBLISHED" } },
					multi: true,
				},
				{
					q: { status: null },
					u: { $set: { status: "PUBLISHED" } },
					multi: true,
				},
			],
		});
		// Mongo renvoie typiquement un tableau de résultats dans `raw`.
		// On essaie plusieurs formes possibles selon versions.
		const first = Array.isArray(raw?.results) ? raw.results[0] : null;
		const second = Array.isArray(raw?.results) ? raw.results[1] : null;
		rawModified =
			(first?.nModified || 0) +
			(second?.nModified || 0) +
			(raw?.nModified || 0);
	} catch {
		rawModified = 0;
	}

	console.log(
		`Backfill status: prisma=${prismaUpdated}, mongoRaw=${rawModified}`,
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
