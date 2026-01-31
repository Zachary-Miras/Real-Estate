"use client";

import { useMemo, useState } from "react";

function StepPill({ index, label, active, done }) {
	return (
		<div className='flex items-center gap-3 min-w-0'>
			<div
				className={`h-9 w-9 rounded-full flex items-center justify-center font-bold border ${
					done
						? "bg-[color:var(--accent-gold)] text-black border-black/10"
						: active
							? "bg-black text-white border-black"
							: "bg-white text-black/40 border-black/10"
				}`}>
				{index}
			</div>
			<div className='text-sm font-semibold text-black/70 min-w-0 break-words'>
				{label}
			</div>
		</div>
	);
}

export default function EstimationForm() {
	const [step, setStep] = useState(1);
	const [status, setStatus] = useState("idle"); // idle | success

	const [form, setForm] = useState({
		type: "APARTMENT",
		city: "",
		address: "",
		surfaceM2: "",
		rooms: "",
		condition: "Bon état",
		floor: "",
		hasElevator: false,
		hasOutdoor: false,
		hasParking: false,
		name: "",
		email: "",
		phone: "",
	});

	const isLast = step === 3;
	const steps = useMemo(
		() => [
			{ index: 1, label: "Bien" },
			{ index: 2, label: "Détails" },
			{ index: 3, label: "Coordonnées" },
		],
		[],
	);

	const inputBase =
		"w-full h-11 rounded-xl bg-white text-black px-4 outline-none border border-black/10 focus:border-[color:var(--accent-gold)] focus:ring-4 focus:ring-[color:var(--accent-gold)]/20";

	function update(patch) {
		setForm((prev) => ({ ...prev, ...patch }));
	}

	function next() {
		setStep((s) => Math.min(3, s + 1));
	}

	function back() {
		setStep((s) => Math.max(1, s - 1));
	}

	function onSubmit(e) {
		e.preventDefault();
		setStatus("success");
		if (process.env.NODE_ENV !== "production") {
			console.log("Estimation request", form);
		}
	}

	if (status === "success") {
		return (
			<div className='card p-7 md:p-9 text-black'>
				<div className='text-2xl font-bold'>Demande envoyée</div>
				<div className='mt-2 text-black/65 leading-relaxed'>
					Merci. On revient vers toi sous 24h avec une estimation et une
					stratégie de mise en vente.
				</div>
				<div className='mt-6 flex flex-col sm:flex-row gap-3'>
					<button
						type='button'
						className='btn-gold h-11 px-7 font-semibold'
						onClick={() => {
							setStatus("idle");
							setStep(1);
						}}>
						Faire une autre estimation
					</button>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} className='card p-7 md:p-9 text-black'>
			<div className='flex items-start justify-between gap-6'>
				<div>
					<div className='text-2xl font-bold'>Estimation premium</div>
					<div className='mt-1 text-sm text-black/60'>
						Un formulaire court, une réponse rapide.
					</div>
				</div>
				<div className='text-xs text-black/45'>Réponse sous 24h</div>
			</div>

			<div className='mt-6 flex flex-wrap gap-6'>
				{steps.map((s) => (
					<StepPill
						key={s.index}
						index={s.index}
						label={s.label}
						active={step === s.index}
						done={step > s.index}
					/>
				))}
			</div>

			<div className='mt-7'>
				{step === 1 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Type de bien
							</label>
							<select
								className={inputBase}
								value={form.type}
								onChange={(e) => update({ type: e.target.value })}>
								<option value='APARTMENT'>Appartement</option>
								<option value='HOUSE'>Maison</option>
								<option value='CONDO'>Condo</option>
								<option value='LAND'>Terrain</option>
							</select>
						</div>
						<div>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Ville
							</label>
							<input
								className={inputBase}
								value={form.city}
								onChange={(e) => update({ city: e.target.value })}
								placeholder='Marseille'
								required
							/>
						</div>
						<div className='md:col-span-2'>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Adresse (optionnel)
							</label>
							<input
								className={inputBase}
								value={form.address}
								onChange={(e) => update({ address: e.target.value })}
								placeholder='Rue / quartier'
							/>
						</div>
						<div>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Surface (m²)
							</label>
							<input
								type='number'
								min={0}
								className={inputBase}
								value={form.surfaceM2}
								onChange={(e) => update({ surfaceM2: e.target.value })}
								placeholder='68'
								required
							/>
						</div>
						<div>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Pièces
							</label>
							<input
								type='number'
								min={0}
								className={inputBase}
								value={form.rooms}
								onChange={(e) => update({ rooms: e.target.value })}
								placeholder='3'
								required
							/>
						</div>
					</div>
				) : step === 2 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								État
							</label>
							<select
								className={inputBase}
								value={form.condition}
								onChange={(e) => update({ condition: e.target.value })}>
								<option>Bon état</option>
								<option>À rafraîchir</option>
								<option>À rénover</option>
								<option>Neuf</option>
							</select>
						</div>
						<div>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Étage (optionnel)
							</label>
							<input
								type='number'
								className={inputBase}
								value={form.floor}
								onChange={(e) => update({ floor: e.target.value })}
								placeholder='4'
							/>
						</div>
						<div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3'>
							<label className='flex items-center gap-2 text-sm text-black/70'>
								<input
									type='checkbox'
									checked={form.hasElevator}
									onChange={(e) => update({ hasElevator: e.target.checked })}
								/>
								Ascenseur
							</label>
							<label className='flex items-center gap-2 text-sm text-black/70'>
								<input
									type='checkbox'
									checked={form.hasOutdoor}
									onChange={(e) => update({ hasOutdoor: e.target.checked })}
								/>
								Extérieur (balcon/terrasse)
							</label>
							<label className='flex items-center gap-2 text-sm text-black/70'>
								<input
									type='checkbox'
									checked={form.hasParking}
									onChange={(e) => update({ hasParking: e.target.checked })}
								/>
								Parking
							</label>
						</div>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Nom
							</label>
							<input
								className={inputBase}
								value={form.name}
								onChange={(e) => update({ name: e.target.value })}
								placeholder='Jean Dupont'
								required
							/>
						</div>
						<div>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Email
							</label>
							<input
								type='email'
								className={inputBase}
								value={form.email}
								onChange={(e) => update({ email: e.target.value })}
								placeholder='jean@gmail.com'
								required
							/>
						</div>
						<div className='md:col-span-2'>
							<label className='block text-sm font-semibold text-black/70 mb-1'>
								Téléphone (optionnel)
							</label>
							<input
								type='tel'
								className={inputBase}
								value={form.phone}
								onChange={(e) => update({ phone: e.target.value })}
								placeholder='+33 6 00 00 00 00'
							/>
						</div>
						<div className='md:col-span-2 rounded-2xl bg-black/5 border border-black/10 p-4 text-sm text-black/70'>
							<div className='font-semibold text-black mb-1'>Récap</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1'>
								<div>
									<span className='text-black/50'>Type :</span> {form.type}
								</div>
								<div>
									<span className='text-black/50'>Ville :</span>{" "}
									{form.city || "—"}
								</div>
								<div className='md:col-span-2'>
									<span className='text-black/50'>Adresse :</span>{" "}
									{form.address || "—"}
								</div>
								<div>
									<span className='text-black/50'>Surface :</span>{" "}
									{form.surfaceM2} m²
								</div>
								<div>
									<span className='text-black/50'>Pièces :</span> {form.rooms}
								</div>
								<div>
									<span className='text-black/50'>État :</span> {form.condition}
								</div>
								<div>
									<span className='text-black/50'>Étage :</span>{" "}
									{form.floor || "—"}
								</div>
								<div className='md:col-span-2'>
									<span className='text-black/50'>Options :</span>{" "}
									{[
										form.hasElevator ? "Ascenseur" : null,
										form.hasOutdoor ? "Extérieur" : null,
										form.hasParking ? "Parking" : null,
									]
										.filter(Boolean)
										.join(" • ") || "—"}
								</div>
								<div>
									<span className='text-black/50'>Nom :</span>{" "}
									{form.name || "—"}
								</div>
								<div>
									<span className='text-black/50'>Email :</span>{" "}
									{form.email || "—"}
								</div>
								<div className='md:col-span-2'>
									<span className='text-black/50'>Téléphone :</span>{" "}
									{form.phone || "—"}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className='mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
				<button
					type='button'
					onClick={back}
					disabled={step === 1}
					className='h-11 px-6 rounded-full border border-black/10 bg-white hover:bg-black/5 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
					Retour
				</button>

				{isLast ? (
					<button
						type='submit'
						className='btn-gold h-12 px-8 font-semibold w-full sm:w-auto'>
						Demander mon estimation
					</button>
				) : (
					<button
						type='button'
						onClick={next}
						className='btn-gold h-12 px-8 font-semibold w-full sm:w-auto'>
						Continuer
					</button>
				)}
			</div>
		</form>
	);
}
