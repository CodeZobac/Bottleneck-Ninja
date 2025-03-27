"use client"
import React, { useEffect } from 'react';
import { HeaderMenu } from './HeaderMenu';
import { HeaderLogo } from './HeaderLogo';

const Header = () => {
  useEffect(() => {
    // Set the header height as a CSS variable for use in other components
    document.documentElement.style.setProperty('--header-height', '120px');
  }, []);

  return (
    <header className="w-full bg-bg border-b border-border shadow-sm py-1 px-6 flex items-center justify-between"
      style={{ 
        position: 'relative',
        zIndex: 10, 
        height: 'var(--header-height, 120px)'
      }}
    >
      {/* Logo section */}
      <HeaderLogo />
      {/* Navigation */}
      <nav>
        <HeaderMenu />
      </nav>
    </header>
  );
};

export default Header;