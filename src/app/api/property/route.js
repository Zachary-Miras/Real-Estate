import { NextResponse } from "next/server";
import prisma from "../../../services/prismaClient";

export async function GET(request) {
	async function getProperty(city) {
		const query = city
			? { where: { address: { city } }, include: { address: true } }
			: { include: { address: true } };
		return prisma.property.findMany(query);
	}

	try {
		const { searchParams } = new URL(request.url);
		const city = searchParams.get("city");
		const properties = await getProperty(city);
		return new NextResponse(JSON.stringify(properties), { status: 200 });
	} catch (error) {
		console.error("Error fetching properties:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
