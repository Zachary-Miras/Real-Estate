"use client";
import { useState } from "react";
import Item from "./Item";
import Map from "./Map";
import SearchBar from "./SearchBar";

export default function Property({ properties }) {
	const [selectedProperty, setSelectedProperty] = useState(
		properties[0] || null
	);

	const [address, setAddress] = useState("");

	const handleAddressChange = (newAddress) => {
		setAddress(newAddress);
	};

	const formatAddress = (address) => {
		const addressParts = [
			address.street,
			address.city,
			address.state,
			address.zipCode,
			address.country,
		];
		return addressParts.filter((part) => part).join(", ");
	};

	return (
		<div className='flex w-full '>
			<div className='flex flex-wrap gap-2 w-[50%] h-full justify-start bg-white ml-[5%] mr-[5%]'>
				<SearchBar onAddressChange={handleAddressChange} />
				{properties.map((property) => {
					return (
						<Item
							key={property.id}
							id={property.id}
							title={property.title}
							price={property.price}
							address={formatAddress(property.address)}
							imageUrl={property.photos[0]}
						/>
					);
				})}
			</div>
			<div className='w-[50%] outline-none pr-8'>
				<Map address={formatAddress(selectedProperty.address)} />
			</div>
		</div>
	);
}
