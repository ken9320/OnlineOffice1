document.querySelector('.open-button').addEventListener('click', function () {
	document.querySelector('.chat-container').style.display = 'block'
})

document.querySelector('#leave-btn').addEventListener('click', function () {
	document.querySelector('.chat-container').style.display = 'none'
})

const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const userList = document.querySelector('#users')

const socket = io.connect('/chat')
socket.on('sessionsend', (data) => {
	// console.log(data)
	let username = data.staffname
	let room = data.companyname
	socket.emit('joinRoom', { username, room })
	socket.on('roomUsers', ({ room, users }) => {
		outputRoomName(room)
		outputUsers(users)
	})

	socket.on('message', (message) => {
		// console.log(message)
		outputMessage(message)
		chatMessages.scrollTop = chatMessages.scrollHeight
	})

	chatForm.addEventListener('submit', (e) => {
		e.preventDefault()
		let msg = e.target.elements.msg.value
		msg = msg.trim()
		if (!msg) {
			return false
		}
		socket.emit('chatMessage', msg)
		e.target.elements.msg.value = ''
		e.target.elements.msg.focus()
	})

	function outputMessage(message) {
		const div = document.createElement('div')
		div.classList.add('message')
		const p = document.createElement('p')
		p.classList.add('meta')
		p.innerText = message.username
		p.innerHTML += `<span>${message.time}</span>`
		div.appendChild(p)
		const para = document.createElement('p')
		para.classList.add('text')
		para.innerText = message.text
		div.appendChild(para)
		document.querySelector('.chat-messages').appendChild(div)
	}

	function outputRoomName(room) {
		roomName.innerText = room
	}

	function outputUsers(users) {
		userList.innerHTML = ''
		users.forEach((user) => {
			const li = document.createElement('li')
			li.innerText = user.username
			userList.appendChild(li)
		})
	}
})
