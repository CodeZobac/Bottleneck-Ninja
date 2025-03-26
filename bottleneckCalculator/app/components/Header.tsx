"use client"
import React from 'react';

import { HeaderMenu } from './HeaderMenu';
import { HeaderLogo } from './HeaderLogo';



const Header = () => {
  return (
    <header className="w-full bg-bg border-b border-border shadow-sm py-1 px-6 flex items-center justify-between">
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