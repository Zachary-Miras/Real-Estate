"use client";
import Map from "./Map";

function MapWrapper({ markers, className = "" }) {
	const mapsEnabled = Boolean(process.env.NEXT_PUBLIC_MAPS_API_KEY);
	if (!mapsEnabled) {
		return (
			<div
				className={`map-clip h-full w-full max-w-full min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-white/5 flex items-center justify-center px-5 text-center ${className}`.trim()}>
				<div className='text-sm text-white/70'>
					Carte indisponible (Google Maps non configuré).
				</div>
			</div>
		);
	}

	return (
		<div
			className={`map-clip h-full w-full max-w-full min-w-0 overflow-hidden rounded-[24px] ${className}`.trim()}>
			<Map
				markers={markers}
				className='map-clip h-full w-full max-w-full min-w-0 overflow-hidden relative rounded-[24px]'
			/>
		</div>
	);
}

export default MapWrapper;
