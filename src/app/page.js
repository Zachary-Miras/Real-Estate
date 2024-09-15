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
		<div className=''>
			<Header className='w-full' />
			<div className='flex flex-wrap items-center justify-center gap-4'>
				{products.map((product) => (
					<Item
						key={product.id}
						name={product.name}
						priceInCents={product.priceInCents}
						description={product.description}
						reviews={product.reviews}
						ImagePath={product.ImagePath}
						className='mx-2'
					/>
				))}
			</div>
		</div>
	);
}
