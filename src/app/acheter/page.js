import BuyCard from "@/Components/BuyCard";
import BuyFilters from "@/Components/BuyFilters";
import { Header } from "@/Components/Header";
import prisma from "@/services/prismaClient";

export const dynamic = "force-dynamic";

async function getProperties({ city, type, maxBudget }) {
	const where = { status: "PUBLISHED" };
	if (city) {
		where.address = { is: { city: { contains: city } } };
	}
	if (type && type !== "ALL") {
		where.propertyType = type;
	}
	if (typeof maxBudget === "number" && Number.isFinite(maxBudget)) {
		where.price = { lte: maxBudget };
	}

	try {
		return await prisma.property.findMany({
			where,
			orderBy: { createdAt: "desc" },
			include: { address: true },
		});
	} catch (err) {
		console.error("Acheter DB error:", err);
		return [];
	}
}

export default async function AcheterPage({ searchParams }) {
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
					{/* Filtres discrets (capsules) */}
					<BuyFilters
						initialCity={city || ""}
						initialType={type || "ALL"}
						initialMaxBudget={Number.isFinite(maxBudget) ? maxBudget : 1500000}
					/>

					{/* Grille de cards */}
					<section className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{properties.map((property) => (
							<BuyCard key={property.id} property={property} />
						))}
					</section>
				</div>
			</main>
		</div>
	);
}
