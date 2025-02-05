// Particles.js config
fetch("particles-config.json")
	.then((response) => response.json())
	.then((config) => {
		particlesJS("particles-js", config)
	})
	.catch((error) => console.error("Error loading particles.js config:", error))

// Fungsi timer
/* panggil element */
const timerButton = document.getElementById("timer-button")
const bestTimeDisplay = document.getElementById("best-time")
const hourDisplay = document.getElementById("hour")
const minuteDisplay = document.getElementById("minute")
const secondDisplay = document.getElementById("second")
const millisecondDisplay = document.getElementById("milisecond")

/* variable init */
let startTime = 0
let elapsedTime = 0
let bestTime = parseInt(localStorage.getItem("bestTime")) || 0
let running = false
let animationFrame

/* fungsi format waktu */
function formatTime(ms) {
	let hours = Math.floor(ms / 3600000)
	let minutes = Math.floor((ms % 3600000) / 60000)
	let seconds = Math.floor((ms % 60000) / 1000)
	let milliseconds = ms % 1000

	return {
		hours: hours.toString().padStart(2, "0"),
		minutes: minutes.toString().padStart(2, "0"),
		seconds: seconds.toString().padStart(2, "0"),
		milliseconds: milliseconds.toString().padStart(3, "0"),
	}
}

/* fungsi untuk memperbarui best time */
function updateBestTimeDisplay() {
	if (bestTime > 0) {
		let formatted = formatTime(bestTime)
		bestTimeDisplay.textContent = `${formatted.hours}:${formatted.minutes}:${formatted.seconds}.${formatted.milliseconds}`
	}
}

/* fungsi untuk memperbarui timer */
function updateTimer() {
	if (running) {
		elapsedTime = Date.now() - startTime
		let formatted = formatTime(elapsedTime)

		hourDisplay.textContent = formatted.hours
		minuteDisplay.textContent = formatted.minutes
		secondDisplay.textContent = formatted.seconds
		millisecondDisplay.textContent = formatted.milliseconds

		animationFrame = requestAnimationFrame(updateTimer)
	}
}

/* mulai timer */
function startTimer() {
	running = true
	startTime = Date.now()
	elapsedTime = 0
	updateTimer()
}

/* stop timer */
function stopTimer() {
	running = false
	cancelAnimationFrame(animationFrame)

	// Pastikan waktu akhir yang ditampilkan sesuai dengan best time jika lebih lama
	if (elapsedTime > bestTime) {
		bestTime = elapsedTime
		localStorage.setItem("bestTime", bestTime)
		updateBestTimeDisplay()
	}
}

/* event listener ketika tombol ditekan */
timerButton.addEventListener("mousedown", () => {
	if (!running) {
		timerButton.querySelector("img").src = "img/buttonclicked.png" // Ganti gambar
		startTimer()
	}
})

/* event listener ketika tombol dilepas */
timerButton.addEventListener("mouseup", () => {
	if (running) {
		timerButton.querySelector("img").src = "img/button.png" // Kembalikan gambar
		stopTimer()
	}
})

timerButton.addEventListener("mouseleave", () => {
    if (running) {
        timerButton.querySelector("img").src = "img/button.png" // Kembalikan gambar
        stopTimer()
    }
})

/* Fungsi untuk menangani sentuhan di layar HP */
function handleTouchStart(event) {
    event.preventDefault();
    if (!running) {
        timerButton.querySelector("img").src = "img/buttonclicked.png";
        startTimer();
    }
}

function handleTouchEnd(event) {
    event.preventDefault();
    if (running) {
        timerButton.querySelector("img").src = "img/button.png";
        stopTimer();
    }
}

/* event listener ketika layar HP ditekan */
timerButton.addEventListener("touchstart", handleTouchStart, { passive: false })
timerButton.addEventListener("touchend", handleTouchEnd, { passive: false })

/* panggil fungsi ketika halaman dimuat */
updateBestTimeDisplay()
