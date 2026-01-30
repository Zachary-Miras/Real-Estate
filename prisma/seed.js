const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function clampInt(value, { min, max } = {}) {
	if (value == null) return null;
	const n = Number.parseInt(String(value), 10);
	if (Number.isNaN(n)) return null;
	if (typeof min === "number" && n < min) return min;
	if (typeof max === "number" && n > max) return max;
	return n;
}

function deriveListingFields(property) {
	const title = String(property?.title || "");
	const description = String(property?.description || "");
	const text = `${title} ${description}`.toLowerCase();

	// Surface: récupère "38 m²" / "900m²" / "900 m2" etc.
	const surfaceMatch = text.match(/(\d{2,4})\s*(m²|m2)/i);
	const surfaceM2 = clampInt(surfaceMatch?.[1], { min: 10, max: 1500 });

	// Pièces: T2/T3… ou "studio" => 1
	let rooms = null;
	const tMatch = text.match(/\bt\s*(\d)\b/i);
	if (tMatch?.[1]) rooms = clampInt(tMatch[1], { min: 1, max: 10 });
	if (!rooms && text.includes("studio")) rooms = 1;

	// Chambres: "3 chambres" sinon approx rooms-1
	const bedMatch = text.match(/(\d)\s+chambres?/i);
	let bedrooms = clampInt(bedMatch?.[1], { min: 0, max: 10 });
	if (bedrooms == null && rooms != null) bedrooms = Math.max(rooms - 1, 0);

	// SDB: si mention "2 salles" sinon 1 (si logement) / null (si terrain)
	const bathMatch = text.match(/(\d)\s+salles?\s+d['’]?eau/i);
	let bathrooms = clampInt(bathMatch?.[1], { min: 1, max: 6 });

	// Équipements: mots-clés
	const hasBalcony = /\bbalcon\b/.test(text) ? true : null;
	const hasTerrace = /\bterrasse\b|\brooftop\b/.test(text) ? true : null;
	const hasElevator = /\bascenseur\b/.test(text) ? true : null;
	const hasParking = /\bparking\b|\bbox\b|\bgarage\b/.test(text) ? true : null;

	// Étage: "étage 4" / "4e étage" / "étage élevé" (approx)
	let floor = null;
	const floorMatch = text.match(
		/(\d{1,2})\s*(e|eme)?\s*etage|etage\s*(\d{1,2})/i,
	);
	if (floorMatch) {
		floor = clampInt(floorMatch[1] || floorMatch[3], { min: 0, max: 70 });
	} else if (/\betage\s+eleve\b/.test(text) || /\bétage\s+élevé\b/.test(text)) {
		floor = 5;
	}

	// Terrain: pas de "rooms" / "bedrooms" / "bathrooms"
	if (property?.propertyType === "LAND") {
		rooms = null;
		bedrooms = null;
		bathrooms = null;
		floor = null;
	}

	// Valeur par défaut SDB si logement et non précisé
	if (property?.propertyType !== "LAND" && bathrooms == null) bathrooms = 1;

	return {
		surfaceM2,
		rooms,
		bedrooms,
		bathrooms,
		floor,
		// totalFloors reste null (pas fiable sans data)
		totalFloors: null,
		hasBalcony,
		hasTerrace,
		hasElevator,
		hasParking,
	};
}

function hashToInt(input) {
	const s = String(input || "");
	let hash = 0;
	for (let i = 0; i < s.length; i++) {
		hash = (hash * 31 + s.charCodeAt(i)) | 0;
	}
	return Math.abs(hash);
}

function computeRentPriceMonthly({ property, derived }) {
	if (!property || property.propertyType === "LAND") return null;

	const city = String(property?.address?.city || "").toLowerCase();
	const surfaceFromDerived = derived?.surfaceM2 ?? null;
	const seed = hashToInt(property?.title || "x");
	const surfaceM2 =
		surfaceFromDerived != null ? surfaceFromDerived : 28 + (seed % 92); // 28 → 119

	// €/m²/mois (ordre de grandeur)
	let baseRate = 25;
	if (city.includes("paris")) baseRate = 46;
	else if (city.includes("marseille")) baseRate = 23;
	else if (city.includes("lyon")) baseRate = 24;
	else if (city.includes("nice")) baseRate = 28;
	else if (city.includes("bordeaux")) baseRate = 26;
	else if (city.includes("toulouse")) baseRate = 24;
	else if (city.includes("lille")) baseRate = 23;

	let typeMultiplier = 1.0;
	if (property.propertyType === "HOUSE") typeMultiplier = 1.12;
	else if (property.propertyType === "CONDO") typeMultiplier = 1.06;

	let rent = surfaceM2 * baseRate * typeMultiplier;
	// Arrondis “jolis”
	rent = Math.round(rent / 10) * 10;
	// Garde-fous
	rent = Math.max(650, Math.min(12000, rent));

	return rent;
}

const sampleProperties = [
	// --- Marseille (15+ biens) ---
	// Note: descriptions inspirées du marché, sans recopier d’annonces réelles.
	{
		title: "T2 rénové – Le Panier (13002)",
		description:
			"T2 d’environ 38 m², rénové, au cœur du Panier. Séjour avec cuisine ouverte, chambre au calme, prestations modernes. Idéal pied-à-terre ou investissement locatif.",
		price: 239000.0,
		propertyType: "APARTMENT",
		address: {
			street: "6 Rue du Panier",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13002",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1566838217578-1903568a76d9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "T3 lumineux – Vauban, balcon (13006)",
		description:
			"T3 d’environ 67 m², double exposition, balcon filant. Copropriété bien tenue, séjour spacieux, 2 chambres, rangements. À 10 min du Vieux-Port, commerces et écoles à proximité.",
		price: 369000.0,
		propertyType: "APARTMENT",
		address: {
			street: "18 Rue de Vauban",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13006",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1576244348464-c7d393b6dfc0?q=80&w=1786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1459535653751-d571815e906b?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Loft esprit industriel – Vieux-Port (13002)",
		description:
			"Loft d’environ 92 m², hauteur sous plafond, verrière et grandes ouvertures. Cuisine premium, espace bureau, 2 chambres, prestations contemporaines. Idéal pour un style de vie urbain.",
		price: 649000.0,
		propertyType: "APARTMENT",
		address: {
			street: "2 Quai du Port",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13002",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1764080462847-91da98a3c411?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Studio premium – La Joliette (13002)",
		description:
			"Studio d’environ 26 m², optimisé et lumineux, immeuble récent, à deux pas des transports et des bureaux. Cuisine équipée, belle salle d’eau, faibles charges. Parfait investissement.",
		price: 189000.0,
		propertyType: "CONDO",
		address: {
			street: "24 Boulevard Euroméditerranée",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13002",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1739353452704-af0282c55882?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "T4 familial – Cinq-Avenues (13004)",
		description:
			"T4 d’environ 86 m², séjour traversant, 3 chambres, cuisine indépendante, nombreux rangements. Proche métro/tram, écoles et parc. Idéal famille.",
		price: 415000.0,
		propertyType: "APARTMENT",
		address: {
			street: "31 Avenue du Prado",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13004",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1566838217578-1903568a76d9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1560448071-2d1bfb1c0c7f?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "T2 – Castellane, ascenseur (13006)",
		description:
			"T2 d’environ 45 m², étage élevé avec ascenseur, séjour cosy, cuisine équipée, chambre avec dressing. Très bien situé (Castellane), accès rapide métro et axes.",
		price: 295000.0,
		propertyType: "APARTMENT",
		address: {
			street: "9 Place Castellane",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13006",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1576244348464-c7d393b6dfc0?q=80&w=1786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Duplex terrasse – Prado (13008)",
		description:
			"Duplex d’environ 110 m², terrasse plein ciel, séjour double, 3 chambres, 2 salles d’eau. Résidence sécurisée, box possible. À proximité immédiate des plages et du Prado.",
		price: 890000.0,
		propertyType: "CONDO",
		address: {
			street: "155 Avenue du Prado",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13008",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1566838217578-1903568a76d9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Appartement vue mer – Endoume (13007)",
		description:
			"T3 d’environ 74 m² avec vue mer dégagée, séjour ouvert sur balcon, 2 chambres, cuisine semi-ouverte. Petite copro, environnement recherché, accès Corniche.",
		price: 695000.0,
		propertyType: "CONDO",
		address: {
			street: "44 Rue d'Endoume",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13007",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1739353452704-af0282c55882?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "T3 terrasse – Pointe Rouge (13008)",
		description:
			"T3 d’environ 62 m² avec terrasse, séjour/cuisine ouvert, 2 chambres, parking. Résidence récente, à quelques minutes des plages et des écoles.",
		price: 459000.0,
		propertyType: "APARTMENT",
		address: {
			street: "11 Avenue de la Pointe Rouge",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13008",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1764080462847-91da98a3c411?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1560448071-2d1bfb1c0c7f?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Maison de ville – Saint-Barnabé (13012)",
		description:
			"Maison de ville d’environ 128 m², 4 chambres, patio/jardin intimiste, stationnement. Quartier recherché (Saint-Barnabé), proche commerces et métro.",
		price: 795000.0,
		propertyType: "HOUSE",
		address: {
			street: "8 Rue Montaigne",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13012",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1576244348464-c7d393b6dfc0?q=80&w=1786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Villa contemporaine – Roucas-Blanc (13007)",
		description:
			"Villa contemporaine d’environ 210 m², volumes ouverts, piscine, terrasses et vue mer partielle. 4 chambres, suite parentale, garage. Prestations haut de gamme.",
		price: 1850000.0,
		propertyType: "HOUSE",
		address: {
			street: "27 Chemin du Roucas Blanc",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13007",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1739353452704-af0282c55882?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Maison avec jardin – Les Olives (13013)",
		description:
			"Maison d’environ 145 m² sur parcelle arborée, 3 chambres + bureau, garage, jardin plat. Secteur calme, accès rapide L2/A7.",
		price: 575000.0,
		propertyType: "HOUSE",
		address: {
			street: "15 Traverse des Olives",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13013",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1576244348464-c7d393b6dfc0?q=80&w=1786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Terrain constructible – Les Accates (13011)",
		description:
			"Terrain d’environ 780 m², exposition Sud, environnement résidentiel. Viabilités en bordure, projet villa/piscine envisageable (sous réserve d’autorisations).",
		price: 329000.0,
		propertyType: "LAND",
		address: {
			street: "Chemin des Accates",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13011",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1576244348464-c7d393b6dfc0?q=80&w=1786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Maison vue mer – L'Estaque (13016)",
		description:
			"Maison d’environ 120 m², terrasse avec vue mer, 3 chambres, séjour traversant. Proche du port de l’Estaque, ambiance village. Stationnement.",
		price: 699000.0,
		propertyType: "HOUSE",
		address: {
			street: "5 Chemin de l'Estaque",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13016",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1566838217578-1903568a76d9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Penthouse – Montredon, rooftop (13008)",
		description:
			"Penthouse d’environ 132 m², rooftop privatif, vue dégagée, prestations haut de gamme. 3 chambres, suite parentale, séjour ouvert. Résidence sécurisée.",
		price: 1190000.0,
		propertyType: "CONDO",
		address: {
			street: "3 Boulevard de Montredon",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13008",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1739353452704-af0282c55882?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "T3 – Saint-Charles, rénové (13001)",
		description:
			"T3 d’environ 58 m² refait à neuf, climatisation, cuisine équipée, 2 chambres. Proche gare Saint-Charles, idéal primo-accédant ou colocation.",
		price: 279000.0,
		propertyType: "APARTMENT",
		address: {
			street: "10 Boulevard d'Athènes",
			city: "Marseille",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13001",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1576244348464-c7d393b6dfc0?q=80&w=1786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Villa contemporaine avec piscine",
		description:
			"Grande villa lumineuse avec piscine et jardin paysager, proche des commodités.",
		price: 1250000.0,
		propertyType: "HOUSE",
		address: {
			street: "12 Avenue des Pins",
			city: "Nice",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "06000",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Appartement haussmannien rénové",
		description:
			"Appartement 4 pièces avec parquet, moulures et belle hauteur sous plafond, entièrement rénové.",
		price: 980000.0,
		propertyType: "APARTMENT",
		address: {
			street: "48 Rue de Rivoli",
			city: "Paris",
			state: "Île-de-France",
			zipCode: "75004",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Condo moderne vue mer",
		description:
			"Condo moderne avec grande terrasse et vue mer panoramique, résidence sécurisée.",
		price: 720000.0,
		propertyType: "CONDO",
		address: {
			street: "3 Promenade des Anglais",
			city: "Nice",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "06000",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Maison familiale proche centre",
		description:
			"Maison idéale pour une famille, 5 chambres, garage et jardin, à 10 minutes du centre.",
		price: 540000.0,
		propertyType: "HOUSE",
		address: {
			street: "9 Rue des Écoles",
			city: "Lyon",
			state: "Auvergne-Rhône-Alpes",
			zipCode: "69007",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Studio cosy près des transports",
		description:
			"Studio optimisé, lumineux, à deux pas du métro et des commerces.",
		price: 215000.0,
		propertyType: "APARTMENT",
		address: {
			street: "21 Boulevard Voltaire",
			city: "Paris",
			state: "Île-de-France",
			zipCode: "75011",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1459535653751-d571815e906b?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Terrain constructible 900m²",
		description:
			"Terrain plat viabilisé, libre de constructeur, environnement calme.",
		price: 180000.0,
		propertyType: "LAND",
		address: {
			street: "Chemin des Lavandes",
			city: "Aix-en-Provence",
			state: "Provence-Alpes-Côte d'Azur",
			zipCode: "13100",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Loft industriel centre-ville",
		description:
			"Loft style industriel avec grandes baies vitrées, volumes généreux et prestations haut de gamme.",
		price: 650000.0,
		propertyType: "APARTMENT",
		address: {
			street: "5 Quai de la Pêcherie",
			city: "Lyon",
			state: "Auvergne-Rhône-Alpes",
			zipCode: "69001",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Maison de campagne avec dépendances",
		description:
			"Charmante maison de campagne avec dépendances, grand terrain arboré et vue dégagée.",
		price: 395000.0,
		propertyType: "HOUSE",
		address: {
			street: "Route des Vignes",
			city: "Bordeaux",
			state: "Nouvelle-Aquitaine",
			zipCode: "33000",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Condo avec rooftop privatif",
		description:
			"Condo avec rooftop privatif, cuisine ouverte et double exposition.",
		price: 845000.0,
		propertyType: "CONDO",
		address: {
			street: "10 Rue Sainte-Catherine",
			city: "Bordeaux",
			state: "Nouvelle-Aquitaine",
			zipCode: "33000",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80",
		],
	},
	{
		title: "Appartement neuf avec balcon",
		description:
			"Appartement neuf, balcon, parking, résidence récente proche écoles et commerces.",
		price: 310000.0,
		propertyType: "APARTMENT",
		address: {
			street: "7 Allée des Tilleuls",
			city: "Nantes",
			state: "Pays de la Loire",
			zipCode: "44000",
			country: "France",
		},
		photos: [
			"https://images.unsplash.com/photo-1560448071-2d1bfb1c0c7f?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1920&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1920&q=80",
		],
	},
];

async function main() {
	const reset =
		String(process.env.RESET_DB || "").toLowerCase() === "true" ||
		process.argv.includes("--reset");

	if (reset) {
		await prisma.property.deleteMany();
		await prisma.address.deleteMany();
		console.log("DB reset: collections cleared.");
	}

	let createdCount = 0;
	let updatedCount = 0;
	let skippedCount = 0;
	// Backfill pour compat avec les anciennes données (si status manquant)
	await prisma.property
		.updateMany({ where: { status: null }, data: { status: "PUBLISHED" } })
		.catch(() => {});

	// Garde-fou: si on a déjà 15+ biens à Marseille, on n’en ajoute pas de nouveaux.
	// En revanche, si un bien Marseille existe (même titre), on le met à jour.
	let marseilleCount = await prisma.property.count({
		where: { address: { is: { city: "Marseille" } } },
	});

	for (const property of sampleProperties) {
		const existing = await prisma.property.findFirst({
			where: { title: property.title },
			select: { id: true, addressId: true, status: true },
		});

		const derived = deriveListingFields(property);
		const rentPriceMonthly = computeRentPriceMonthly({ property, derived });

		if (existing) {
			// Update adresse (si fournie)
			if (property.address) {
				await prisma.address.update({
					where: { id: existing.addressId },
					data: property.address,
				});
			}

			await prisma.property.update({
				where: { id: existing.id },
				data: {
					description: property.description,
					price: property.price,
					rentPriceMonthly,
					propertyType: property.propertyType,
					photos: property.photos,
					status: existing.status ?? "PUBLISHED",
					...derived,
				},
			});

			updatedCount++;
			continue;
		}

		if (marseilleCount >= 15 && property.address?.city === "Marseille") {
			skippedCount++;
			continue;
		}

		const createdAddress = await prisma.address.create({
			data: property.address,
			select: { id: true },
		});

		await prisma.property.create({
			data: {
				title: property.title,
				description: property.description,
				price: property.price,
				rentPriceMonthly,
				propertyType: property.propertyType,
				status: "PUBLISHED",
				photos: property.photos,
				addressId: createdAddress.id,
				...derived,
			},
		});

		createdCount++;
		if (property.address?.city === "Marseille") marseilleCount++;
	}

	const total = await prisma.property.count();
	console.log(
		`Seed terminé: +${createdCount} créées, ~${updatedCount} mises à jour, ${skippedCount} ignorées. Total Property=${total}`,
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
