import BackofficePropertyForm from "@/Components/backoffice/BackofficePropertyForm";
import prisma from "@/services/prismaClient";

export const metadata = {
	title: "Modifier un bien | Backoffice",
	description: "Modifier une annonce.",
};

export default async function BackofficeEditPropertyPage({ params }) {
	const property = await prisma.property.findUnique({
		where: { id: params.id },
		include: { address: true },
	});

	if (!property) {
		return (
			<div className='max-w-3xl mx-auto glass rounded-3xl p-8 md:p-10 text-white'>
				Bien introuvable.
			</div>
		);
	}

	return (
		<div className='max-w-3xl mx-auto'>
			<div className='text-2xl md:text-3xl font-bold text-white'>Modifier</div>
			<div className='mt-2 text-white/70'>
				Mets à jour les infos de l’annonce.
			</div>
			<div className='mt-8'>
				<BackofficePropertyForm mode='edit' initialProperty={property} />
			</div>
		</div>
	);
}
