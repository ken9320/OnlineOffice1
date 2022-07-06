async function manageevent() {
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
					// console.log(content)
					const res = await fetch('/event/' + time.dataset.id, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							content: content,
						})
					})
					manageevent()
				}
			)
		})
	}
}
manageevent()
