import { Loader } from "@googlemaps/js-api-loader";

let loaderInstance = null;

export function getGoogleMapsLoader() {
	const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
	if (!apiKey) return null;

	// IMPORTANT: le Loader ne doit JAMAIS être instancié avec des options différentes.
	// On force un singleton et on inclut 'places' pour couvrir autocomplete + maps.
	if (!loaderInstance) {
		loaderInstance = new Loader({
			apiKey,
			version: "weekly",
			libraries: ["places"],
		});
	}

	return loaderInstance;
}
