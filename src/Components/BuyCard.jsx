import Image from "next/image";
import Link from "next/link";
import { FiGrid, FiMapPin, FiMaximize2 } from "react-icons/fi";

function formatPrice(price) {
	return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
		Number(price) || 0,
	);
}

function hashToInt(input) {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 31 + input.charCodeAt(i)) | 0;
	}
	return Math.abs(hash);
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

export default function BuyCard({ property, mode = "buy" }) {
	const address = [
		property?.address?.street,
		property?.address?.city,
		property?.address?.state,
		property?.address?.zipCode,
		property?.address?.country,
	]
		.filter(Boolean)
		.join(", ");

	const imageUrl = property?.photos?.[0];
	const seed = hashToInt(property?.id || property?.title || "x");
	const surface = property?.surfaceM2 ?? null;
	const rooms = property?.rooms ?? null;
	const bedrooms = property?.bedrooms ?? null;
	const bathrooms = property?.bathrooms ?? null;
	const hasParking = property?.hasParking ?? null;

	// Fallback “raisonnable” si DB n'a pas encore les champs (transition douce)
	const fallbackSurface = 45 + (seed % 180); // 45 → 224 m²
	const fallbackRooms = 2 + (seed % 6); // 2 → 7 pièces

	const displayPrice =
		mode === "rent"
			? (property?.rentPriceMonthly ??
				estimateRentPriceMonthly({
					city: property?.address?.city,
					surfaceM2: surface ?? fallbackSurface,
					propertyType: property?.propertyType,
				}))
			: property?.price;

	return (
		<Link
			href={
				mode === "rent"
					? `/bien/${property.id}?mode=rent`
					: `/bien/${property.id}`
			}
			className='card overflow-hidden hover:-translate-y-0.5 transition-transform duration-200'>
			<div className='h-[180px] w-full overflow-hidden relative'>
				{mode === "rent" ? (
					<div className='absolute left-3 top-3 z-10'>
						<span className='btn-gold h-8 px-4 inline-flex items-center justify-center text-xs font-bold tracking-wide'>
							À louer
						</span>
					</div>
				) : null}
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={property.title}
						fill
						sizes='(max-width: 768px) 100vw, 520px'
						className='object-cover'
					/>
				) : (
					<div className='h-full w-full bg-black/10' />
				)}
			</div>

			<div className='p-5'>
				<div className='text-2xl font-bold text-black'>
					{formatPrice(displayPrice)}
					<span className='text-base font-semibold text-black/60'>
						{" "}
						€{mode === "rent" ? " /mois" : ""}
					</span>
				</div>

				<div className='mt-2 flex items-start gap-2 text-black/55 text-sm'>
					<FiMapPin className='mt-0.5 text-[color:var(--accent-gold-2)]' />
					<span className='line-clamp-2'>{address}</span>
				</div>

				<div className='mt-4 flex items-center gap-3 text-sm text-black/70'>
					<div className='flex items-center gap-2 rounded-full border border-black/10 px-3 h-9'>
						<FiMaximize2 className='text-[color:var(--accent-gold-2)]' />
						<span className='font-semibold'>
							{surface ?? fallbackSurface} m²
						</span>
					</div>
					<div className='flex items-center gap-2 rounded-full border border-black/10 px-3 h-9'>
						<FiGrid className='text-[color:var(--accent-gold-2)]' />
						<span className='font-semibold'>
							{rooms ?? fallbackRooms} pièces
						</span>
					</div>
					{bedrooms != null && (
						<div className='flex items-center gap-2 rounded-full border border-black/10 px-3 h-9'>
							<span className='font-semibold'>{bedrooms} ch.</span>
						</div>
					)}
					{bathrooms != null && (
						<div className='flex items-center gap-2 rounded-full border border-black/10 px-3 h-9'>
							<span className='font-semibold'>{bathrooms} sdb</span>
						</div>
					)}
					{hasParking === true && (
						<div className='flex items-center gap-2 rounded-full border border-black/10 px-3 h-9'>
							<span className='font-semibold'>Parking</span>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
