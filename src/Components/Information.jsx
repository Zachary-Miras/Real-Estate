export default function Information({ property }) {
	if (!property) {
		return (
			<div className='w-full h-screen-minus-header bg-gray-300'>
				Sélectionnez un bien pour voir les détails
			</div>
		);
	}

	return (
		<div className='w-full h-screen-minus-header bg-gray-300 p-4'>
			<h2 className='text-2xl font-bold'>{property.title}</h2>
			<p className='text-xl'>{property.price}</p>
			<p className='text-lg'>
				{property.address.street}, {property.address.city},{" "}
				{property.address.state}, {property.address.zipCode},{" "}
				{property.address.country}
			</p>
			<img className='mt-4' src={property.photos[0]} alt={property.title} />
		</div>
	);
}
