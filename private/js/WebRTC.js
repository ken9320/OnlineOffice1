let socket = io.connect('/WebRTC')
let namelist = ''
let selfInfo = {}
let otherStaffInfo = []
let localStream
let tracking = []
document.querySelector('#callButton').disabled = true
document.querySelector('#hangupButton').disabled = true

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

socket.on('selfInfo', function (data) {
	selfInfo = data //selfInfo {position ,staffName, companyname,stocketioID}
})

window.addEventListener('load', () => {
	document
		.querySelector('#startButton')
		.addEventListener('click', function () {
			try {
				setlocalStream(constraints)
				document.querySelector('#callButton').disabled = false
				document.querySelector('#startButton').disabled = true
				document.querySelector('#hangupButton').disabled = true
			} catch (e) {
				console.log('self cam can not open')
			}
		})

	document
		.querySelector('#callButton')
		.addEventListener('click', function () {
			document.querySelector('#callButton').disabled = true
			document.querySelector('#hangupButton').disabled = false
			calleveryone()
			console.log(' call')
		})

	document
		.querySelector('#hangupButton')
		.addEventListener('click', function () {
			for (let peer of peerConnectionList) {
				console.log(peer)
				// peer.ontrack = null;
				// peer.onicecandidate = null;
				// peer.onnegotiationneeded = null;
				peer.remoteStream.getTracks().forEach((track) => {
					peer.removeTrack(track)
				})
				peer.close()
				peer = null

				localStream = null
			}
			document.querySelector('#mainbody').innerHTML = ''

			// socket.emit('hangup', selfInfo.stocketioID)

			peerConnectionList = []

			document.querySelector('#startButton').disabled = false
			document.querySelector('#hangupButton').disabled = true
			console.log('close call')
		})
})
async function setlocalStream(constraints) {
	localStream = await navigator.mediaDevices.getUserMedia(constraints)
	async function addvideo() {
		// let addvideo = `<video autoplay  id="peerConnections${selfInfo.stocketioID}"></video>`
		// document.querySelector('#mainbody').innerHTML += addvideo

		let video = document.createElement('video')
		video.autoplay = 'autoplay'
		video.playsinline = 'playsinline'
		video.id = `peerConnections${selfInfo.stocketioID}`
		document.querySelector('#mainbody').appendChild(video)
	}

	addvideo().then(async function () {
		document.querySelector(
			`#peerConnections${selfInfo.stocketioID}`
		).srcObject = localStream
	})

	localStream.getTracks().forEach((track) => {
		//addTrack to peerConnection
		tracking.push(track)
	})
}
//=======================================================================================================================
async function calleveryone() {
	socket.emit('Iamready', true)
}
socket.on('joinreadyroomsuccess', (data) => {
	console.log(data)
})

let peerConnectionList = []

function s(str) {
	return encodeURIComponent(str)
}

socket.on('namelist', async (namelist) => {
	//當有人入黎namelist就會更新，幫新黎嘅人開個video tag and new RTCPeerConnection
	// console.log(namelist)
	if (namelist.length === 1) {
		//you are first join,do not create peerConnection
	} else if (namelist.length >= 2) {
		// you are not alone
		for (let i = 0; i <= namelist.length - 1; i++) {
			//create multiple peerConnection and HTML
			let peerConnection = `peerConnections${namelist[i]}`

			let remoteStream = `remoteStream${namelist[i]}`

			if (!document.querySelector(`#${peerConnection}`)) {
				let video = document.createElement('video')
				video.autoplay = 'autoplay'
				video.playsinline = 'playsinline'
				video.id = peerConnection
				document.querySelector('#mainbody').appendChild(video)
				let idName = peerConnection
				peerConnection = new RTCPeerConnection(configuration)
				console.log(peerConnection)
				remoteStream = new MediaStream()

				localStream.getTracks().forEach((track) => {
					//addTrack to peerConnection
					console.log(localStream)
					peerConnection.addTrack(track, localStream)
				})
				peerConnection.addEventListener('track', async (event) => {
					//code by: https://webrtc.org/getting-started/remote-streams

					setTimeout(() => {
						console.log(event.streams)
						let [remoteStream] = event.streams

						document.querySelector(`#${idName}`).srcObject =
							remoteStream
					}, 0)
				})
				// console.log(peerConnection)
				peerConnectionList.push({
					peerConnection,
					remoteStream,
					socketID: namelist[i]
				})
			} else {
				peerConnection = null
				remoteStream = null
				peerConnectionList.push({
					peerConnection,
					remoteStream,
					socketID: namelist[i]
				})
			}
		}

		if (
			selfInfo.stocketioID ==
			peerConnectionList[peerConnectionList.length - 1].socketID
		) {
			//
			console.log('new send offer')
			createoffers()
			async function createoffers() {
				peerConnectionList.map(async function s(x) {
					if (x.socketID != selfInfo.stocketioID) {
						let offer = await x.peerConnection.createOffer()
						await x.peerConnection.setLocalDescription(offer)
						// console.log(offer)
						setTimeout(async () => {
							//===============google bug=====????
							let offer = await x.peerConnection.createOffer()
							await x.peerConnection.setLocalDescription(offer)
							let offerData = [
								offer,
								x.socketID,
								selfInfo.stocketioID
							]
							socket.emit('sendOffer', offerData)
							console.log(offer)
							x.offer = offer
						}, 10)
					}
				})
			}
		}
	}
})

socket.on(`receiveOffer`, async function (receiveofferData) {
	let offer = receiveofferData[0]
	// console.log(offer)
	let index = peerConnectionList
		.map((object) => object.socketID)
		.indexOf(receiveofferData[2])
	// console.log(await peerConnectionList[index].peerConnection)
	await peerConnectionList[index].peerConnection.setRemoteDescription(offer)
	setTimeout(async () => {
		//===============google bug=====????
		let answer = await peerConnectionList[
			index
		].peerConnection.createAnswer()
		await peerConnectionList[index].peerConnection.setLocalDescription(
			answer
		)
		let answerData = [
			answer,
			peerConnectionList[index].socketID,
			selfInfo.stocketioID
		]
		console.log(answer)
		socket.emit('sendAnswer', answerData)
	}, 10)
})

socket.on('receiveAnswer', async function (answerData) {
	// console.log(answerData[0])
	let index = peerConnectionList
		.map((object) => object.socketID)
		.indexOf(answerData[2])
	setTimeout(async () => {
		//===============google bug=====????
		peerConnectionList[index].peerConnection.setRemoteDescription(
			answerData[0]
		)
	}, 10)
})
socket.on('leave', async function (id) {
	// if(id === selfInfo.stocketioID){
	// 	for(let peer of peerConnectionList){
	// 		peer.peerConnection.close()
	// 		peer.remoteStream = null;
	// 		peer.peerConnection = null;
	// 	}
	// }
	// console.log(id +'is leave')
	// let index = peerConnectionList.map(object => object.socketID).indexOf(id);
	// console.log(index)
	// console.log(peerConnectionList[index].peerConnection)
	// await peerConnectionList[index].peerConnection.removeTrack(sender)
	// peerConnectionList[index].peerConnection.close()
	// peerConnectionList[index].peerConnection = null;
	// peerConnectionList[index].remoteStream = null;
	// await peerConnectionList.splice[index,0]
	// document.querySelector(
	// 	`#peerConnections${id}`
	// ).remove();
})
