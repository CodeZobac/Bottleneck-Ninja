"use client"
import React, { useEffect } from 'react';
import { HeaderMenu } from './HeaderMenu';
import { HeaderLogo } from './HeaderLogo';
import HamburgerMenu from './HamburgerMenu';

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
        height: 'var(--header-height, 120px)',
        borderBottom: '1px solid rgba(100, 100, 100, 0.3)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Logo section */}
      <HeaderLogo />
      {/* Navigation */}
      <nav>
        {/* Desktop Menu */}
        <div className="hidden sm:block">
          <HeaderMenu />
        </div>
        {/* Mobile Menu */}
        <div className="block sm:hidden">
          <HamburgerMenu />
        </div>
      </nav>
    </header>
  );
};

export default Header;