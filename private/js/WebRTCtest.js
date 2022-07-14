// import socket from "./socket.js";
let socket = io.connect('/WebRTC')
const socketinfo = io.connect('/chat')
socketinfo.on('sessionsend', (data) => {
	document.querySelector('#photo').innerHTML = `<img src="ing/${data.photo}">`
	document.querySelector('#company').innerHTML = data.companyname
	document.querySelector('#name').innerHTML = data.staffname
	document.querySelector('#id').innerHTML = data.staffid
	document.querySelector('#dept').innerHTML = data.deptname
	document.querySelector('#position').innerHTML = data.position
	// console.log(data.isManager)
	if (!data.isManager) {
		document.querySelector('#admin').classList.add('hidden')
	}
})

socket.on('serverMsg', (msg) => {
	console.log(msg)
})

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

let peerConnection = new RTCPeerConnection(configuration)

// console.log(peerConnection)

let localStream
let remoteStream

const constraints = {
	audio: true,
	video: {
		width: { ideal: 848 }, //fireFox can not use max width,just use ideal width
		height: { ideal: 480 }
	}
}

async function setStream(constraints) {
	console.log(adapter.browserDetails.browser)

	remoteStream = new MediaStream()
	localStream = await navigator.mediaDevices.getUserMedia(constraints)
	document.getElementById('localVideo').srcObject = localStream

	localStream.getTracks().forEach((track) => {
		//addTrack to peerConnection
		peerConnection.addTrack(track, localStream)
	})

	// const remoteVideo = document.querySelector('#remoteVideo');
}

async function calleveryone() {
	const offer = await peerConnection.createOffer()
	await peerConnection.setLocalDescription(offer)

	console.log(offer)

	setTimeout(async () => {
		//===============google bug=====????
		const offer = await peerConnection.createOffer()
		await peerConnection.setLocalDescription(offer)
		socket.emit('offer', offer)
		console.log(offer)
	}, 0)
}

socket.on('answer', function (answer) {
	console.log(answer)
	peerConnection.setRemoteDescription(answer)
})

socket.on('offer', async function (offer) {
	console.log('have offer ')
	console.log(offer)
	await peerConnection.setRemoteDescription(offer)

	let answer = await peerConnection.createAnswer()
	await peerConnection.setLocalDescription(answer)
	socket.emit('answer', answer)
})

window.addEventListener('load', () => {
	peerConnection.addEventListener('track', async (event) => {
		//code by: https://webrtc.org/getting-started/remote-streams

		setTimeout(() => {
			console.log(event.streams)
			const [remoteStream] = event.streams
			document.querySelector('#remoteVideo').srcObject = remoteStream
		}, 0)
	})

	document
		.querySelector('#startButton')
		.addEventListener('click', function () {
			setStream(constraints)
		})

	document
		.querySelector('#callButton')
		.addEventListener('click', function () {
			calleveryone()
		})

	document
		.querySelector('#hangupButton')
		.addEventListener('click', function () {
			console.log('close call')
			peerConnection.close()
		})
})
