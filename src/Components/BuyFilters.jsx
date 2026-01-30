"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function BuyFilters({
	initialCity = "Paris",
	initialType = "ALL",
	initialMaxBudget = 1500000,
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [city, setCity] = useState(initialCity);
	const [type, setType] = useState(initialType);
	const [maxBudget, setMaxBudget] = useState(initialMaxBudget);

	const budgetLabel = useMemo(() => {
		return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
			Number(maxBudget) || 0,
		);
	}, [maxBudget]);

	function applyFilters() {
		const params = new URLSearchParams(searchParams?.toString());

		const nextCity = String(city || "").trim();
		if (nextCity) params.set("city", nextCity);
		else params.delete("city");

		if (type && type !== "ALL") params.set("type", type);
		else params.delete("type");

		const budgetNumber = Number(maxBudget);
		if (Number.isFinite(budgetNumber) && budgetNumber > 0) {
			params.set("maxBudget", String(Math.floor(budgetNumber)));
		} else {
			params.delete("maxBudget");
		}

		const query = params.toString();
		router.push(query ? `${pathname}?${query}` : pathname);
	}

	function onKeyDown(e) {
		if (e.key === "Enter") {
			e.preventDefault();
			applyFilters();
		}
	}

	return (
		<div
			className='glass rounded-3xl px-4 md:px-6 py-4 flex flex-wrap items-center gap-3'
			onKeyDown={onKeyDown}>
			<div className='text-xs uppercase tracking-[0.22em] text-white/55 mr-1'>
				Filtres
			</div>

			<div className='flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 h-10'>
				<span className='text-xs text-white/60'>Ville</span>
				<input
					className='bg-transparent outline-none text-sm w-[140px] placeholder:text-white/45'
					value={city}
					onChange={(e) => setCity(e.target.value)}
					placeholder='Paris'
				/>
			</div>

			<div className='flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 h-10'>
				<span className='text-xs text-white/60'>Type</span>
				<select
					className='bg-transparent outline-none text-sm text-white/90'
					value={type}
					onChange={(e) => setType(e.target.value)}>
					<option value='ALL'>Tous</option>
					<option value='HOUSE'>Maison</option>
					<option value='APARTMENT'>Appartement</option>
					<option value='CONDO'>Condo</option>
					<option value='LAND'>Terrain</option>
				</select>
			</div>

			<div className='flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 h-10'>
				<span className='text-xs text-white/60'>Budget</span>
				<input
					className='bg-transparent outline-none text-sm w-[120px] placeholder:text-white/45'
					type='number'
					min={0}
					value={maxBudget}
					onChange={(e) => setMaxBudget(e.target.value)}
				/>
				<span className='text-xs text-white/60'>€</span>
			</div>

			<button
				type='button'
				onClick={applyFilters}
				className='btn-gold h-10 px-6 inline-flex items-center justify-center font-semibold'>
				Rechercher
			</button>

			<div className='ml-auto text-xs text-white/60 hidden md:block'>
				Max: {budgetLabel} €
			</div>
		</div>
	);
}
