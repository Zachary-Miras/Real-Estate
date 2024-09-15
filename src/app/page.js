import { PrismaClient } from "@prisma/client";
import { Header } from "../Components/Header";
import { Item } from "../Components/Item";

const prisma = new PrismaClient();

async function getProducts() {
	return prisma.product.findMany();
}

export default async function Home() {
	const products = await getProducts();

	return (
		<div>
			<Header />
			<div className='items-container'>
				{products.map((product) => (
					<Item
						key={product.id}
						name={product.name}
						priceInCents={product.priceInCents}
						description={product.description}
						reviews={product.reviews}
						ImagePath={product.ImagePath}
					/>
				))}
			</div>
		</div>
	);
}
