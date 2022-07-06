function createtalbe() {
	let hour = 8
	for (let y = 0; y < 24; y++) {
		let id = 1
		document.querySelector('.time-interval').innerHTML += `
        <div>${hour % 24}:00</div>`
		for (let x = 0; x < 7; x++) {
			document.querySelector('.content').innerHTML += `
            <div class="time" id="id${id * 100 + (hour % 24)}">
            <textarea></textarea>
            </div>`
			id++
		}
		hour++
	}

	const times = document.querySelectorAll('.time')
	for (const time of times) {
		time.addEventListener('click', function () {
			time.classList.add('active')
			time.querySelector('textarea').focus()
			time.querySelector('textarea').addEventListener(
				'blur',
				function () {
					// e.stopPropagation()
					// time.classList.remove('active')

					const content = time.querySelector('textarea').value
					const id = time.dataset.id
					// document.querySelector(`#${id}`).innerHTML += `
					// <textarea>${content}</textarea>`
				}
			)
		})
		// document.querySelector(`#${id}`).addEventListener("click", function () {
		//     time.classList.remove('active')
		// });
	}
}

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

document
	.querySelector('#eventSubmit')
	.addEventListener('click', async function () {
		let id = 0
		date = document.querySelector('#eventDate').value
		time = parseInt(document.querySelector('#eventTime').value)
		mydate = new Date(date).getDay()
		id = (time % 7) * mydate
		content = document.querySelector('#eventContent').value

		document.querySelector(`#id${id}`).classList.add('active')
		document.querySelector(`#id${id}`).innerHTML = `${content}`

		const formData = new FormData(document.querySelector('.eventForm'))
		let res = await fetch('/event', {
			method: 'POST',
			body: formData
		})

		let json = await res.json()

		if (json.result) {
		} else {
		}
		document.querySelector('.eventForm').reset()
	})

createtalbe()

async function getevent() {
	const res = await fetch('/event')
	const events = await res.json()

	console.log(events)
	for (const event of events) {
		document
			.querySelector(`.content > #id${event.div_id}`)
			.classList.add('active')
		document.querySelector(`.content > #id${event.div_id}`).innerHTML = `
            <textarea>${event.event}</textarea>
            `
		console.log(event.div_id)
	}
}
getevent()
