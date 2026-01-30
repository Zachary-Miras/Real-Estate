import BackofficePropertyForm from "@/Components/backoffice/BackofficePropertyForm";

export const metadata = {
	title: "Nouveau bien | Backoffice",
	description: "Créer une annonce.",
};

export default function BackofficeNewPropertyPage() {
	return (
		<div className='max-w-3xl mx-auto'>
			<div className='text-2xl md:text-3xl font-bold text-white'>
				Nouveau bien
			</div>
			<div className='mt-2 text-white/70'>
				Crée une annonce visible sur le site.
			</div>
			<div className='mt-8'>
				<BackofficePropertyForm mode='create' />
			</div>
		</div>
	);
}
