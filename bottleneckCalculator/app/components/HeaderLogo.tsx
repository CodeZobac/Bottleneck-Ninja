"use client"
import Image from 'next/image'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CSSProperties, useEffect, useState } from 'react';
import { useTheme } from '../providers/theme-provider';
import Link from 'next/link';

interface HeaderLogoProps {
  style?: CSSProperties;
}



export const HeaderLogo = ({ style }: HeaderLogoProps) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);

    const logoSrc = mounted && resolvedTheme === 'dark' ? "/name-dark.svg" : "/name.svg";

    return(
      <Link href="/" className="focus-visible:outline-none">
        <div className="flex items-center -ml-4" style={style}>
          {/* Animation only shown on desktop */}
          <div className="hidden sm:flex w-64 h-28 items-center justify-center" style={{ marginTop: '-12px', marginBottom: '-12px' }}>
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
          {/* Logo image shown on all devices */}
          <Image 
            src={logoSrc} 
            alt="Bottleneck Ninja" 
            className="h-16 sm:-ml-12" 
            width={200}
            height={50}
            priority
          />
        </div>
      </Link>
    )}