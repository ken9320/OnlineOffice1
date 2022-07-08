let socket = io.connect('/WebRTC')
let namelist = ''
let myname = ''
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
	console.log(`joined :  ${myname}`)
})

window.addEventListener('load', () => {
	document
		.querySelector('#startButton')
		.addEventListener('click', function () {
			setlocalStream(constraints)
		})

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
	namelist = list
})
