"use client";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

export default function Map({ address }) {
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

			// Adresse à géocoder

			const geocoder = new Geocoder();

			// Géocodage de l'adresse pour obtenir la position géographique
			geocoder.geocode({ address }, (results, status) => {
				if (status === "OK") {
					// Coordonnées géographiques de l'adresse
					const position = results[0].geometry.location;

					// Options
					const mapOptions = {
						center: position,
						zoom: 17,
						mapId: "MY_NEXTJS_MAP_ID",
					};

					// init
					const map = new Map(mapRef.current, mapOptions);

					// Marker
					const marker = new AdvancedMarkerElement({
						map: map,
						position: position,
					});
				} else {
					console.error(
						"Geocode was not successful for the following reason: " + status
					);
				}
			});
		};

		initMap();
	}, [address]);

	return <div className='h-[800px] ' ref={mapRef} />;
}
