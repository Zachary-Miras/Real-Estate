"use client";
import { useEffect, useRef, useState } from "react";
import Item from "./Item";
import Map from "./Map";
export default function Property({ properties }) {
	const [selectedProperty, setSelectedProperty] = useState(
		properties[0] || null
	);
	const scrollContainerRef = useRef(null);

	useEffect(() => {
		const container = scrollContainerRef.current;
		const items = container.querySelectorAll(".property-item");

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const propertyId = entry.target.getAttribute("data-id");
						const property = properties.find((p) => p.id === propertyId);
						setSelectedProperty(property);
					}
				});
			},
			{
				root: container,
				threshold: 1,
			}
		);

		items.forEach((item) => observer.observe(item));

		return () => {
			items.forEach((item) => observer.unobserve(item));
		};
	}, [properties]);

	const handleClick = (property, itemRef) => {
		setSelectedProperty(property);
		itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<div className='flex w-full '>
			<div
				ref={scrollContainerRef}
				className='flex flex-wrap gap-2 w-[50%] h-full justify-start bg-white ml-[5%] mr-[5%]'>
				{properties.map((property) => {
					const itemRef = useRef(null);
					return (
						<div
							key={property.id}
							data-id={property.id}
							className='property-item'
							ref={itemRef}
							onClick={() => handleClick(property, itemRef)}>
							<Item
								title={property.title}
								price={property.price}
								address={`${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.zipCode}, ${property.address.country}`}
								imageUrl={property.photos[0]}
							/>
						</div>
					);
				})}
			</div>
			<div className='w-[50%] outline-none pr-8'>
				<Map
					address={`${selectedProperty.address.street}, ${selectedProperty.address.city}, ${selectedProperty.address.state}, ${selectedProperty.address.zipCode}, ${selectedProperty.address.country}`}
				/>
			</div>
		</div>
	);
}
