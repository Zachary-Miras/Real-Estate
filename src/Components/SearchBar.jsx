import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { useRef } from "react";

const libraries = ["places"];

function SearchBar({ onAddressChange }) {
	const inputRef = useRef(null);

	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
		libraries: libraries,
	});

	const handleOnPlacesChanged = () => {
		let places = inputRef.current.getPlaces();
		if (places && places.length > 0) {
			let address = places[0].formatted_address;
			onAddressChange(address);
		}
	};

	if (loadError) {
		return <div>Error loading Google Maps</div>;
	}

	return (
		<div className='w-full h-8 border rounded-lg'>
			{isLoaded && (
				<StandaloneSearchBox
					onLoad={(ref) => (inputRef.current = ref)}
					onPlacesChanged={handleOnPlacesChanged}>
					<input
						type='text'
						placeholder='Adresse'
						className='bg-slate-100 w-full h-full outline-none pl-2'></input>
				</StandaloneSearchBox>
			)}
		</div>
	);
}

export default SearchBar;
