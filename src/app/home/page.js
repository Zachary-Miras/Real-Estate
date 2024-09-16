import { PrismaClient } from "@prisma/client";
import { Header } from "../../Components/Header";
import { Information } from "../../Components/Information";
import { Property } from "../../Components/Property";
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
			<div className='flex w-full'>
				<div className='flex flex-wrap justify-around gap-2 w-2/5 overflow-scroll flex-row no-scrollbar h-screen-minus-header'>
					{properties.map((property) => (
						<Property
							key={property.id}
							title={property.title}
							price={property.price}
							address={`${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.zipCode}, ${property.address.country}`}
							imageUrl={property.photos[0]}
						/>
					))}
				</div>
				<Information className='w-3/5 fixed right-0 h-screen-minus-header' />
			</div>
		</div>
	);
}
