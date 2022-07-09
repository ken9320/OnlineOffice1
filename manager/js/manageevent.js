async function manageevent() {
	//get
	const res = await fetch('/event')
	const events = await res.json()
	// console.log(events)
	for (const event of events) {
		// console.log(event.div_id)
		divid = event.div_id.split('+')
		document
			.querySelector(`.content > #id${divid[1]}`)
			.classList.add('active')
		document.querySelector(`.content > #id${divid[1]}`).innerHTML = `
            <textarea class="active">${event.event}</textarea>
            <button data-id="${divid[1]}">del</button>
            `
	}
	//post
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
	//update
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
							content: content
						})
					})
					manageevent()
				}
			)
		})
	}
	//delete
	const buttons = document.querySelectorAll('.content button')
	for (const button of buttons) {
		button.addEventListener('click', async function (e) {
			e.stopPropagation()

			console.log(button.dataset.id)
			const res = await fetch('/event/' + button.dataset.id, {
				method: 'DELETE'
			})
			manageevent()
		})
	}
}
manageevent()
