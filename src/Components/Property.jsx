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

	const formattedPrice = new Intl.NumberFormat("fr-FR", {
		maximumFractionDigits: 0,
	}).format(property.price);

	return (
		<div className='h-full w-full bg-secondary'>
			<div className='h-40 border-b-[1px]  border-secondary text-text'>
				<p className=' text-4xl '>{property.title}</p>
				<p className='text-3xl'>{`${formattedPrice} €`}</p>
			</div>
			<div className='min-h-96 h-[60vh] aspect-auto bg-secondary'>
				<div className='flex justify-center items-center h-full min-w-[70%]'>
					<Carousel slides={property.photos} />
				</div>
			</div>
			<div className='flex justify-center'>
				<div className=' min-h-96 h-[60vh]  w-[70%]  justify-center items-center'>
					<Map markers={addressMap} />
				</div>
			</div>
			<div className='h-[600px]  bg-secondary flex justify-center '>
				<MailForm />
			</div>
		</div>
	);
}
