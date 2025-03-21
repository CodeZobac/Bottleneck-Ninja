"use client"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { HeaderMenu } from './HeaderMenu';
import Image from 'next/image';


const Header = () => {
  return (
    <header className="w-full bg-bg border-b border-border shadow-sm py-1 px-6 flex items-center justify-between">
      {/* Logo section */}
	<div className="flex items-center -ml-4">
	  <div className="w-64 h-28 flex items-center justify-center" style={{ marginTop: '-12px', marginBottom: '-12px' }}>
		<DotLottieReact
		src="https://lottie.host/dbb0f7ac-dddb-4488-94ab-bc8d7cc2c34a/mvOYRBqZXw.lottie"
		loop
		autoplay
		style={{
		  width: '240px',
		  height: '160px',
		  objectFit: 'contain',
		  display: 'block'
		}}
		/>
	  </div>
	  <Image 
		src="/name.svg" 
		alt="Name" 
		className="h-16 -ml-6"
		width={200}
		height={50}
	  />
	</div>
      
      {/* Navigation */}
      <nav>
        <HeaderMenu />
      </nav>
    </header>
  );
};

export default Header;