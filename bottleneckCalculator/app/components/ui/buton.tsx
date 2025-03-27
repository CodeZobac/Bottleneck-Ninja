import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const MainButton: React.FC<ButtonProps> = ({ 
  children, 
  onClick,
  className = '' 
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is available on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware text color
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div className="button-wrap">
      <button 
        onClick={onClick}
        className={className}>
        <span>
          {children}
        </span>
      </button>
      <div className="button-shadow"></div>

      <style jsx global>{`
        @property --angle-1 {
    syntax: "<angle>";
    inherits: false;
    initial-value: -75deg;
  }
  
  @property --angle-2 {
    syntax: "<angle>";
    inherits: false;
    initial-value: -45deg;
  }
  
  :root {
    --global--size: clamp(2rem, 4vw, 5rem);
    --anim--hover-time: 400ms;
    --anim--hover-ease: cubic-bezier(0.25, 1, 0.5, 1);
  }
      `}</style>

      <style jsx>{`
         /* Button Wrap Container */
  .button-wrap {
    position: relative;
    z-index: 2;
    border-radius: 999vw;
    background: transparent;
    pointer-events: none;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
  }
  
  /* Button Shadow Container */
  .button-shadow {
    --shadow-cuttoff-fix: 2em;
    position: absolute;
    width: calc(100% + var(--shadow-cuttoff-fix));
    height: calc(100% + var(--shadow-cuttoff-fix));
    top: calc(0% - var(--shadow-cuttoff-fix) / 2);
    left: calc(0% - var(--shadow-cuttoff-fix) / 2);
    filter: blur(clamp(2px, 0.125em, 12px));
    -webkit-filter: blur(clamp(2px, 0.125em, 12px));
    -moz-filter: blur(clamp(2px, 0.125em, 12px));
    -ms-filter: blur(clamp(2px, 0.125em, 12px));
    overflow: visible;
    pointer-events: none;
  }
  
  /* Shadow */
  .button-shadow::after {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 0;
    border-radius: 999vw;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    width: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
    height: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
    top: calc(var(--shadow-cuttoff-fix) - 0.5em);
    left: calc(var(--shadow-cuttoff-fix) - 0.875em);
    padding: 0.125em;
    box-sizing: border-box;
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    overflow: visible;
    opacity: 1;
  }
  
  /* ========== BUTTON BASE STYLES ========== */
  
  button {
    /* Basic Styling */
    --border-width: clamp(1px, 0.0625em, 4px);
    all: unset;
    cursor: pointer;
    position: relative;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    pointer-events: auto;
    z-index: 3;
    background: linear-gradient(
      -75deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.05)
    );
    border-radius: 999vw;
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
      inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
      0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.2),
      0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2),
      0 0 0 0 rgba(255, 255, 255, 1);
    backdrop-filter: blur(clamp(1px, 0.125em, 4px));
    -webkit-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
    -moz-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
    -ms-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
  }
  
  button:hover {
    transform: scale(0.975);
    backdrop-filter: blur(0.01em);
    -webkit-backdrop-filter: blur(0.01em);
    -moz-backdrop-filter: blur(0.01em);
    -ms-backdrop-filter: blur(0.01em);
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
      inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
      0 0.15em 0.05em -0.1em rgba(0, 0, 0, 0.25),
      0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.5),
      0 0 0 0 rgba(255, 255, 255, 1);
  }
  
  /* Button Text */
  button span {
    position: relative;
    display: block;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    font-family: "Inter", sans-serif;
    letter-spacing: -0.05em;
    font-weight: 800;
    font-size: 1em;
    color: ${isDark ? 'white' : 'rgba(50, 50, 50, 1)'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-shadow: 0em 0.25em 0.05em rgba(0, 0, 0, 0.1);
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    padding-inline: 1.5em;
    padding-block: 0.875em;
  }
  
  button:hover span {
    text-shadow: 0.025em 0.025em 0.025em rgba(0, 0, 0, 0.12);
  }
  
  /* Text */
  button span::after {
    content: "";
    display: block;
    position: absolute;
    z-index: 1;
    width: calc(100% - var(--border-width)); /* Prevent overlapping border */
    height: calc(100% - var(--border-width));
    top: calc(0% + var(--border-width) / 2);
    left: calc(0% + var(--border-width) / 2);
    box-sizing: border-box;
    border-radius: 999vw;
    overflow: clip;
    background: linear-gradient(
      var(--angle-2),
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 40% 50%,
      rgba(255, 255, 255, 0) 55%
    );
    z-index: 3;
    mix-blend-mode: screen;
    pointer-events: none;
    background-size: 200% 200%;
    background-position: 0% 50%;
    background-repeat: no-repeat;
    transition: background-position calc(var(--anim--hover-time) * 1.25)
        var(--anim--hover-ease),
      --angle-2 calc(var(--anim--hover-time) * 1.25) var(--anim--hover-ease);
  }
  
  button:hover span::after {
    background-position: 25% 50%;
  }
  
  button:active span::after {
    background-position: 50% 15%;
    --angle-2: -15deg;
  }
  
  /* Touch Devices */
  @media (hover: none) and (pointer: coarse) {
    button span::after,
    button:active span::after {
      --angle-2: -45deg;
    }
  }
  
  /* ========== BUTTON OUTLINE ========== */
  
  /* Outline */
  button::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    border-radius: 999vw;
    width: calc(100% + var(--border-width));
    height: calc(100% + var(--border-width));
    top: calc(0% - var(--border-width) / 2);
    left: calc(0% - var(--border-width) / 2);
    padding: var(--border-width);
    box-sizing: border-box;
    background: conic-gradient(
        from var(--angle-1) at 50% 50%,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0) 5% 40%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0) 60% 95%,
        rgba(0, 0, 0, 0.5)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    transition: all var(--anim--hover-time) var(--anim--hover-ease),
      --angle-1 500ms ease;
    box-shadow: inset 0 0 0 calc(var(--border-width) / 2) rgba(255, 255, 255, 0.5);
  }
  
  button:hover::after {
    --angle-1: -125deg;
  }
  
  button:active::after {
    --angle-1: -75deg;
  }
  
  @media (hover: none) and (pointer: coarse) {
    button::after,
    button:hover::after,
    button:active::after {
      --angle-1: -75deg;
    }
  }
  
  /* Shadow Hover */
  .button-wrap:has(button:hover) .button-shadow {
    filter: blur(clamp(2px, 0.0625em, 6px));
    -webkit-filter: blur(clamp(2px, 0.0625em, 6px));
    -moz-filter: blur(clamp(2px, 0.0625em, 6px));
    -ms-filter: blur(clamp(2px, 0.0625em, 6px));
    transition: filter var(--anim--hover-time) var(--anim--hover-ease);
  }
  
  .button-wrap:has(button:hover) .button-shadow::after {
    top: calc(var(--shadow-cuttoff-fix) - 0.875em);
    opacity: 1;
  }
  
  /* Rotation */
  .button-wrap:has(button:active) {
    transform: rotate3d(1, 0, 0, 25deg);
  }
  
  .button-wrap:has(button:active) button {
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
      inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
      0 0.125em 0.125em -0.125em rgba(0, 0, 0, 0.2),
      0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2),
      0 0.225em 0.05em 0 rgba(0, 0, 0, 0.05),
      0 0.25em 0 0 rgba(255, 255, 255, 0.75),
      inset 0 0.25em 0.05em 0 rgba(0, 0, 0, 0.15);
  }
  
  .button-wrap:has(button:active) .button-shadow {
    filter: blur(clamp(2px, 0.125em, 12px));
    -webkit-filter: blur(clamp(2px, 0.125em, 12px));
    -moz-filter: blur(clamp(2px, 0.125em, 12px));
    -ms-filter: blur(clamp(2px, 0.125em, 12px));
  }
  
  .button-wrap:has(button:active) .button-shadow::after {
    top: calc(var(--shadow-cuttoff-fix) - 0.5em);
    opacity: 0.75;
  }
  
  .button-wrap:has(button:active) span {
    text-shadow: 0.025em 0.25em 0.05em rgba(0, 0, 0, 0.12);
  }
      `}</style>
    </div>
  );
};

export default MainButton;
