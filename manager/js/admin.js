window.onload = function () {
	const socket = io.connect()
	socket.on('getinfo', async (info) => {
		document.querySelector('#company').innerHTML = info.companyname
		if (document.querySelector('.cursearch') != null) {
			let searchQuery = ''

			document
				.querySelector('.cursearch')
				.addEventListener('change', function () {
					searchQuery = document.querySelector('.cursearch').value
					console.log(searchQuery)
					postemployee(searchQuery)
				})
		}
	})
	// postemployee()
	registeremployee()
}

async function postemployee(searchQuery) {
	const res =
		searchQuery != null
			? await fetch('/register?search=' + encodeURIComponent(searchQuery))
			: await fetch('/register')
	const infos = await res.json()
	//get
	let i = 0
	for (const info of infos) {
		document.querySelector(
			'.showinfo'
		).innerHTML += `<div class="info" data-id="${i}">
        Department: ${info.deptname} <br>
        Name: ${info.name} <br>
        Position: ${info.position} <br>
        Employee-ID: ${info.staff_id} <br>
        <button data-id="${i}">del</button>
        </div>`
		i++
	}
	console.log(infos)
}

async function registeremployee() {
	const res = await fetch('/register')
	const infos = await res.json()
	//post
	document
		.querySelector('#register')
		.addEventListener('click', async function () {
			const formData = new FormData(document.querySelector('.register'))
			let res = await fetch('/register', {
				method: 'POST',
				body: formData
			})
			let json = await res.json()

			document.querySelector('.register').reset()
		})
}
