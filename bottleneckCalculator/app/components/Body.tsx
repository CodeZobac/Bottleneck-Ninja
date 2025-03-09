"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { HardwareModal } from "./HardwareModal"

const Body = () => {
	return (
		<>
			<DotLottieReact
				src="https://lottie.host/d015ec6f-e687-4f2b-8ded-acc4877e22bd/SVHV1nqw2L.lottie"
				loop={true}
				autoplay={true} />
			<HardwareModal />
			
		</>
	)
}

export default Body