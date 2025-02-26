import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const Header = () => {
  return (
    <header className="w-full bg-white shadow-md py-1 px-6 flex items-center justify-between">
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
	  <img 
		src="/name.svg" 
		alt="Name" 
		className="h-16 -ml-6"
	  />
	</div>
      
      {/* Navigation */}
      <nav>
        <ul className="flex items-center space-x-8">
          <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Calculate</a></li>
          <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">My builds</a></li>
          <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Login</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;