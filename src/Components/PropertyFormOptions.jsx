function PropertyFormOptions({ name, icon: Icon }) {
	return (
		<div className='border h-10 flex justify-center items-center'>
			<label className='w-full h-full flex justify-center items-center'>
				<input type='checkbox' className='mr-2' />
				{Icon && <Icon className='mr-2' />}
				{name}
			</label>
		</div>
	);
}

export default PropertyFormOptions;
