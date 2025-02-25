import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Header = () => {
  return (
    <>
        <DotLottieReact
          src="https://lottie.host/dbb0f7ac-dddb-4488-94ab-bc8d7cc2c34a/mvOYRBqZXw.lottie"
          loop
          autoplay />
        <svg href='../../public/name.svg' />
        <svg href='../../public/logo.svg' />
    </>

  );
};

export default Header;