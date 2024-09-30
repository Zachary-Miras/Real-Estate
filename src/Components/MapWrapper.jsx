"use client";
import Map from "./Map";

function MapWrapper({ markers }) {
	return (
		<div className='h-[400px] max-h-[400px]'>
			<Map className='h-[400px] max-h-[400px]' markers={markers}></Map>
		</div>
	);
}

export default MapWrapper;
