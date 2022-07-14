window.onload = async function () {
	const socket = io.connect('/chat')
	socket.on('sessionsend', async (data) => {
		// 	console.log(data);
		// })
		// socket.on('getinfo', async (info) => {
		// console.log(info)
		document.querySelector('#company').innerHTML = data.companyname
		const res = await fetch('/register')
		const infos = await res.json()
		num = infos.length
		document.querySelector('#genid').addEventListener('click', () => {
			let depid = document.querySelector('#dept').value
			let eid = parseInt(data.companyid) + parseInt(depid) * 100 + num
			let showeid = document.querySelector('#eid')
			showeid.value = eid
			let chars =
				'0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ'
			let passwordLength = 8
			let password = ''
			for (let i = 0; i < passwordLength; i++) {
				let randomNumber = Math.floor(Math.random() * chars.length)
				password += chars.substring(randomNumber, randomNumber + 1)
			}
			let showpassword = document.querySelector('#password')
			showpassword.value = password
		})

		if (document.querySelector('.cursearch') != null) {
			let searchQuery = ''

			document
				.querySelector('.cursearch')
				.addEventListener('change', function () {
					searchQuery = document.querySelector('.cursearch').value
					// console.log(searchQuery)
					document.querySelector('.cur').innerHTML = ''
					postemployee(searchQuery)
				})
		}
	})
	await postemployee()
	await registeremployee()

	const buttons = document.querySelectorAll('.info > button')
	console.log(buttons)
	for (const button of buttons) {
		button.addEventListener('click', async function (e) {
			e.stopPropagation()
			// console.log(button.dataset.id)
			const res = await fetch('/register/' + button.dataset.id, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			location.reload();
		})
	}
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
		if(!info.fire){
			document.querySelector(
				'.cur'
			).innerHTML += `<div class="info" data-id="${i}">
			<img src="/ing/${info.photo}"/><br>
    	    Department: ${info.deptname} <br>
    	    Name: ${info.name} <br>
    	    Position: ${info.position} <br>
    	    Employee-ID: ${info.staff_id} <br>
    	    <button data-id="${info.staff_id}">fire</button>
    	    </div>`
			i++
		} else{
			document.querySelector(
				'.fire'
			).innerHTML += `<div class="info" data-id="${i}">
			<img src="/ing/${info.photo}"/><br>
    	    Department: ${info.deptname} <br>
    	    Name: ${info.name} <br>
    	    Position: ${info.position} <br>
    	    Employee-ID: ${info.staff_id} <br>
    	    </div>`
		}
	}
	// console.log(infos)
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
			console.log(formData)
			document.querySelector('.register').reset()
			location.reload();
		})
}


