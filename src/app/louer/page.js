import BuyCard from "@/Components/BuyCard";
import BuyFilters from "@/Components/BuyFilters";
import { Header } from "@/Components/Header";
import prisma from "@/services/prismaClient";

export const metadata = {
	title: "Louer | Real Estate",
	description: "Trouvez votre location premium.",
};

async function getProperties({ city, type, maxBudget }) {
	const where = { status: "PUBLISHED" };
	if (city) {
		where.address = { is: { city: { contains: city } } };
	}
	if (type && type !== "ALL") {
		where.propertyType = type;
	}
	if (typeof maxBudget === "number" && Number.isFinite(maxBudget)) {
		where.rentPriceMonthly = { lte: maxBudget };
	}

	return prisma.property.findMany({
		where,
		orderBy: { createdAt: "desc" },
		include: { address: true },
	});
}

export default async function LouerPage({ searchParams }) {
	const city = typeof searchParams?.city === "string" ? searchParams.city : "";
	const type =
		typeof searchParams?.type === "string" ? searchParams.type : "ALL";
	const maxBudgetRaw =
		typeof searchParams?.maxBudget === "string" ? searchParams.maxBudget : "";
	const maxBudget = maxBudgetRaw ? Number(maxBudgetRaw) : undefined;

	const properties = await getProperties({ city, type, maxBudget });

	return (
		<div className='min-h-screen'>
			<Header />
			<main className='px-6 md:px-12 pt-8 pb-20'>
				<div className='max-w-6xl mx-auto'>
					<BuyFilters
						initialCity={city || "Paris"}
						initialType={type || "ALL"}
						initialMaxBudget={Number.isFinite(maxBudget) ? maxBudget : 2500}
					/>

					<section className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{properties.map((property) => (
							<BuyCard key={property.id} property={property} mode='rent' />
						))}
					</section>
				</div>
			</main>
		</div>
	);
}
