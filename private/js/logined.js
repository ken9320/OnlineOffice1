const socket = io.connect()
socket.on('getinfo', (info) => {
	document.querySelector('#company').innerHTML = info.companyname
	document.querySelector('#name').innerHTML = info.staffname
	document.querySelector('#id').innerHTML = info.staffid
	document.querySelector('#dept').innerHTML = info.deptname
	document.querySelector('#position').innerHTML = info.position
})

// async function getinfo() {
// 	const res = await fetch('/logined')
// 	const result = await res.json()
// 	console.log(result)

// 	document.querySelector('#company').innerHTML = result.session.companyname
// 	document.querySelector('#name').innerHTML = result.session.staffname
// 	document.querySelector('#id').innerHTML = result.session.staffid
// 	document.querySelector('#dept').innerHTML = result.session.deptname
// 	document.querySelector('#position').innerHTML = result.session.position
// }
// getinfo()
