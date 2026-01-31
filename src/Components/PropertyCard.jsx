import Image from "next/image";
import Link from "next/link";

function formatPrice(price) {
	return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
		Number(price) || 0,
	);
}

export default function PropertyCard({ property, variant = "stack" }) {
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

	const base =
		"card block w-full max-w-full min-w-0 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5";
	const sizes =
		variant === "grid"
			? "h-[320px] sm:h-[340px]"
			: "h-[190px] sm:h-[210px] md:h-[230px]";

	return (
		<Link href={`/bien/${property.id}`} className={`${base} ${sizes}`}>
			<div className='grid grid-cols-12 h-full'>
				<div className='relative col-span-5 md:col-span-5 h-full'>
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={property.title}
							fill
							sizes='(max-width: 768px) 45vw, 300px'
							className='object-cover'
						/>
					) : (
						<div className='h-full w-full bg-black/10' />
					)}
				</div>
				<div className='col-span-7 md:col-span-7 min-w-0 p-4 sm:p-5 flex flex-col justify-between'>
					<div>
						<div className='text-sm font-semibold text-black/80 line-clamp-2 break-words'>
							{property.title}
						</div>
						<div className='mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-black'>
							{formatPrice(property.price)}
							<span className='text-base font-semibold text-black/60'> €</span>
						</div>
					</div>
					<div className='text-xs text-black/55 leading-relaxed line-clamp-2 break-words'>
						{address}
					</div>
				</div>
			</div>
		</Link>
	);
}
