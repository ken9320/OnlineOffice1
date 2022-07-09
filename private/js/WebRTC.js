let socket = io.connect('/WebRTC')
let namelist = []
let myname = ''
let localStream
const configuration = {
	iceServers: [
		{
			url: 'stun:23.21.150.121'
		},
		{
			url: 'stun:stun.l.google.com:19302'
		}
	]
}

const constraints = {
	audio: true,
	video: {
		width: { ideal: 848 }, //fireFox can not use max width,just use ideal width
		height: { ideal: 480 }
	}
}

socket.on('joinroomsuccess', function (myname) {
	console.log(`myName :  ${myname}`)
})

window.addEventListener('load', () => {
	document
		.querySelector('#startButton')
		.addEventListener('click', function () {})

	document
		.querySelector('#callButton')
		.addEventListener('click', function () {
			calleveryone()
			console.log(' call')
		})

	document
		.querySelector('#hangupButton')
		.addEventListener('click', function () {
			console.log('close call')
		})
})
async function setlocalStream(constraints) {
	localStream = await navigator.mediaDevices.getUserMedia(constraints)
	document.getElementById('localVideo').srcObject = localStream //將自己stream set去html《＃localVideo》
}

async function calleveryone() {
	socket.emit('Iamready', true)
}

socket.on('namelist', (list) => {
	namelist = list.split(',')

	console.log(namelist)
	console.log(namelist.length)
	if (namelist.length === 1) {
		//only one people in room,do not create peerConnection
		setlocalStream(constraints)
	} else if (namelist.length >= 2) {
		setlocalStream(constraints)

		for (let i = 1; i < namelist.length; i++) {
			//create multiple peerConnection and HTML
			let peerConnection = `peerConnection${i}`

			if (!document.querySelector(`#${peerConnection}`)) {
				//check this id do not have in html
				document.querySelector(
					'#mainbody'
				).innerHTML += `<video autoplay playsinline id="${peerConnection}"></video>`
			}
			peerConnection = new RTCPeerConnection(configuration)
		}
		document.querySelector('#callButton').disabled = true
	}
})
