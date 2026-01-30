"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const PROPERTY_TYPES = [
	{ value: "HOUSE", label: "Maison" },
	{ value: "APARTMENT", label: "Appartement" },
	{ value: "CONDO", label: "Condo" },
	{ value: "LAND", label: "Terrain" },
];

const PROPERTY_STATUSES = [
	{ value: "DRAFT", label: "Brouillon" },
	{ value: "PUBLISHED", label: "Publié" },
	{ value: "SOLD", label: "Vendu" },
	{ value: "RENTED", label: "Loué" },
	{ value: "ARCHIVED", label: "Archivé" },
];

function joinPhotos(photos) {
	return Array.isArray(photos) ? photos.join("\n") : "";
}

export default function BackofficePropertyForm({ mode, initialProperty }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const initial = useMemo(() => {
		const p = initialProperty || {};
		const a = p.address || {};
		return {
			title: p.title || "",
			description: p.description || "",
			propertyType: p.propertyType || "HOUSE",
			status: p.status || "DRAFT",
			price: typeof p.price === "number" ? String(p.price) : "",
			rentPriceMonthly:
				typeof p.rentPriceMonthly === "number"
					? String(p.rentPriceMonthly)
					: "",
			street: a.street || "",
			city: a.city || "",
			state: a.state || "",
			zipCode: a.zipCode || "",
			country: a.country || "France",
			photos: joinPhotos(p.photos),
			surfaceM2: p.surfaceM2 ?? "",
			rooms: p.rooms ?? "",
			bedrooms: p.bedrooms ?? "",
			bathrooms: p.bathrooms ?? "",
			floor: p.floor ?? "",
			totalFloors: p.totalFloors ?? "",
			hasBalcony: Boolean(p.hasBalcony),
			hasTerrace: Boolean(p.hasTerrace),
			hasElevator: Boolean(p.hasElevator),
			hasParking: Boolean(p.hasParking),
		};
	}, [initialProperty]);

	const [form, setForm] = useState(initial);

	function setField(key, value) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const url =
				mode === "edit"
					? `/api/backoffice/properties/${initialProperty.id}`
					: "/api/backoffice/properties";
			const method = mode === "edit" ? "PATCH" : "POST";

			const payload = {
				...form,
				// normalise les champs numériques
				price: form.price,
				rentPriceMonthly: form.rentPriceMonthly,
				surfaceM2: form.surfaceM2,
				rooms: form.rooms,
				bedrooms: form.bedrooms,
				bathrooms: form.bathrooms,
				floor: form.floor,
				totalFloors: form.totalFloors,
			};

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(data?.error || "Erreur lors de l'enregistrement.");
				return;
			}

			router.push("/backoffice/biens");
			router.refresh();
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='glass rounded-3xl p-8 md:p-10'>
			<form onSubmit={onSubmit} className='space-y-5'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Titre
						</div>
						<input
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.title}
							onChange={(e) => setField("title", e.target.value)}
							required
						/>
					</div>

					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Type
						</div>
						<select
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white'
							value={form.propertyType}
							onChange={(e) => setField("propertyType", e.target.value)}>
							{PROPERTY_TYPES.map((t) => (
								<option key={t.value} value={t.value} className='text-black'>
									{t.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<div>
					<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
						Statut
					</div>
					<select
						className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white'
						value={form.status}
						onChange={(e) => setField("status", e.target.value)}>
						{PROPERTY_STATUSES.map((s) => (
							<option key={s.value} value={s.value} className='text-black'>
								{s.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
						Description
					</div>
					<textarea
						className='w-full min-h-[120px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white placeholder:text-white/40'
						value={form.description}
						onChange={(e) => setField("description", e.target.value)}
						required
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Prix vente (€)
						</div>
						<input
							type='number'
							step='0.01'
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.price}
							onChange={(e) => setField("price", e.target.value)}
							required
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Loyer mensuel (€) (optionnel)
						</div>
						<input
							type='number'
							step='0.01'
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.rentPriceMonthly}
							onChange={(e) => setField("rentPriceMonthly", e.target.value)}
							placeholder='ex: 1200'
						/>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Adresse (rue)
						</div>
						<input
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.street}
							onChange={(e) => setField("street", e.target.value)}
							placeholder='ex: 12 rue ...'
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Ville
						</div>
						<input
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.city}
							onChange={(e) => setField("city", e.target.value)}
							required
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Région
						</div>
						<input
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.state}
							onChange={(e) => setField("state", e.target.value)}
							placeholder="ex: Provence-Alpes-Côte d'Azur"
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Code postal
						</div>
						<input
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.zipCode}
							onChange={(e) => setField("zipCode", e.target.value)}
							placeholder='ex: 13001'
						/>
					</div>
					<div className='md:col-span-2'>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Pays
						</div>
						<input
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.country}
							onChange={(e) => setField("country", e.target.value)}
							required
						/>
					</div>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Surface (m²)
						</div>
						<input
							type='number'
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.surfaceM2}
							onChange={(e) => setField("surfaceM2", e.target.value)}
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Pièces
						</div>
						<input
							type='number'
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.rooms}
							onChange={(e) => setField("rooms", e.target.value)}
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Chambres
						</div>
						<input
							type='number'
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.bedrooms}
							onChange={(e) => setField("bedrooms", e.target.value)}
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							SDB
						</div>
						<input
							type='number'
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.bathrooms}
							onChange={(e) => setField("bathrooms", e.target.value)}
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Étage
						</div>
						<input
							type='number'
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.floor}
							onChange={(e) => setField("floor", e.target.value)}
						/>
					</div>
					<div>
						<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
							Étages total
						</div>
						<input
							type='number'
							className='w-full h-11 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							value={form.totalFloors}
							onChange={(e) => setField("totalFloors", e.target.value)}
						/>
					</div>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					<label className='flex items-center gap-2 text-white/80 text-sm'>
						<input
							type='checkbox'
							checked={form.hasBalcony}
							onChange={(e) => setField("hasBalcony", e.target.checked)}
						/>
						Balcon
					</label>
					<label className='flex items-center gap-2 text-white/80 text-sm'>
						<input
							type='checkbox'
							checked={form.hasTerrace}
							onChange={(e) => setField("hasTerrace", e.target.checked)}
						/>
						Terrasse
					</label>
					<label className='flex items-center gap-2 text-white/80 text-sm'>
						<input
							type='checkbox'
							checked={form.hasElevator}
							onChange={(e) => setField("hasElevator", e.target.checked)}
						/>
						Ascenseur
					</label>
					<label className='flex items-center gap-2 text-white/80 text-sm'>
						<input
							type='checkbox'
							checked={form.hasParking}
							onChange={(e) => setField("hasParking", e.target.checked)}
						/>
						Parking
					</label>
				</div>

				<div>
					<div className='text-xs uppercase tracking-widest text-white/60 mb-2'>
						Photos (1 URL par ligne ou séparées par virgule)
					</div>
					<textarea
						className='w-full min-h-[120px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white placeholder:text-white/40'
						value={form.photos}
						onChange={(e) => setField("photos", e.target.value)}
						placeholder='https://...\nhttps://...'
					/>
				</div>

				{error ? (
					<div className='text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3'>
						{error}
					</div>
				) : null}

				<div className='flex items-center justify-between gap-3'>
					<button
						type='button'
						onClick={() => router.push("/backoffice/biens")}
						className='h-11 px-5 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/25 transition-colors'>
						Annuler
					</button>
					<button
						type='submit'
						disabled={loading}
						className='btn-gold h-11 px-6 inline-flex items-center justify-center font-semibold disabled:opacity-70'>
						{loading
							? "Enregistrement…"
							: mode === "edit"
								? "Enregistrer"
								: "Créer"}
					</button>
				</div>
			</form>
		</div>
	);
}
