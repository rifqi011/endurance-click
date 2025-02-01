// Particles.js config
fetch("particles-config.json")
	.then((response) => response.json())
	.then((config) => {
		particlesJS("particles-js", config)
	})
	.catch((error) => console.error("Error loading particles.js config:", error))
