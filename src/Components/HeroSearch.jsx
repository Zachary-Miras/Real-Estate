"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";

export default function HeroSearch() {
	const router = useRouter();
	const [mode, setMode] = useState("buy");
	const [location, setLocation] = useState({
		address: "",
		city: "Paris",
		country: "France",
	});
	const [budget, setBudget] = useState(1000000);
	const [type, setType] = useState("APARTMENT");

	const budgetLabel = useMemo(() => {
		try {
			return new Intl.NumberFormat("fr-FR", {
				maximumFractionDigits: 0,
			}).format(Number(budget) || 0);
		} catch {
			return String(budget);
		}
	}, [budget]);

	function goSearch() {
		const basePath = mode === "rent" ? "/louer" : "/acheter";
		const params = new URLSearchParams();
		const city = String(location?.city || "").trim();
		if (city) params.set("city", city);

		if (type && type !== "ALL") params.set("type", type);

		const budgetNumber = Number(budget);
		if (Number.isFinite(budgetNumber) && budgetNumber > 0) {
			params.set("maxBudget", String(Math.floor(budgetNumber)));
		}

		const query = params.toString();
		router.push(query ? `${basePath}?${query}` : basePath);
	}

	return (
		<div
			className='card w-full max-w-[640px] px-4 py-3'
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					goSearch();
				}
			}}>
			<div className='flex items-center justify-between mb-3'>
				<div className='inline-flex rounded-full border border-black/10 bg-black/5 p-1'>
					<button
						type='button'
						onClick={() => {
							setMode("buy");
							setBudget(1000000);
						}}
						className={`h-9 px-4 rounded-full text-sm font-semibold transition ${
							mode === "buy"
								? "bg-white shadow-sm border border-black/10 text-black"
								: "text-black/60 hover:text-black"
						}`}>
						Acheter
					</button>
					<button
						type='button'
						onClick={() => {
							setMode("rent");
							setBudget(2500);
						}}
						className={`h-9 px-4 rounded-full text-sm font-semibold transition ${
							mode === "rent"
								? "bg-white shadow-sm border border-black/10 text-black"
								: "text-black/60 hover:text-black"
						}`}>
						Louer
					</button>
				</div>
				<div className='text-xs uppercase tracking-widest text-black/40 hidden sm:block'>
					Recherche
				</div>
			</div>
			<div className='grid grid-cols-12 gap-3 items-start'>
				<div className='col-span-12 md:col-span-4'>
					<div className='text-xs uppercase tracking-widest text-black/50 mb-1'>
						Localisation
					</div>
					<SearchBar
						onAddressChange={(address, city, country) =>
							setLocation({ address, city, country })
						}
					/>
				</div>

				<div className='col-span-6 md:col-span-3'>
					<div className='text-xs uppercase tracking-widest text-black/50 mb-1'>
						Budget
					</div>
					<input
						className='w-full h-10 rounded-xl border border-black/10 px-3 outline-none text-black placeholder:text-black/40'
						type='number'
						min={0}
						value={budget}
						onChange={(e) => setBudget(e.target.value)}
						placeholder={mode === "rent" ? "Ex: 2500" : "Ex: 1000000"}
					/>
					<div className='text-[11px] text-black/50 mt-1'>
						≈ {budgetLabel} €
					</div>
				</div>

				<div className='col-span-6 md:col-span-3'>
					<div className='text-xs uppercase tracking-widest text-black/50 mb-1'>
						Type
					</div>
					<select
						className='w-full h-10 rounded-xl border border-black/10 px-2.5 outline-none bg-white text-black text-sm'
						value={type}
						onChange={(e) => setType(e.target.value)}>
						<option value='HOUSE'>House</option>
						<option value='APARTMENT'>Apartment</option>
						<option value='CONDO'>Condo</option>
						<option value='LAND'>Land</option>
					</select>
				</div>

				<div className='col-span-12 md:col-span-2 flex flex-col md:items-end'>
					<div className='hidden md:block text-xs uppercase tracking-widest text-black/50 mb-1 opacity-0 select-none'>
						Action
					</div>
					<button
						type='button'
						className='btn-gold w-full md:w-full px-4 h-10 font-semibold'
						onClick={goSearch}>
						Go
					</button>
				</div>
			</div>
		</div>
	);
}
