"use client";
import Map from "./Map";

function MapWrapper({ markers }) {
	return (
		<div className='h-full w-full'>
			<Map markers={markers} />
		</div>
	);
}

export default MapWrapper;
