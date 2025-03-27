"use client"
import Image from 'next/image'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CSSProperties, useEffect, useState } from 'react';
import { useTheme } from '../providers/theme-provider';

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
        <div className="flex items-center -ml-4" style={style}>
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
            src={logoSrc} 
            alt="Name" 
            className="h-16 -ml-12" 
            width={200}
            height={50}
          />
        </div>
    )}