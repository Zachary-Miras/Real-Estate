export async function createProperty() {
	const newAddress = await prisma.address.create({
		data: {
			street: "Palm Jumeirah",
			city: "Dubai",
			state: "Dubai",
			zipCode: "",
			country: "United Arab Emirates",
		},
	});

	const newProperty = await prisma.property.create({
		data: {
			title: "Armani Presidential Penthouse",
			description: "Palm Jumeirah Dubai, Dubai United Arab Emirates",
			price: 131471390.0,
			propertyType: "APARTMENT",
			addressId: newAddress.id,
			photos: [
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fjazd5wfhjbev4z63eqanwz7yr2i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fnzhpqk03krnt47p0t7etdryy51i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fwky3k0zw5br3m4p2trt8ct2hx7i215&w=3840&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2F6mwhe3qe4h704pyj63x9j86nw5i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2F0r3k9c5gsntwmgat8djr2hs8m1i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fm2tzjpyg684jmmj5ez2eta0ad5i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fa6j22vrzaxhs4b2vk2kc586dk3i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fxew9sqac22chmwymz9t1v3yq81i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fns841cwadswp47tpyq79azxvj1i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fxwaf7t8a8c9zmmact5venfv3d4i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fk5n06apqrkgz4kyb6xkz55mry0i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2Fym688md4qfx84zp3h842ym9n57i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2F4jhap2x26prh4xjcgfpr8pce12i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
				"https://img-v2.gtsstatic.net/reno/imagereader.aspx?url=https%3A%2F%2Fsir.azureedge.net%2F1259i215%2F8cb4tznfj9bm46engrps4c05j0i215&w=1920&q=75&option=N&permitphotoenlargement=false&fallbackimageurl=https://internal.sothebys-staging.gabriels.net/resources/siteresources/commonresources/images/nophoto/no_image_new.png",
			],
		},
	});

	if (process.env.NODE_ENV !== "production") {
		console.log("Created new address:", newAddress);
		console.log("Created new property:", newProperty);
	}
}
