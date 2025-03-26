"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { HardwareModal } from "./HardwareModal"

const Body = () => {
	return (
		<>
			<h1 style={{
				fontFamily: '"Montserrat", sans-serif',
				fontSize: '2.5rem',
				textAlign: 'center',
				margin: '2rem 0',
				fontWeight: '700',
				letterSpacing: '0.05em',
			}}>
				1st <span style={{
					background: 'linear-gradient(90deg, #9333ea 0%, #3b82f6 100%)',
					WebkitBackgroundClip: 'text',
					backgroundClip: 'text',
					color: 'transparent',
					fontSize: '2.8rem',
					fontWeight: '900',
					padding: '0 0.2rem',
					letterSpacing: '0.1em',
				}}>AI</span> Bottleneck Calculator
			</h1>
			<DotLottieReact
				src="https://lottie.host/d015ec6f-e687-4f2b-8ded-acc4877e22bd/SVHV1nqw2L.lottie"
				loop={true}
				autoplay={true} />
			<HardwareModal />
			
		</>
	)
}

export default Body