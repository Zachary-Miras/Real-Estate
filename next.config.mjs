/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "plus.unsplash.com" },
			{ protocol: "https", hostname: "img-v2.gtsstatic.net" },
			{ protocol: "https", hostname: "sir.azureedge.net" },
			{ protocol: "https", hostname: "internal.sothebys-staging.gabriels.net" },
			{ protocol: "https", hostname: "q-xx.bstatic.com" },
			{ protocol: "https", hostname: "**.bstatic.com" },
			{ protocol: "https", hostname: "bstatic.com" },
			{ protocol: "https", hostname: "www.vacationkey.com" },
			{ protocol: "https", hostname: "vacationkey.com" },
			{ protocol: "https", hostname: "res.cloudinary.com" },
		],
	},
};

export default nextConfig;
