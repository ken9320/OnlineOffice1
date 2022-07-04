// const socket = io.connect();

function createtalbe() {
	let id = 0
	let hour = 8
	for (let y = 0; y <= 24; y++) {
		document.querySelector('.time-interval').innerHTML += `
        <div>${hour % 24}:00</div>`
		hour++
		for (let x = 0; x <= 7; x++) {
			document.querySelector('.content').innerHTML += `
            <div class="time" id="id${id}">
            <textarea></textarea>
            </div>`
			id++
		}
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
		date = document.querySelector('#eventDate').value
		id = document.querySelector('#eventTime').value
		content = document.querySelector('#eventContent').value
		console.log(date)

		const schs = document.querySelectorAll('.time')
		// console.log(schs);
		for (const sch of schs) {
			sch.classList.add('active')
			sch.querySelector(`#${id}`).innerHTML = `${content}`
			console.log(id)
		}
		// const formData = await document.querySelector('.eventForm').value
		// console.log(formData);
		// json= await JSON.stringify(formData);
		// console.log(json);

		// await fetch('/event', {
		//   method: 'POST',
		//   headers: {'Content-Type': 'application/json'},
		//   body: JSON.stringify({
		//     content: event
		//   })
		// })

		// document.querySelector('.eventForm').reset()
	})

createtalbe()
