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
const hourDisplay = document.getElementById("hour")
const minuteDisplay = document.getElementById("minute")
const secondDisplay = document.getElementById("second")
const millisecondDisplay = document.getElementById("milisecond")
const leaderboardTable = document.getElementById("leaderboard-list")

/* variable init */
let startTime = 0
let elapsedTime = 0
let running = false
let animationFrame

// Ambil leaderboard dari localStorage atau buat array kosong
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []

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

/* fungsi untuk memperbarui leaderboard */
function updateLeaderboard() {
	leaderboardTable.innerHTML = ""

	// Urutkan leaderboard dari waktu terbaik (terlama bertahan)
	leaderboard.sort((a, b) => b.score - a.score)

	// Hanya simpan 5 skor terbaik
	leaderboard = leaderboard.slice(0, 5)
	localStorage.setItem("leaderboard", JSON.stringify(leaderboard))

	leaderboard.forEach((entry, index) => {
		const row = document.createElement("tr")
        let time = formatTime(entry.score)
		row.innerHTML = `
            <th class="leaderboard-table-col">${index + 1}</th>
			<th class="leaderboard-table-col">${entry.name}</th>
			<th class="leaderboard-table-col">${time.hours}:${time.minutes}:${time.seconds}.${time.milliseconds}</th>
		`

		leaderboardTable.appendChild(row)
	})
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

	// Cek apakah pemain layak masuk leaderboard:
	// 1. Jika leaderboard belum penuh (kurang dari 5)
	// 2. Jika skornya lebih besar dari salah satu skor yang ada di leaderboard
	let canEnterLeaderboard = leaderboard.length < 5 || leaderboard.some((entry) => elapsedTime > entry.score)

	if (canEnterLeaderboard) {
		;(async () => {
			let username
			while (!username) {
				const { value } = await Swal.fire({
					title: "Woilah cik! GG Gaming",
					text: "Enter your name:",
					input: "text",
					inputPlaceholder: "Your name",
					showCancelButton: false,
					allowOutsideClick: false,
					allowEscapeKey: false,
					inputValidator: (value) => {
						if (!value) return "You need to enter a name!"
					},
					confirmButtonText: "Save",
				})
				username = value
			}

			leaderboard.push({ name: username, score: elapsedTime })
			updateLeaderboard()
		})()
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
	event.preventDefault()
	if (!running) {
		timerButton.querySelector("img").src = "img/buttonclicked.png"
		startTimer()
	}
}

function handleTouchEnd(event) {
	event.preventDefault()
	if (running) {
		timerButton.querySelector("img").src = "img/button.png"
		stopTimer()
	}
}

/* event listener ketika layar HP ditekan */
timerButton.addEventListener("touchstart", handleTouchStart, { passive: false })
timerButton.addEventListener("touchend", handleTouchEnd, { passive: false })

/* Perbarui leaderboard saat halaman dimuat */
updateLeaderboard()
