import { authOptions } from "@/services/authOptions";
import prisma from "@/services/prismaClient";
import { getServerSession } from "next-auth";

function requireBackoffice(session) {
	const role = session?.user?.role;
	return role === "ADMIN" || role === "AGENT";
}

function parsePhotos(value) {
	if (Array.isArray(value)) {
		return value
			.map(String)
			.map((s) => s.trim())
			.filter(Boolean);
	}
	return String(value || "")
		.split(/\n|,/)
		.map((s) => s.trim())
		.filter(Boolean);
}

function toNullableInt(value) {
	if (value === null || value === undefined || value === "") return null;
	const n = Number(value);
	if (!Number.isFinite(n)) return null;
	return Math.trunc(n);
}

function toNullableFloat(value) {
	if (value === null || value === undefined || value === "") return null;
	const n = Number(value);
	if (!Number.isFinite(n)) return null;
	return n;
}

const PROPERTY_STATUSES = ["DRAFT", "PUBLISHED", "SOLD", "RENTED", "ARCHIVED"];

function toNullableStatus(value) {
	if (value === null || value === undefined || value === "") return null;
	const s = String(value).trim().toUpperCase();
	return PROPERTY_STATUSES.includes(s) ? s : null;
}

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!requireBackoffice(session)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const properties = await prisma.property.findMany({
		orderBy: { createdAt: "desc" },
		include: { address: true },
	});

	return Response.json({ ok: true, properties });
}

export async function POST(req) {
	const session = await getServerSession(authOptions);
	if (!requireBackoffice(session)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json();

	const title = String(body?.title || "").trim();
	const description = String(body?.description || "").trim();
	const propertyType = String(body?.propertyType || "").trim();
	const status = toNullableStatus(body?.status) || "DRAFT";

	const price = toNullableFloat(body?.price);
	const rentPriceMonthly = toNullableFloat(body?.rentPriceMonthly);

	const street = String(body?.street || "").trim();
	const city = String(body?.city || "").trim();
	const state = String(body?.state || "").trim();
	const zipCode = String(body?.zipCode || "").trim();
	const country = String(body?.country || "").trim();

	if (!title) return Response.json({ error: "Titre requis" }, { status: 400 });
	if (!description)
		return Response.json({ error: "Description requise" }, { status: 400 });
	if (!propertyType)
		return Response.json({ error: "Type requis" }, { status: 400 });
	if (typeof price !== "number")
		return Response.json({ error: "Prix requis" }, { status: 400 });
	if (!city) return Response.json({ error: "Ville requise" }, { status: 400 });
	if (!country) return Response.json({ error: "Pays requis" }, { status: 400 });

	const photos = parsePhotos(body?.photos);

	const address = await prisma.address.create({
		data: {
			street: street || "—",
			city,
			state: state || "—",
			zipCode: zipCode || "—",
			country,
		},
	});

	const property = await prisma.property.create({
		data: {
			title,
			description,
			price,
			rentPriceMonthly,
			propertyType,
			status,
			addressId: address.id,
			photos,
			surfaceM2: toNullableInt(body?.surfaceM2),
			rooms: toNullableInt(body?.rooms),
			bedrooms: toNullableInt(body?.bedrooms),
			bathrooms: toNullableInt(body?.bathrooms),
			floor: toNullableInt(body?.floor),
			totalFloors: toNullableInt(body?.totalFloors),
			hasBalcony: Boolean(body?.hasBalcony),
			hasTerrace: Boolean(body?.hasTerrace),
			hasElevator: Boolean(body?.hasElevator),
			hasParking: Boolean(body?.hasParking),
		},
		include: { address: true },
	});

	return Response.json({ ok: true, property }, { status: 201 });
}
