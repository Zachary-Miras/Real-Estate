import MapExplore from "@/Components/MapExplore";
import prisma from "@/services/prismaClient";

export const dynamic = "force-dynamic";

async function getProperties() {
	try {
		return await prisma.property.findMany({
			where: { status: "PUBLISHED" },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				price: true,
				rentPriceMonthly: true,
				photos: true,
				address: {
					select: {
						street: true,
						city: true,
						state: true,
						zipCode: true,
						country: true,
					},
				},
			},
		});
	} catch (err) {
		console.error("Carte DB error:", err);
		return [];
	}
}

export default async function CartePage() {
	const properties = await getProperties();

	// Aucune distraction: pas de header
	return <MapExplore properties={properties} />;
}
