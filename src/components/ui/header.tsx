import React from 'react';
import Image from 'next/image';

const Header = () => {
	return (
		<div className='flex flex-row h-[140px] w-full flex-1 bg-amber-50 p-2 items-center justify-start'>
			<Image src={"http://bfhinpkvqkjzeumateqq.supabase.co/serve-public-assets?path=logo.png"} alt="header-logo" width={200} height={100} />
		</div>
	)
}

export default Header