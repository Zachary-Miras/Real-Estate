import EstimationForm from "@/Components/EstimationForm";
import { Header } from "@/Components/Header";

export const metadata = {
	title: "Estimation | Real Estate",
	description: "Estimez votre bien rapidement avec une expérience premium.",
};

export default function EstimationPage() {
	return (
		<div className='min-h-screen bg-[#071a3a]'>
			<Header />

			<section className='px-6 md:px-12 pt-10 pb-20'>
				<div className='max-w-6xl mx-auto'>
					<div className='grid grid-cols-12 gap-10 items-start'>
						<div className='col-span-12 lg:col-span-5'>
							<div className='glass rounded-3xl p-8'>
								<div className='text-3xl font-bold leading-tight'>
									Estimation en 3 étapes
								</div>
								<div className='mt-3 text-[color:var(--muted-on-dark)] leading-relaxed'>
									Renseigne quelques infos sur ton bien. On te rappelle avec une
									estimation et des conseils de mise en vente.
								</div>
								<div className='mt-6 text-xs text-white/60'>
									Données confidentielles • Sans engagement
								</div>
							</div>
						</div>

						<div className='col-span-12 lg:col-span-7'>
							<EstimationForm />
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
