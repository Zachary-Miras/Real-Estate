import { Property } from "@/Components/Property";
import prisma from "@/services/prismaClient";

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

	return (
		<div className='bg-background'>
			<Property property={property} />
		</div>
	);
}
