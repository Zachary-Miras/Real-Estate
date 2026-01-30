import { Header } from "@/Components/Header";
import Properties from "@/Components/Properties";
import prisma from "@/services/prismaClient";
async function getProperty() {
	return prisma.property.findMany({
		where: { status: "PUBLISHED" },
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
			<Properties properties={properties} />
		</div>
	);
}
