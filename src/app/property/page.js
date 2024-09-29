import Property from "@/Components/Property";
import { Header } from "../../Components/Header";
import prisma from "../../services/prismaClient";

export async function getProperty(city) {
	const query = city
		? { where: { address: { city } }, include: { address: true } }
		: { include: { address: true } };
	return prisma.property.findMany(query);
}

export default async function Home() {
	let city = "";
	const properties = await getProperty(city);

	return (
		<div className='min-h-screen'>
			<Header className='w-full' />
			<Property properties={properties} city={city} />
		</div>
	);
}
