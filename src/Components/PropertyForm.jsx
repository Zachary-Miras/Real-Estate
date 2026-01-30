"use client";
import { useState } from "react";
import { GrWheelchair } from "react-icons/gr";
import { MdBalcony, MdGrass, MdPool } from "react-icons/md";
import { PiGarageLight } from "react-icons/pi";
import { TbAirConditioning, TbFridge, TbStairsDown } from "react-icons/tb";
import PropertyFormOptions from "./PropertyFormOptions";

const PropertyForm = () => {
	const [propertyType, setPropertyType] = useState("HOUSE");
	const [images, setImages] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);
	const [description, setDescription] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [superficie, setSuperficie] = useState("");
	const [pieces, setPieces] = useState(1);
	const [sallesDeBain, setSallesDeBain] = useState(0);
	const [caracteristiques, setCaracteristiques] = useState({
		cuisineEquipee: false,
		terrasse: false,
		balcon: false,
		jardin: false,
		piscine: false,
		accesFauteuilsRoulants: false,
		garage: false,
		sousSol: false,
	});

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		const newImages = [...images, ...files];
		setImages(newImages);

		files.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreviews((prev) => [...prev, reader.result]);
			};
			reader.readAsDataURL(file);
		});
	};

	const handleDrop = (e) => {
		e.preventDefault();
		const files = Array.from(e.dataTransfer.files);
		const newImages = [...images, ...files];
		setImages(newImages);

		files.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreviews((prev) => [...prev, reader.result]);
			};
			reader.readAsDataURL(file);
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (process.env.NODE_ENV !== "production") {
			console.log({
				propertyType,
				images,
				description,
				phone,
				address,
				firstName,
				lastName,
				email,
				superficie,
				pieces,
				sallesDeBain,
				caracteristiques,
			});
		}
	};

	const handleCaracteristiqueChange = (e) => {
		const { name, checked } = e.target;
		setCaracteristiques((prev) => ({
			...prev,
			[name]: checked,
		}));
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col gap-2 items-center w-full h-full '>
			<div>
				<select
					value={propertyType}
					onChange={(e) => setPropertyType(e.target.value)}
					className='w-[60%]'>
					<option value='HOUSE'>HOUSE</option>
					<option value='APARTMENT'>APARTMENT</option>
					<option value='CONDO'>CONDO</option>
					<option value='LAND'>LAND</option>
				</select>
			</div>
			<div className='w-[60%]'>
				<input
					type='text'
					placeholder='Adresse'
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					className='outline-none border rounded-lg pl-3 w-full text-lg h-10'
				/>
			</div>
			<div className='w-[60%] flex items-center'>
				<input
					type='number'
					placeholder='Superficie'
					value={superficie}
					onChange={(e) => setSuperficie(e.target.value)}
					className='outline-none border rounded-lg pl-3 w-full no-spinner text-lg h-10'
				/>
				<span className='ml-2 text-xl'>m²</span>
			</div>

			<style jsx>{`
				.no-spinner::-webkit-outer-spin-button,
				.no-spinner::-webkit-inner-spin-button {
					-webkit-appearance: none;
					margin: 0;
				}
				.no-spinner {
					-moz-appearance: textfield;
				}
			`}</style>
			<div className='w-[60%] flex items-center'>
				<label className='mr-2'>Nombre de pièces:</label>
				<button
					type='button'
					onClick={() => setPieces((prev) => Math.max(1, prev - 1))}
					className='border rounded-lg px-2'>
					-
				</button>
				<span className='mx-2'>{pieces}</span>
				<button
					type='button'
					onClick={() => setPieces((prev) => prev + 1)}
					className='border rounded-lg px-2'>
					+
				</button>
			</div>
			<div className='w-[60%] flex items-center'>
				<label className='mr-2'>Nombre de salles de bain:</label>
				<button
					type='button'
					onClick={() => setSallesDeBain((prev) => Math.max(0, prev - 1))}
					className='border rounded-lg px-2'>
					-
				</button>
				<span className='mx-2'>{sallesDeBain}</span>
				<button
					type='button'
					onClick={() => setSallesDeBain((prev) => prev + 1)}
					className='border rounded-lg px-2'>
					+
				</button>
			</div>
			<div className='w-[60%] flex flex-wrap'>
				<div className='w-full md:w-1/2 lg:w-1/3 p-2'>
					<PropertyFormOptions name='Cuisine équipée' icon={TbFridge} />
				</div>
				<div className='w-full md:w-1/2 lg:w-1/3 p-2'>
					<PropertyFormOptions name='Climatisation' icon={TbAirConditioning} />
				</div>
				<div className='w-full md:w-1/2 lg:w-1/3 p-2'>
					<PropertyFormOptions name='Balcon' icon={MdBalcony} />
				</div>
				<div className='w-full md:w-1/2 lg:w-1/3 p-2'>
					<PropertyFormOptions name='Jardin' icon={MdGrass} />
				</div>
				<div className='w-full md:w-1/2 lg:w-1/3 p-2'>
					<PropertyFormOptions name='Piscine' icon={MdPool} />
				</div>
				<div className='w-full md:w-1/2 lg:w-1/3 p-2'>
					<PropertyFormOptions
						name='Accessible fauteuils roulants'
						icon={GrWheelchair}
					/>
				</div>
				<div className='w-full md:w-1/2 lg:w-1/3 p-2'>
					<PropertyFormOptions name='Garage' icon={PiGarageLight} />
				</div>
				<div className='w-full md:w-1/2 lg:w-1/3 p-2'>
					<PropertyFormOptions name='Sous-sol' icon={TbStairsDown} />
				</div>
			</div>
			<div className='w-[60%]'>
				<input
					type='text'
					placeholder='Nom'
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					className='outline-none border rounded-lg pl-3 w-full'
				/>
			</div>
			<div className='w-[60%]'>
				<input
					type='text'
					placeholder='Prénom'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					className='outline-none border rounded-lg pl-3 w-full'
				/>
			</div>
			<div className='w-[60%]'>
				<input
					type='email'
					placeholder='Adresse email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='outline-none border rounded-lg pl-3 w-full'
				/>
			</div>
			<div className='w-[60%]'>
				<input
					type='tel'
					placeholder='Numéro de téléphone'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					className='outline-none border rounded-lg pl-3 w-full'
				/>
			</div>
			<button type='submit'>Soumettre</button>
		</form>
	);
};

export default PropertyForm;
