"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { HardwareModal } from "./HardwareModal"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Body = () => {
	const { resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	
	// Ensure we only render theme-specific elements after component mount
	useEffect(() => {
		setMounted(true)
	}, [])
	
	// Set appropriate colors based on theme
	const isDark = mounted && resolvedTheme === 'dark'
	const bgColor = isDark ? "rgba(30, 30, 30, 1)" : "rgba(215, 215, 215, 1)"
	const dotColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"
	
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
			
			<div className="flex flex-col items-center justify-center">
				 {/* Main image container - 60% width of screen with responsive sizing */}
						<DotLottieReact
							src="https://lottie.host/d015ec6f-e687-4f2b-8ded-acc4877e22bd/SVHV1nqw2L.lottie"
							loop={true}
							autoplay={true}
							className="mb-160 w-3/5 mx-auto relative aspect-video" />
					
				
				{/* Calculate Button positioned directly below the image */}
				<div className="mt-120">
					<HardwareModal />
				</div>
			</div>
			
			<svg 
				style={{
					position: "fixed",
					backgroundColor: bgColor,
					width: "100%", 
					height: "calc(100% - var(--header-height, 60px))", 
					zIndex: -1,
					top: "var(--header-height, 60px)",
					left: 0,
					pointerEvents: "none"
				}} 
				width="100%" 
				height="100%" 
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<pattern id="dottedGrid" width="30" height="30" patternUnits="userSpaceOnUse">
						<circle cx="2" cy="2" r="1" fill={dotColor} />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#dottedGrid)" />
			</svg>
		</>
	)
}

export default Body