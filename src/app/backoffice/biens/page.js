import BackofficeDeleteButton from "@/Components/backoffice/BackofficeDeleteButton";
import BackofficePropertyStatus from "@/Components/backoffice/BackofficePropertyStatus";
import { authOptions } from "@/services/authOptions";
import prisma from "@/services/prismaClient";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const metadata = {
	title: "Biens | Backoffice",
	description: "Gestion des biens.",
};

const PAGE_SIZE = 12;

const STATUS_OPTIONS = [
	{ value: "ALL", label: "Tous" },
	{ value: "DRAFT", label: "Brouillon" },
	{ value: "PUBLISHED", label: "Publié" },
	{ value: "SOLD", label: "Vendu" },
	{ value: "RENTED", label: "Loué" },
	{ value: "ARCHIVED", label: "Archivé" },
];

const SORT_OPTIONS = [
	{ value: "RECENT", label: "Récents" },
	{ value: "PRICE_DESC", label: "Prix ↓" },
	{ value: "PRICE_ASC", label: "Prix ↑" },
	{ value: "RENT_DESC", label: "Loyer ↓" },
	{ value: "RENT_ASC", label: "Loyer ↑" },
	{ value: "TITLE_ASC", label: "Titre A→Z" },
];

function chipClass(active) {
	return (
		"h-9 px-3 rounded-xl border text-sm inline-flex items-center justify-center transition " +
		(active
			? "border-white/30 bg-white/15 text-white"
			: "border-white/15 bg-white/10 text-white/80 hover:text-white")
	);
}

function firstParam(value) {
	if (Array.isArray(value)) return value[0];
	return value;
}

function buildHref(searchParams, overrides) {
	const params = new URLSearchParams();
	if (searchParams) {
		for (const [key, value] of Object.entries(searchParams)) {
			const v = firstParam(value);
			if (typeof v === "string" && v.length) params.set(key, v);
		}
	}
	for (const [key, value] of Object.entries(overrides || {})) {
		if (value === null || value === undefined || value === "") {
			params.delete(key);
		} else {
			params.set(key, String(value));
		}
	}
	const qs = params.toString();
	return qs ? `/backoffice/biens?${qs}` : "/backoffice/biens";
}

