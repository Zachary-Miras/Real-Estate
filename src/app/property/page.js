import Property from "@/Components/Property";
import { Header } from "../../Components/Header";
import prisma from "../../services/prismaClient";

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
