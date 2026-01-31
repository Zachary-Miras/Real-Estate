import { Header } from "@/Components/Header";
import { Property } from "@/Components/Property";
import prisma from "@/services/prismaClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function page({ params }) {
	const propertyId = params.propertyId;

	async function getProperty() {
		try {
			return await prisma.property.findUnique({
				where: {
					id: propertyId,
				},
				include: {
					address: true,
				},
			});
		} catch (err) {
			console.error("Property detail DB error:", err);
			return null;
		}
	}

	const property = await getProperty();
	if (!property || property.status !== "PUBLISHED") notFound();

	return (
		<div className='min-h-screen bg-background'>
			<Header className='sticky top-0 z-50' />
			<Property property={property} />
		</div>
	);
}