export default async function BackofficeBiensPage({ searchParams }) {
	const session = await getServerSession(authOptions);
	const role = session?.user?.role;
	const canDelete = role === "ADMIN";

	const q = (firstParam(searchParams?.q) || "").trim();
	const city = (firstParam(searchParams?.city) || "").trim();
	const statusRaw = (firstParam(searchParams?.status) || "ALL").trim();
	const status = STATUS_OPTIONS.some((s) => s.value === statusRaw)
		? statusRaw
		: "ALL";
	const sortRaw = (firstParam(searchParams?.sort) || "RECENT").trim();
	const sort = SORT_OPTIONS.some((s) => s.value === sortRaw)
		? sortRaw
		: "RECENT";
	const pageRaw = Number(firstParam(searchParams?.page) || 1);
	const page =
		Number.isFinite(pageRaw) && pageRaw > 0 ? Math.trunc(pageRaw) : 1;

	const where = {};
	if (q) {
		where.OR = [{ title: { contains: q } }, { description: { contains: q } }];
	}
	if (city) {
		where.address = { is: { city: { contains: city } } };
	}
	if (status !== "ALL") {
		where.status = status;
	}

	let orderBy = { createdAt: "desc" };
	if (sort === "PRICE_ASC") orderBy = [{ price: "asc" }, { createdAt: "desc" }];
	else if (sort === "PRICE_DESC")
		orderBy = [{ price: "desc" }, { createdAt: "desc" }];
	else if (sort === "RENT_ASC")
		orderBy = [{ rentPriceMonthly: "asc" }, { createdAt: "desc" }];
	else if (sort === "RENT_DESC")
		orderBy = [{ rentPriceMonthly: "desc" }, { createdAt: "desc" }];
	else if (sort === "TITLE_ASC") orderBy = [{ title: "asc" }];

	const total = await prisma.property.count({ where });
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const skip = (currentPage - 1) * PAGE_SIZE;

	const properties = await prisma.property.findMany({
		where,
		skip,
		take: PAGE_SIZE,
		orderBy,
		include: { address: true },
	});

	return (
		<div className='max-w-6xl mx-auto'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<div className='text-2xl md:text-3xl font-bold text-white'>Biens</div>
					<div className='mt-2 text-white/70'>
						Créer, modifier et gérer tes annonces.
					</div>
				</div>
				<Link
					href='/backoffice/biens/nouveau'
					className='btn-gold px-5 h-10 inline-flex items-center justify-center font-semibold'>
					Nouveau bien
				</Link>
			</div>

			<div className='mt-8 glass rounded-3xl overflow-hidden'>
				<div className='px-5 md:px-7 py-4 border-b border-white/10 flex items-center justify-between'>
					<div className='text-white/80 text-sm'>
						{total} annonce(s) • page {currentPage}/{totalPages}
					</div>
					<div className='flex items-center gap-4'>
						<Link
							href='/backoffice/leads'
							className='text-sm text-white/70 hover:text-white underline underline-offset-4'>
							Leads
						</Link>
						<Link
							href='/backoffice'
							className='text-sm text-white/70 hover:text-white underline underline-offset-4'>
							Retour dashboard
						</Link>
					</div>
				</div>

				<div className='px-5 md:px-7 py-4 border-b border-white/10'>
					<form method='GET' className='grid grid-cols-1 md:grid-cols-12 gap-3'>
						<input type='hidden' name='status' value={status} />
						<input type='hidden' name='sort' value={sort} />
						<div className='md:col-span-6'>
							<input
								name='q'
								defaultValue={q}
								placeholder='Rechercher (titre / description)'
								className='w-full h-10 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							/>
						</div>
						<div className='md:col-span-4'>
							<input
								name='city'
								defaultValue={city}
								placeholder='Ville'
								className='w-full h-10 rounded-xl border border-white/15 bg-white/10 px-4 outline-none text-white placeholder:text-white/40'
							/>
						</div>
						<div className='md:col-span-2'>
							<button
								type='submit'
								className='btn-gold w-full px-4 h-10 inline-flex items-center justify-center font-semibold'>
								Rechercher
							</button>
						</div>

						<div className='md:col-span-12 flex items-center justify-between gap-3'>
							<Link
								href='/backoffice/biens'
								className='text-sm text-white/70 hover:text-white underline underline-offset-4'>
								Réinitialiser
							</Link>
							<div className='text-xs text-white/60'>
								Astuce: publie une annonce pour la rendre visible côté public.
							</div>
						</div>
					</form>

					<div className='mt-4 flex flex-col gap-3'>
						<div className='flex flex-wrap items-center gap-2'>
							<div className='text-xs uppercase tracking-widest text-white/60 mr-2'>
								Statut
							</div>
							{STATUS_OPTIONS.map((s) => {
								const active = status === s.value;
								const nextStatus = s.value === "ALL" ? null : s.value;
								return (
									<Link
										key={s.value}
										href={buildHref(searchParams, {
											status: nextStatus,
											page: 1,
										})}
										className={chipClass(active)}>
										{s.label}
									</Link>
								);
							})}
						</div>

						<div className='flex flex-wrap items-center gap-2'>
							<div className='text-xs uppercase tracking-widest text-white/60 mr-2'>
								Tri
							</div>
							{SORT_OPTIONS.map((s) => {
								const active = sort === s.value;
								return (
									<Link
										key={s.value}
										href={buildHref(searchParams, { sort: s.value, page: 1 })}
										className={chipClass(active)}>
										{s.label}
									</Link>
								);
							})}
						</div>
					</div>
				</div>

				<div className='divide-y divide-white/10'>
					{properties.map((p) => {
						const priceLabel =
							typeof p.rentPriceMonthly === "number"
								? `${new Intl.NumberFormat("fr-FR").format(p.rentPriceMonthly)} € / mois`
								: `${new Intl.NumberFormat("fr-FR").format(p.price)} €`;
						return (
							<div
								key={p.id}
								className='px-5 md:px-7 py-4 flex items-center gap-4'>
								<div className='min-w-0 flex-1'>
									<div className='text-white font-semibold truncate'>
										{p.title}
									</div>
									<div className='text-white/60 text-sm'>
										{p.address?.city || "—"} • {p.propertyType} • {priceLabel}
									</div>
								</div>

								<div className='flex items-center gap-3'>
									<BackofficePropertyStatus
										propertyId={p.id}
										status={p.status}
									/>
									<Link
										href={`/backoffice/biens/${p.id}/modifier`}
										className='text-sm text-white/80 hover:text-white underline underline-offset-4'>
										Modifier
									</Link>
									{canDelete ? (
										<BackofficeDeleteButton propertyId={p.id} />
									) : null}
								</div>
							</div>
						);
					})}
					{properties.length === 0 ? (
						<div className='px-5 md:px-7 py-10 text-white/70'>
							Aucun résultat. Essaie un autre filtre.
						</div>
					) : null}
				</div>

				<div className='px-5 md:px-7 py-4 border-t border-white/10 flex items-center justify-between'>
					<div className='text-sm text-white/70'>
						Affichage {total === 0 ? 0 : skip + 1}-
						{Math.min(skip + properties.length, total)} sur {total}
					</div>
					<div className='flex items-center gap-3'>
						<Link
							href={
								currentPage > 1
									? buildHref(searchParams, { page: currentPage - 1 })
									: buildHref(searchParams, { page: 1 })
							}
							aria-disabled={currentPage <= 1}
							className={
								"h-10 px-4 rounded-xl border border-white/15 bg-white/10 inline-flex items-center justify-center text-sm text-white/80 " +
								(currentPage <= 1
									? "opacity-40 pointer-events-none"
									: "hover:text-white")
							}>
							Précédent
						</Link>
						<Link
							href={
								currentPage < totalPages
									? buildHref(searchParams, { page: currentPage + 1 })
									: buildHref(searchParams, { page: totalPages })
							}
							aria-disabled={currentPage >= totalPages}
							className={
								"h-10 px-4 rounded-xl border border-white/15 bg-white/10 inline-flex items-center justify-center text-sm text-white/80 " +
								(currentPage >= totalPages
									? "opacity-40 pointer-events-none"
									: "hover:text-white")
							}>
							Suivant
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
