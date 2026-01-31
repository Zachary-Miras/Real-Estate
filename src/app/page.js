import prisma from "@/services/prismaClient";
import Image from "next/image";
import AnimatedCity from "../Components/AnimatedCity";
import { Header } from "../Components/Header";
import HeroSearch from "../Components/HeroSearch";
import MapWrapper from "../Components/MapWrapper";
import PropertyCard from "../Components/PropertyCard";

export const dynamic = "force-dynamic";

async function getHomeData() {
	try {
		const featured = await prisma.property.findMany({
			where: { status: "PUBLISHED" },
			take: 2,
			orderBy: { createdAt: "desc" },
			include: { address: true },
		});

		const recent = await prisma.property.findMany({
			where: { status: "PUBLISHED" },
			take: 4,
			orderBy: { createdAt: "desc" },
			include: { address: true },
		});

		return { featured, recent };
	} catch (err) {
		console.error("Home DB error:", err);
		return { featured: [], recent: [] };
	}
}

async function getRandomCitiesFromDb({ size = 6 } = {}) {
	try {
		// MongoDB: on échantillonne des biens publiés, join l'adresse, puis extrait la ville.
		const pipeline = [
			{ $match: { status: "PUBLISHED" } },
			{ $sample: { size: Math.max(1, Math.min(20, Number(size) || 6)) } },
			{
				$lookup: {
					from: "Address",
					localField: "addressId",
					foreignField: "_id",
					as: "address",
				},
			},
			{ $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
			{ $project: { _id: 0, city: "$address.city" } },
		];

		const rows = await prisma.property.aggregateRaw({ pipeline });
		const unique = [];
		const seen = new Set();
		for (const r of Array.isArray(rows) ? rows : []) {
			const city = String(r?.city || "").trim();
			if (!city) continue;
			if (seen.has(city)) continue;
			seen.add(city);
			unique.push(city);
		}
		return unique;
	} catch {
		return [];
	}
}

export default async function Home() {
	const { featured, recent } = await getHomeData();
	const randomCities = await getRandomCitiesFromDb({ size: 10 });
	const fallbackCities = Array.from(
		new Set(
			[...featured, ...recent].map((p) => p?.address?.city).filter(Boolean),
		),
	);
	const cities = (randomCities.length ? randomCities : fallbackCities).slice(
		0,
		8,
	);

	const markers = featured
		.map((p) => {
			const parts = [
				p.address?.street,
				p.address?.city,
				p.address?.state,
				p.address?.zipCode,
				p.address?.country,
			];
			return parts.filter(Boolean).join(", ");
		})
		.filter(Boolean);

	return (
		<div className='min-h-screen overflow-x-hidden'>
			<Header />

			{/* 1) HERO */}
			<section className='px-4 sm:px-6 md:px-12 pt-3 sm:pt-4 md:pt-8'>
				<div className='max-w-6xl mx-auto grid grid-cols-12 gap-6 sm:gap-10 items-start'>
					<div className='col-span-12 lg:col-span-6'>
						<div className='text-3xl sm:text-[44px] md:text-[56px] font-bold leading-[1.05] sm:leading-[1.02] tracking-tight'>
							Luxury Real Estate
							<br />
							<AnimatedCity cities={cities} />
						</div>
						<div className='mt-4 text-sm md:text-base text-[color:var(--muted-on-dark)] max-w-md'>
							Biens d’exception, sélectionnés avec soin. Trouvez l’adresse
							parfaite.
						</div>
						<div className='mt-6 sm:mt-8'>
							<HeroSearch />
						</div>
					</div>

					<div className='col-span-12 lg:col-span-6'>
						<div className='glass rounded-[28px] p-3'>
							<div className='relative rounded-[24px] overflow-hidden h-[240px] sm:h-[320px] md:h-[420px]'>
								<Image
									src='https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1800&q=80'
									alt='Appartement de luxe'
									fill
									sizes='(max-width: 1024px) 100vw, 520px'
									className='object-cover'
									priority
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 2) Section centrale */}
			<section className='px-4 sm:px-6 md:px-12 mt-12 sm:mt-14 md:mt-20'>
				<div className='max-w-6xl mx-auto grid grid-cols-12 gap-10 items-stretch'>
					<div className='col-span-11 lg:col-span-6 min-w-0 flex flex-col gap-6 max-w-[640px] lg:max-w-none mx-auto w-full'>
						{featured.slice(0, 2).map((p) => (
							<PropertyCard key={p.id} property={p} variant='stack' />
						))}
					</div>

					<div className='col-span-11 lg:col-span-6 min-w-0 w-full max-w-[640px] lg:max-w-none mx-auto'>
						<div className='glass rounded-[28px] p-4 h-full w-full overflow-hidden'>
							<div className='text-sm font-semibold tracking-wide mb-3'>
								Carte
							</div>
							<div className='h-[340px] sm:h-[480px] w-full max-w-full min-w-0 rounded-[24px] overflow-hidden relative'>
								<MapWrapper
									markers={markers}
									className='h-full w-full max-w-full min-w-0'
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 3) Biens récents */}
			<section className='px-4 sm:px-6 md:px-12 mt-12 sm:mt-14 md:mt-20 pb-20'>
				<div className='max-w-6xl mx-auto'>
					<div className='flex items-end justify-between mb-8'>
						<div>
							<div className='text-2xl md:text-3xl font-bold'>
								Biens récents
							</div>
							<div className='text-sm text-[color:var(--muted-on-dark)] mt-1'>
								Une sélection fraîchement ajoutée.
							</div>
						</div>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[640px] lg:max-w-none mx-auto'>
						{recent.slice(0, 4).map((p) => (
							<PropertyCard key={p.id} property={p} variant='grid' />
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
