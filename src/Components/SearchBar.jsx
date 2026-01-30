"use client";

import { getGoogleMapsLoader } from "@/services/googleMapsLoader";
import { useEffect, useRef, useState } from "react";

function SearchBar({ onAddressChange }) {
	const inputRef = useRef(null);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;
		let autocomplete = null;
		let listener = null;

		const init = async () => {
			try {
				const loader = getGoogleMapsLoader();
				await loader.load();
				if (cancelled || !inputRef.current) return;

				autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
					fields: ["formatted_address", "address_components"],
				});

				listener = autocomplete.addListener("place_changed", () => {
					const place = autocomplete.getPlace();
					if (!place) return;

					const address = place.formatted_address || "";
					const components = place.address_components || [];
					const country =
						components.find((c) => c.types?.includes("country"))?.long_name ||
						"";
					const city =
						components.find((c) => c.types?.includes("locality"))?.long_name ||
						"";

					onAddressChange?.(address, city, country);
				});
			} catch (e) {
				if (!cancelled) {
					setError(e?.message || "Erreur de chargement Google Maps.");
				}
			}
		};

		init();

		return () => {
			cancelled = true;
			if (listener) listener.remove();
			if (autocomplete) google.maps.event.clearInstanceListeners(autocomplete);
		};
	}, [onAddressChange]);

	return (
		<div className='w-full border border-black/10 h-10 shadow-xl rounded-lg flex flex-col justify-center bg-white text-black'>
			<input
				ref={inputRef}
				type='text'
				placeholder={error ? error : "Adresse"}
				disabled={Boolean(error)}
				className='w-full h-full outline-none pl-3 bg-transparent text-black placeholder:text-black/40 disabled:text-black/40'
			/>
		</div>
	);
}

export default SearchBar;
