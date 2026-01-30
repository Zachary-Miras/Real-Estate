import Carousel from "@/Components/Carousel";
import { Header } from "@/Components/Header";
import MailForm from "@/Components/MailForm";
import MapWrapper from "@/Components/MapWrapper";
import prisma from "@/services/prismaClient";
import Image from "next/image";
import Link from "next/link";
import { FiGrid, FiMapPin, FiMaximize2 } from "react-icons/fi";

function formatPrice(price) {
	return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
		Number(price) || 0,
	);
}

function estimateRentPriceMonthly({ city, surfaceM2, propertyType }) {
	if (propertyType === "LAND") return null;
	const c = String(city || "").toLowerCase();
	let baseRate = 25;
	if (c.includes("paris")) baseRate = 46;
	else if (c.includes("marseille")) baseRate = 23;
	else if (c.includes("lyon")) baseRate = 24;
	else if (c.includes("nice")) baseRate = 28;
	let typeMultiplier = 1.0;
	if (propertyType === "HOUSE") typeMultiplier = 1.12;
	else if (propertyType === "CONDO") typeMultiplier = 1.06;
	let rent = (Number(surfaceM2) || 55) * baseRate * typeMultiplier;
	rent = Math.round(rent / 10) * 10;
	rent = Math.max(650, Math.min(12000, rent));
	return rent;
}

function hashToInt(input) {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 31 + input.charCodeAt(i)) | 0;
	}
	return Math.abs(hash);
}

function formatAddress(address) {
	if (!address) return "";
	return [
		address.street,
		address.city,
		address.state,
		address.zipCode,
		address.country,
	]
		.filter(Boolean)
		.join(", ");
}

async function getProperty(id) {
	return prisma.property.findUnique({
		where: { id },
		include: { address: true },
	});
}

