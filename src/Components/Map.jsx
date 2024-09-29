import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

export default function Map({ markers }) {
	const mapRef = useRef(null);

	useEffect(() => {
		const initMap = async () => {
			const loader = new Loader({
				apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
				version: "weekly",
			});

			const { Map } = await loader.importLibrary("maps");
			const { Geocoder } = await loader.importLibrary("geocoding");
			const { AdvancedMarkerElement } = await loader.importLibrary("marker");

			const geocoder = new Geocoder();

			// Fonction pour géocoder une adresse et placer un marqueur
			const geocodeAddress = (address, map) => {
				return new Promise((resolve, reject) => {
					geocoder.geocode({ address }, (results, status) => {
						if (status === "OK") {
							const position = results[0].geometry.location;
							const marker = new AdvancedMarkerElement({
								map: map,
								position: position,
							});
							resolve(position);
						} else {
							console.error(
								"Geocode was not successful for the following reason: " + status
							);
							reject(status);
						}
					});
				});
			};

			// Géocoder la première adresse pour centrer la carte
			if (markers.length > 0) {
				const firstAddress = markers[0];
				geocodeAddress(firstAddress).then((firstPosition) => {
					// Options de la carte avec le centre sur le premier marqueur
					const mapOptions = {
						center: firstPosition,
						zoom: 15, // Zoom par défaut
						minZoom: 10, // Zoom minimum
						mapId: "MY_NEXTJS_MAP_ID",
					};

					// Initialisation de la carte
					const map = new Map(mapRef.current, mapOptions);

					// Créer un objet LatLngBounds pour ajuster les limites de la carte
					const bounds = new google.maps.LatLngBounds();

					// Géocoder chaque adresse et placer un marqueur
					markers.forEach((address) => {
						geocodeAddress(address, map).then((position) => {
							bounds.extend(position);
							map.fitBounds(bounds); // Ajuster les limites de la carte
						});
					});

					// Vérifier et ajuster le zoom après avoir ajusté les limites
					google.maps.event.addListenerOnce(map, "bounds_changed", () => {
						if (map.getZoom() < 15) {
							map.setZoom(15);
						}
					});
				});
			}
		};

		initMap();
	}, [markers]);

	return <div className='h-[800px]' ref={mapRef} />;
}
