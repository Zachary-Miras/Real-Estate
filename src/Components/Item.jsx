import Link from "next/link";
import { FiMapPin } from "react-icons/fi";

export default function Item({ id, title, price, address, imageUrl }) {
	return (
		<div className='text-black bg-[#fbfbfe] shadow-xl rounded-[15px] mt-0 mb-8 w-96 h-max flex flex-col items-center cursor-pointer'>
			<Link href={`/property/${id}`}>
				<div className='items-center cursor-pointer'>
					<div className='w-full h-full flex justify-center items-center rounded-t-[15px] overflow-hidden'>
						<img
							src={imageUrl}
							alt={title}
							className='w-[380px] h-[250px] object-cover'
						/>
					</div>
				</div>
				<div className=' h-max w-full m-0 pb-2 pl-2 mt-0 rounded-b-[15px]'>
					<p className=' mt-4'>{price} $</p>
					<div className=' font-semibold text-sm mt-2 flex justify-start items-center gap-1'>
						<FiMapPin />
						{address}
					</div>
				</div>
			</Link>
		</div>
	);
}
