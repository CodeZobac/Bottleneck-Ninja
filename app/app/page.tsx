"use client"; 
import Header from "./components/Header";
import PcSpecForm from "./PcSpecForm";
import React, { use } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



export default function Home() {
  return (
      <>
        <Header />
        <DotLottieReact
        src="https://lottie.host/d015ec6f-e687-4f2b-8ded-acc4877e22bd/SVHV1nqw2L.lottie"
        loop = {true}
        autoplay = {true} />
        <PcSpecForm />
      </>
  );
}



