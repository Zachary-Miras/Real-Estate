import { authOptions } from "@/services/authOptions";
import prisma from "@/services/prismaClient";
import { getServerSession } from "next-auth";

function requireBackoffice(session) {
	const role = session?.user?.role;
	return role === "ADMIN" || role === "AGENT";
}

function requireAdmin(session) {
	return session?.user?.role === "ADMIN";
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

export async function GET(_req, { params }) {
	const session = await getServerSession(authOptions);
	if (!requireBackoffice(session)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const property = await prisma.property.findUnique({
		where: { id: params.id },
		include: { address: true },
	});

	if (!property) return Response.json({ error: "Not found" }, { status: 404 });
	return Response.json({ ok: true, property });
}

export async function PATCH(req, { params }) {
	const session = await getServerSession(authOptions);
	if (!requireBackoffice(session)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json();
	const propertyId = params.id;

	const existing = await prisma.property.findUnique({
		where: { id: propertyId },
		include: { address: true },
	});
	if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

	const title = String(body?.title ?? existing.title).trim();
	const description = String(body?.description ?? existing.description).trim();
	const propertyType = String(
		body?.propertyType ?? existing.propertyType,
	).trim();
	const status =
		body?.status !== undefined
			? toNullableStatus(body?.status)
			: (existing.status ?? null);

	const price = toNullableFloat(body?.price);
	const rentPriceMonthly =
		body?.rentPriceMonthly === "" || body?.rentPriceMonthly === null
			? null
			: toNullableFloat(body?.rentPriceMonthly);

	const photos =
		body?.photos !== undefined ? parsePhotos(body?.photos) : existing.photos;

	const addressData = {
		street:
			String(body?.street ?? existing.address?.street ?? "").trim() || "—",
		city: String(body?.city ?? existing.address?.city ?? "").trim() || "—",
		state: String(body?.state ?? existing.address?.state ?? "").trim() || "—",
		zipCode:
			String(body?.zipCode ?? existing.address?.zipCode ?? "").trim() || "—",
		country:
			String(body?.country ?? existing.address?.country ?? "").trim() || "—",
	};

	await prisma.address.update({
		where: { id: existing.addressId },
		data: addressData,
	});

	const property = await prisma.property.update({
		where: { id: propertyId },
		data: {
			title,
			description,
			propertyType,
			price: typeof price === "number" ? price : existing.price,
			rentPriceMonthly,
			status,
			photos,
			surfaceM2:
				body?.surfaceM2 !== undefined
					? toNullableInt(body?.surfaceM2)
					: existing.surfaceM2,
			rooms:
				body?.rooms !== undefined ? toNullableInt(body?.rooms) : existing.rooms,
			bedrooms:
				body?.bedrooms !== undefined
					? toNullableInt(body?.bedrooms)
					: existing.bedrooms,
			bathrooms:
				body?.bathrooms !== undefined
					? toNullableInt(body?.bathrooms)
					: existing.bathrooms,
			floor:
				body?.floor !== undefined ? toNullableInt(body?.floor) : existing.floor,
			totalFloors:
				body?.totalFloors !== undefined
					? toNullableInt(body?.totalFloors)
					: existing.totalFloors,
			hasBalcony:
				body?.hasBalcony !== undefined
					? Boolean(body?.hasBalcony)
					: existing.hasBalcony,
			hasTerrace:
				body?.hasTerrace !== undefined
					? Boolean(body?.hasTerrace)
					: existing.hasTerrace,
			hasElevator:
				body?.hasElevator !== undefined
					? Boolean(body?.hasElevator)
					: existing.hasElevator,
			hasParking:
				body?.hasParking !== undefined
					? Boolean(body?.hasParking)
					: existing.hasParking,
		},
		include: { address: true },
	});

	return Response.json({ ok: true, property });
}

export async function DELETE(_req, { params }) {
	const session = await getServerSession(authOptions);
	if (!requireAdmin(session)) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	const propertyId = params.id;
	const existing = await prisma.property.findUnique({
		where: { id: propertyId },
		select: { id: true, addressId: true },
	});
	if (!existing) return Response.json({ ok: true });

	await prisma.property.delete({ where: { id: propertyId } });
	// Optionnel: on nettoie l'adresse si elle n'est plus utilisée
	const stillUsed = await prisma.property.count({
		where: { addressId: existing.addressId },
	});
	if (stillUsed === 0) {
		await prisma.address
			.delete({ where: { id: existing.addressId } })
			.catch(() => {});
	}

	return Response.json({ ok: true });
}
