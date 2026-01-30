import prisma from "@/services/prismaClient";
import Link from "next/link";

export default async function BackofficeHomePage() {
	const [propertyCount, leadCount, lastProperties] = await Promise.all([
		prisma.property.count(),
		prisma.lead.count({ where: { status: "NEW" } }),
		prisma.property.findMany({
			orderBy: { createdAt: "desc" },
			take: 5,
			select: {
				id: true,
				title: true,
				propertyType: true,
				price: true,
				rentPriceMonthly: true,
				createdAt: true,
				address: { select: { city: true } },
			},
		}),
	]);

	return (
		<div className='max-w-6xl mx-auto'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<div className='text-2xl md:text-3xl font-bold text-white'>
						Backoffice
					</div>
					<div className='mt-2 text-white/70'>
						Gère tes annonces et ton catalogue.
					</div>
				</div>
				<Link
					href='/backoffice/biens'
					className='btn-gold px-5 h-10 inline-flex items-center justify-center font-semibold'>
					Gérer les biens
				</Link>
			</div>

			<div className='mt-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
				<div className='glass rounded-3xl p-6'>
					<div className='text-xs uppercase tracking-widest text-white/60'>
						Biens
					</div>
					<div className='mt-2 text-3xl font-bold text-white'>
						{propertyCount}
					</div>
					<div className='mt-4 text-white/70 text-sm'>
						Nombre total d’annonces.
					</div>
				</div>
				<div className='glass rounded-3xl p-6'>
					<div className='flex items-start justify-between gap-4'>
						<div>
							<div className='text-xs uppercase tracking-widest text-white/60'>
								Leads
							</div>
							<div className='mt-2 text-3xl font-bold text-white'>
								{leadCount}
							</div>
							<div className='mt-4 text-white/70 text-sm'>
								Nouveaux à traiter.
							</div>
						</div>
						<Link
							href='/backoffice/leads?status=NEW'
							className='text-sm text-white/80 hover:text-white underline underline-offset-4'>
							Voir
						</Link>
					</div>
				</div>
				<div className='glass rounded-3xl p-6 md:col-span-2'>
					<div className='flex items-center justify-between gap-4'>
						<div>
							<div className='text-xs uppercase tracking-widest text-white/60'>
								Derniers ajouts
							</div>
							<div className='mt-2 text-white/70 text-sm'>
								Les 5 dernières annonces créées.
							</div>
						</div>
						<Link
							href='/backoffice/biens/nouveau'
							className='btn-gold px-5 h-10 inline-flex items-center justify-center font-semibold'>
							Nouveau bien
						</Link>
					</div>

					<div className='mt-5 divide-y divide-white/10'>
						{lastProperties.map((p) => {
							const priceLabel =
								typeof p.rentPriceMonthly === "number"
									? `${new Intl.NumberFormat("fr-FR").format(p.rentPriceMonthly)} € / mois`
									: `${new Intl.NumberFormat("fr-FR").format(p.price)} €`;
							return (
								<div
									key={p.id}
									className='py-3 flex items-center justify-between gap-4'>
									<div className='min-w-0'>
										<div className='text-white font-semibold truncate'>
											{p.title}
										</div>
										<div className='text-white/60 text-sm'>
											{p.address?.city || "—"} • {p.propertyType} • {priceLabel}
										</div>
									</div>
									<Link
										href={`/backoffice/biens/${p.id}/modifier`}
										className='text-sm text-white/80 hover:text-white underline underline-offset-4'>
										Modifier
									</Link>
								</div>
							);
						})}
						{lastProperties.length === 0 ? (
							<div className='py-6 text-white/70'>
								Aucun bien pour le moment.
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