export default async function BienPage({ params, searchParams }) {
	const property = await getProperty(params.id);
	const mode =
		typeof searchParams?.mode === "string" ? searchParams.mode : "buy";

	if (!property || property.status !== "PUBLISHED") {
		const backHref = mode === "rent" ? "/louer" : "/acheter";
		const backLabel = mode === "rent" ? "Louer" : "Acheter";
		return (
			<div className='min-h-screen px-6 md:px-12 py-14'>
				<div className='max-w-5xl mx-auto glass rounded-3xl p-10'>
					<div className='text-2xl font-bold'>Bien introuvable</div>
					<div className='text-white/70 mt-2'>
						Retourner à{" "}
						<Link className='underline' href={backHref}>
							{backLabel}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const addressText = formatAddress(property.address);
	const markers = addressText ? [addressText] : [];
	const seed = hashToInt(property.id);
	const surface = property?.surfaceM2 ?? null;
	const rooms = property?.rooms ?? null;
	const bedrooms = property?.bedrooms ?? null;
	const bathrooms = property?.bathrooms ?? null;
	const hasBalcony = property?.hasBalcony ?? null;
	const hasTerrace = property?.hasTerrace ?? null;
	const hasElevator = property?.hasElevator ?? null;
	const hasParking = property?.hasParking ?? null;

	// Fallback “raisonnable” (le temps que la DB soit mise à jour)
	const fallbackSurface = 45 + (seed % 180);
	const fallbackRooms = 2 + (seed % 6);

	const rentMonthly =
		property?.rentPriceMonthly ??
		estimateRentPriceMonthly({
			city: property?.address?.city,
			surfaceM2: surface ?? fallbackSurface,
			propertyType: property?.propertyType,
		});

	const displayPrice = mode === "rent" ? rentMonthly : property.price;
	const priceSuffix = mode === "rent" ? "€ /mois" : "€";
	const backHref = mode === "rent" ? "/louer" : "/acheter";
	const backLabel = mode === "rent" ? "Retour à Louer" : "Retour à Acheter";

	return (
		<div className='min-h-screen'>
			<Header className='sticky top-0 z-50' />
			<div className='px-6 md:px-12 pt-6 pb-20'>
				<div className='max-w-6xl mx-auto'>
					<div className='mb-5'>
						<Link
							href={backHref}
							className='text-sm text-white/70 hover:text-white underline underline-offset-4'>
							{backLabel}
						</Link>
					</div>
					{/* 1) Image principale large */}
					<div className='glass rounded-[28px] p-3'>
						<div className='rounded-[24px] overflow-hidden'>
							{property.photos?.length ? (
								<Carousel
									slides={property.photos}
									className='aspect-[16/9] md:aspect-[16/8]'
								/>
							) : (
								<div className='h-[420px] bg-white/10' />
							)}
						</div>
					</div>

					{/* 2) Prix + infos clés */}
					<div className='mt-10 grid grid-cols-12 gap-8 items-start'>
						<div className='col-span-12 lg:col-span-7'>
							<div className='glass rounded-3xl p-8'>
								<div className='text-3xl md:text-4xl font-bold'>
									{property.title}
								</div>
								{mode === "rent" ? (
									<div className='mt-4'>
										<span className='btn-gold h-8 px-4 inline-flex items-center justify-center text-xs font-bold tracking-wide'>
											À louer
										</span>
									</div>
								) : null}
								<div className='mt-4 text-4xl font-bold text-white'>
									{formatPrice(displayPrice)}
									<span className='text-xl font-semibold text-white/70'>
										{priceSuffix}
									</span>
								</div>

								<div className='mt-5 flex items-start gap-2 text-white/75'>
									<FiMapPin className='mt-1 text-[color:var(--accent-gold)]' />
									<span>{addressText}</span>
								</div>

								<div className='mt-7 flex flex-wrap gap-3'>
									<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
										<FiMaximize2 className='text-[color:var(--accent-gold)]' />
										<span className='font-semibold'>
											{surface ?? fallbackSurface} m²
										</span>
									</div>
									<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
										<FiGrid className='text-[color:var(--accent-gold)]' />
										<span className='font-semibold'>
											{rooms ?? fallbackRooms} pièces
										</span>
									</div>
									{bedrooms != null && (
										<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
											<span className='text-white/70'>Ch.</span>
											<span className='font-semibold'>{bedrooms}</span>
										</div>
									)}
									{bathrooms != null && (
										<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
											<span className='text-white/70'>Sdb</span>
											<span className='font-semibold'>{bathrooms}</span>
										</div>
									)}
									{hasBalcony === true && (
										<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
											<span className='font-semibold'>Balcon</span>
										</div>
									)}
									{hasTerrace === true && (
										<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
											<span className='font-semibold'>Terrasse</span>
										</div>
									)}
									{hasElevator === true && (
										<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
											<span className='font-semibold'>Ascenseur</span>
										</div>
									)}
									{hasParking === true && (
										<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
											<span className='font-semibold'>Parking</span>
										</div>
									)}
									<div className='glass rounded-full px-4 h-10 inline-flex items-center gap-2'>
										<span className='text-white/70'>Type</span>
										<span className='font-semibold'>
											{property.propertyType}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className='col-span-12 lg:col-span-5'>
							{/* 3) Mini-carte intégrée */}
							<div className='glass rounded-3xl p-4'>
								<div className='text-sm font-semibold text-white/80 mb-3'>
									Localisation
								</div>
								<div className='h-[260px] rounded-[22px] overflow-hidden'>
									<MapWrapper markers={markers} />
								</div>

								{/* 4) Bouton doré Contact */}
								<div className='mt-4'>
									<a
										href='#contact'
										className='btn-gold w-full h-11 inline-flex items-center justify-center font-semibold'>
										Contact
									</a>
								</div>
							</div>
						</div>
					</div>

					{/* 5) Galerie secondaire */}
					{property.photos?.length ? (
						<div className='mt-10'>
							<div className='text-sm font-semibold text-white/80 mb-4'>
								Galerie
							</div>
							<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
								{property.photos.slice(0, 8).map((src, idx) => (
									<div key={src + idx} className='glass rounded-2xl p-2'>
										<div className='relative h-[120px] w-full'>
											<Image
												src={src}
												alt={`${property.title} ${idx + 1}`}
												fill
												sizes='(max-width: 768px) 50vw, 25vw'
												className='rounded-xl object-cover'
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					) : null}

					{/* Contact section anchor */}
					<div
						id='contact'
						className='mt-12 grid grid-cols-12 gap-8 items-start'>
						<div className='col-span-12 lg:col-span-5'>
							<div className='glass rounded-3xl p-8'>
								<div className='text-2xl font-bold'>Planifier une visite</div>
								<div className='mt-3 text-white/70 leading-relaxed'>
									Décris ton projet (visite, financement, délais). Un conseiller
									te recontacte rapidement.
								</div>
								<div className='mt-6 space-y-2 text-sm text-white/75'>
									<div className='flex items-start gap-2'>
										<span className='text-[color:var(--accent-gold)]'>•</span>
										<span>
											Bien :{" "}
											<span className='font-semibold text-white'>
												{property.title}
											</span>
										</span>
									</div>
									<div className='flex items-start gap-2'>
										<span className='text-[color:var(--accent-gold)]'>•</span>
										<span>
											Adresse :{" "}
											<span className='font-semibold text-white'>
												{addressText}
											</span>
										</span>
									</div>
									<div className='flex items-start gap-2'>
										<span className='text-[color:var(--accent-gold)]'>•</span>
										<span>
											Prix :{" "}
											<span className='font-semibold text-white'>
												{formatPrice(displayPrice)} {priceSuffix}
											</span>
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className='col-span-12 lg:col-span-7'>
							<MailForm
								propertyTitle={property.title}
								propertyId={property.id}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
