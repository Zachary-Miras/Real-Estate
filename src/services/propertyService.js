import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createProperty() {
	const newAddress = await prisma.address.create({
		data: {
			street: "123 Rue de Paris",
			city: "Paris",
			state: "Île-de-France",
			zipCode: "75001",
			country: "France",
		},
	});

	const newProperty = await prisma.property.create({
		data: {
			title: "Appartement Luxueux à Paris",
			description: "Un magnifique appartement avec une vue sur la Tour Eiffel.",
			price: 950000.0,
			propertyType: "APARTMENT",
			addressId: newAddress.id,
			photos: [
				"https://www.vacationkey.com/photos/1/2/120678-1.jpg",
				"https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/243502419.jpg?k=a8daa6ea7ea625edae393ff76dfbed6527aa8cd1f9a99902612c0f647fe1d902&o=",
			],
		},
	});

	console.log("Created new address:", newAddress);
	console.log("Created new property:", newProperty);
}
