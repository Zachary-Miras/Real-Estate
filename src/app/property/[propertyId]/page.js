import { Header } from "@/Components/Header";
import { Property } from "@/Components/Property";
import prisma from "@/services/prismaClient";
import { notFound } from "next/navigation";

export default async function page({ params }) {
	const propertyId = params.propertyId;

	async function getProperty() {
		return prisma.property.findUnique({
			where: {
				id: propertyId,
			},
			include: {
				address: true,
			},
		});
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
