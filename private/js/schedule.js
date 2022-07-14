createtalbe()
drag()

function createtalbe() {
	let hour = 8
	for (let y = 0; y < 24; y++) {
		let id = 1
		document.querySelector('.time-interval').innerHTML += `
        <div>${hour % 24}:00</div>`
		for (let x = 0; x < 7; x++) {
			if (id == 7) id = 0
			document.querySelector('.content').innerHTML += `
            <div class="time" data-id="${id * 100 + (hour % 24)}" id="id${
				id * 100 + (hour % 24)
			}">
            <textarea></textarea>
            </div>`
			id++
		}
		hour++
	}
}

function drag() {
	let dragged
	document.addEventListener('dragstart', (event) => {
		dragged = event.target
		event.target.classList.add('dragging')
	})

	document.addEventListener('dragend', (event) => {
		event.target.classList.remove('dragging')
	})

	document.addEventListener(
		'dragover',
		(event) => {
			event.preventDefault()
			event.target.classList.add('active')
		},
		false
	)

	document.addEventListener('dragenter', (event) => {
		if (event.target.classList.contains('time')) {
			event.target.classList.add('dragover')
		}
	})

	document.addEventListener('dragleave', (event) => {
		if (event.target.classList.contains('time')) {
			event.target.classList.remove('dragover')
		}
	})

	document.addEventListener('drop', (event) => {
		event.preventDefault()
		if (event.target.classList.contains('dropzone')) {
			event.target.classList.remove('dragover')
			dragged.parentNode.removeChild(dragged)
			event.target.appendChild(dragged)
		}
	})
}

// window.onload = function () {

const socketinfo = io.connect('/chat')
socketinfo.on('sessionsend', (data) => {
	console.log(data.isManager)
	if (!data.isManager) {
		document.querySelector('#admin').classList.add('hidden')
	}
})

// }
