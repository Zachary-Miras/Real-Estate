import { Header } from "@/Components/Header";
import LoginForm from "@/Components/LoginForm";

export const metadata = {
	title: "Connexion | Real Estate",
	description: "Connexion à votre compte.",
};

export default function LoginPage() {
	return (
		<div className='min-h-screen'>
			<Header />
			<main className='px-6 md:px-12 pt-10 pb-20'>
				<div className='max-w-2xl mx-auto'>
					<LoginForm />
				</div>
			</main>
		</div>
	);
}
