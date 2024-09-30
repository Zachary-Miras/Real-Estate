"use client";
import Carousel from "./Carousel";
import MailForm from "./MailForm";
import Map from "./Map";
export function Property({ property }) {
	const formatAddress = () => {
		const addressParts = [
			property.address.street,
			property.address.city,
			property.address.state,
			property.address.zipCode,
			property.address.country,
		];
		return addressParts.filter((part) => part).join(", ");
	};

	const formattedAddress = formatAddress();

	const addressMap = [
		`${property.address.street}, ${property.address.city},${property.address.state} , ${property.address.zipCode}, ${property.address.country}`,
	];

	const formattedPrice = property.price.toLocaleString();

	return (
		<div className='h-full w-full'>
			<div className='h-40 shadow-xl bg-background border-b-[1px] border-secondary text-text'>
				<p className=' text-4xl '>{property.title}</p>
				<p className='text-3xl'>{`${formattedPrice} $`}</p>
			</div>
			<div className='h-[600px] aspect-auto bg-secondary shadow-xl'>
				<div className='h-full min-w-[50%]'>
					<Carousel slides={property.photos} />
				</div>
			</div>
			<div className='h-96 shadow-xl bg-background'>
				<Map markers={addressMap} />
			</div>
			<div className='h-[600px] w-full shadow-xl bg-secondary flex  '>
				<MailForm />
			</div>
		</div>
	);
}
