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
		<div className='h-full w-full bg-secondary'>
			<div className='h-40 shadow-xl border-b-[1px] bg-background border-secondary text-text'>
				<p className=' text-4xl '>{property.title}</p>
				<p className='text-3xl'>{`${formattedPrice} $`}</p>
			</div>
			<div className='h-[600px] aspect-auto bg-secondary shadow-xl'>
				<div className='flex justify-center items-center h-full min-w-[50%]'>
					<Carousel slides={property.photos} />
				</div>
			</div>
			<div className='flex justify-center'>
				<div className=' h-96 shadow-xl w-[95%]  justify-center items-center'>
					<Map markers={addressMap} />
				</div>
			</div>
			<div className='h-[600px]  shadow-xl bg-secondary flex justify-center '>
				<MailForm />
			</div>
		</div>
	);
}
