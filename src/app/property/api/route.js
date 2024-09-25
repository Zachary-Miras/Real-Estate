import prisma from "../../../services/prismaClient";

export async function GET(request) {
	async function getProperty() {
		return prisma.property.findMany({
			include: {
				address: true,
			},
		});
	}

	try {
		const properties = await getProperty();
		return new Response(JSON.stringify(properties), { status: 200 });
	} catch (error) {
		console.error("Error fetching properties:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
