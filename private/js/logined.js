
const socketinfo = io.connect('/chat')
socketinfo.on('sessionsend', (data) => {
	document.querySelector('#photo').innerHTML = `<img src="ing/${data.photo}">`
	document.querySelector('#company').innerHTML = data.companyname
	document.querySelector('#name').innerHTML = data.staffname
	document.querySelector('#id').innerHTML = data.staffid
	document.querySelector('#dept').innerHTML = data.deptname
	document.querySelector('#position').innerHTML = data.position
})
