import { useState } from "react";

function PropertyFormOptions({ name, icon: Icon }) {
	const [selected, setSelected] = useState(false);

	const handleClick = () => {
		setSelected(!selected);
		if (process.env.NODE_ENV !== "production") {
			console.log(`${name} is ${!selected ? "selected" : "deselected"}`);
		}
	};

	return (
		<div
			className={`border h-32 flex justify-center items-center cursor-pointer relative overflow-hidden inset-0 transition-all duration-500  ${
				selected ? "bg-gray-200" : "bg-white"
			}`}
			onClick={handleClick}>
			<div style={{ transformOrigin: "center" }}></div>
			<label className='w-full h-full flex justify-center items-center relative z-10'>
				{Icon && <Icon className='mr-2 w-8 h-8' />}
				{name}
			</label>
		</div>
	);
}

export default PropertyFormOptions;
