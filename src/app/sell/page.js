import { Header } from "@/Components/Header";
import PropertyForm from "@/Components/PropertyForm";

function page() {
	return (
		<div className='w-full h-full'>
			<Header />
			<PropertyForm className='w-full h-full' />
		</div>
	);
}

export default page;
