import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createProduct() {
	const newProduct = await prisma.product.create({
		data: {
			name: "Apple iPhone 16 Pro",
			priceInCents: 147900,
			description:
				"The Apple iPhone 16 Pro is the latest iPhone model. It has a 6.1-inch Super Retina XDR display, a Ceramic Shield front cover, and a Pro camera system with Night mode, Deep Fusion, and Smart HDR 3. It also has the A14 Bionic chip, 5G capability, and iOS 14.",
			reviews: [],
			ImagePath:
				"https://media.ldlc.com/r1600/ld/products/00/06/16/64/LD0006166478.jpg",
		},
	});
	console.log("Created new product:", newProduct);
}
