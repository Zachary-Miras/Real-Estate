import MapExplore from "@/Components/MapExplore";
import prisma from "@/services/prismaClient";

async function getProperties() {
	return prisma.property.findMany({
		where: { status: "PUBLISHED" },
		orderBy: { createdAt: "desc" },
		include: { address: true },
	});
}

export default async function CartePage() {
	const properties = await getProperties();

	// Aucune distraction: pas de header
	return <MapExplore properties={properties} />;
}
