function createtalbe() {
	let hour = 8
	for (let y = 0; y < 24; y++) {
		let id = 1
		document.querySelector('.time-interval').innerHTML += `
        <div>${hour % 24}:00</div>`
		for (let x = 0; x < 7; x++) {
			document.querySelector('.content').innerHTML += `
            <div class="time" data-id="${id * 100 + (hour % 24)}" id="id${id * 100 + (hour % 24)}">
            <textarea></textarea>
            </div>`
			id++
		}
		hour++
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

createtalbe()

async function getevent() {
	const res = await fetch('/event')
	const events = await res.json()

	// console.log(events)
	for (const event of events) {
		document
			.querySelector(`.content > #id${event.div_id}`)
			.classList.add('active')
		document.querySelector(`.content > #id${event.div_id}`).innerHTML = `
            <textarea class="active">${event.event}</textarea>
            `
		// console.log(event.div_id)
	}

	document
	.querySelector('#eventSubmit')
	.addEventListener('click', async function () {
		const formData = new FormData(document.querySelector('.eventForm'))
		let res = await fetch('/event', {
			method: 'POST',
			body: formData
		})
		let json = await res.json()
		if (json.result) {
			// location.reload(true);
		} else {
		}
		document.querySelector('.eventForm').reset()
	})

	const times = document.querySelectorAll('.time')
	for (const time of times) {
		time.addEventListener('click', async function () {
			time.classList.add('active')
			time.querySelector('textarea').focus()
			time.querySelector('textarea').addEventListener(
				'blur',
				async function () {
					const content = time.querySelector('textarea').value
					console.log(content)
					const res = await fetch('/event/' + time.dataset.id, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							content: content
						})
					})
					getevent()
				}
			)
		})
	}
}
getevent()
