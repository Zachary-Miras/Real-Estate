import Property from "@/Components/Property";
import { PrismaClient } from "@prisma/client";
import { Header } from "../../Components/Header";
const prisma = new PrismaClient();

async function getProperty() {
	return prisma.property.findMany({
		include: {
			address: true,
		},
	});
}

export default async function Home() {
	const properties = await getProperty();

	return (
		<div className='min-h-screen'>
			<Header className='w-full' />
			<Property properties={properties} />
		</div>
	);
}
