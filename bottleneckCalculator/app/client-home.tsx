"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import Body from "./components/Body";

// Dynamically import components that use browser APIs
const Header = dynamic(() => import('./components/Header'), { ssr: false });
const FirstTimeHelper = dynamic(() => import('./components/FirstTimeHelper'), { ssr: false });

export default function ClientHome() {
  return (
    <>
      <Header />
      <Body />
      <FirstTimeHelper />
    </>
  );
}