"use client";
import Map from "./Map";

function MapWrapper({ markers, className = "" }) {
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
