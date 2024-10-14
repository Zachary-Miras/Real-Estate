"use client";
import { useState } from "react";
import Item from "./Item";
import Map from "./Map";
import SearchBar from "./SearchBar";

export default function Properties({ properties }) {
	const [city, setCity] = useState("Paris");
	const [country, setCountry] = useState("France");
	const [address, setAddress] = useState("Paris, France");

	const handleAddressChange = (address, newCity, newCountry) => {
		setAddress(address);
		setCity(newCity);
		setCountry(newCountry);
	};

	const formatAddress = (address) => {
		const addressParts = [
			address.street,
			address.city,
			address.state,
			address.zipCode,
		];
		return addressParts.filter((part) => part).join(", ");
	};

	const filteredProperties = properties.filter((property) => {
		if (city) {
			return property.address.city === city;
		} else {
			return property.address.country === country;
		}
	});

	const filteredAddresses = filteredProperties.map((property) =>
		formatAddress(property.address)
	);

	return (
		<div className='flex w-full h-full'>
			<div className='flex flex-wrap gap-2 w-[55%] h-full justify-start bg-white ml-[5%] mr-[5%]'>
				<SearchBar onAddressChange={handleAddressChange} />
				{filteredProperties.map((property) => {
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
			<div className='w-[50%] h-[80vh] outline-none pr-8'>
				<Map className='' markers={filteredAddresses} />
			</div>
		</div>
	);
}
