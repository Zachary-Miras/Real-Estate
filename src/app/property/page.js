import { Header } from "@/Components/Header";
import Properties from "@/Components/Properties";
import prisma from "@/services/prismaClient";

export const dynamic = "force-dynamic";
async function getProperty() {
	try {
		return await prisma.property.findMany({
			where: { status: "PUBLISHED" },
			include: {
				address: true,
			},
		});
	} catch (err) {
		console.error("Property list DB error:", err);
		return [];
	}
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
