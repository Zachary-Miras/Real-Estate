import prisma from "../../../services/prismaClient";

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
		<div>
			{property && (
				<div>
					<h1>{property.title}</h1>
					<p>{property.price}</p>
					<p>{property.address.street}</p>
				</div>
			)}
		</div>
	);
}
