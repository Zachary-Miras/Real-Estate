import { authOptions } from "@/services/authOptions";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

function requireBackoffice(session) {
	const role = session?.user?.role;
	return role === "ADMIN" || role === "AGENT";
}

export async function POST(req) {
	const session = await getServerSession(authOptions);
	if (!requireBackoffice(session)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const formData = await req.formData();
		const file = formData.get("file");

		if (!file || typeof file === "string") {
			return Response.json({ error: "Fichier requis" }, { status: 400 });
		}

		// Convertir le fichier en buffer puis en base64 data URI
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

		const result = await cloudinary.uploader.upload(base64, {
			folder: "shop/properties",
			resource_type: "image",
		});

		return Response.json({
			ok: true,
			url: result.secure_url,
			public_id: result.public_id,
		});
	} catch (err) {
		console.error("Cloudinary upload error:", err);
		return Response.json(
			{ error: "Erreur lors de l'upload." },
			{ status: 500 },
		);
	}
}
