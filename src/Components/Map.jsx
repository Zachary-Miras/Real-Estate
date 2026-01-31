import { getGoogleMapsLoader } from "@/services/googleMapsLoader";
import { useEffect, useRef } from "react";

export default function Map({ markers, className = "" }) {
	const mapRef = useRef(null);
	const DEFAULT_ZOOM = 12;

	useEffect(() => {
		let cancelled = false;
		const initMap = async () => {
			const loader = getGoogleMapsLoader();

			const { Map } = await loader.importLibrary("maps");
			const { Geocoder } = await loader.importLibrary("geocoding");
			const { AdvancedMarkerElement } = await loader.importLibrary("marker");

			const geocoder = new Geocoder();

			const geocodeAddress = (address) => {
				return new Promise((resolve, reject) => {
					geocoder.geocode({ address }, (results, status) => {
						if (status === "OK") {
							resolve(results[0].geometry.location);
						} else {
							console.error(
								"Geocode was not successful for the following reason: " +
									status,
							);
							reject(status);
						}
					});
				});
			};

			const createPin = () => {
				const pin = document.createElement("div");
				pin.style.width = "14px";
				pin.style.height = "14px";
				pin.style.borderRadius = "9999px";
				pin.style.background = "linear-gradient(135deg, #d7b76a, #b8923e)";
				pin.style.boxShadow = "0 10px 24px rgba(215, 183, 106, 0.28)";
				pin.style.border = "1px solid rgba(255,255,255,0.65)";
				return pin;
			};

			if (!mapRef.current) return;
			const addresses = (markers || []).filter(Boolean);
			if (!addresses.length) return;

			const results = await Promise.allSettled(
				addresses.map((address) => geocodeAddress(address)),
			);
			if (cancelled) return;

			const positions = results
				.filter((r) => r.status === "fulfilled")
				.map((r) => r.value);
			if (!positions.length) return;

			const map = new Map(mapRef.current, {
				center: positions[0],
				zoom: DEFAULT_ZOOM,
				minZoom: 10,
				mapId: "MY_NEXTJS_MAP_ID",
			});

			const bounds = new google.maps.LatLngBounds();
			for (const position of positions) {
				bounds.extend(position);
				new AdvancedMarkerElement({
					map,
					position,
					content: createPin(),
				});
			}

			if (positions.length > 1) {
				map.fitBounds(bounds);
			}

			// Attendre que la carte finisse d'animer le fitBounds avant de plafonner le zoom
			google.maps.event.addListenerOnce(map, "idle", () => {
				if (map.getZoom() > DEFAULT_ZOOM) map.setZoom(DEFAULT_ZOOM);
			});
		};

		initMap();
		return () => {
			cancelled = true;
		};
	}, [markers]);

	return <div ref={mapRef} className={`h-full w-full ${className}`.trim()} />;
}
