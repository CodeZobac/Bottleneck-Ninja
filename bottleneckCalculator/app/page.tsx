"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components that use browser APIs
const Header = dynamic(() => import('./components/Header'), { ssr: false });
const Body = dynamic(() => import('./components/Body'), { ssr: false });

export default function Home() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}


