let showinfo
const socketinfo = io.connect('/chat')
socketinfo.on('sessionsend', (data) => {
	showinfo = data
	document.querySelector('#company').innerHTML = showinfo.companyname
	document.querySelector('#name').innerHTML = showinfo.staffname
	document.querySelector('#id').innerHTML = showinfo.staffid
	document.querySelector('#dept').innerHTML = showinfo.deptname
	document.querySelector('#position').innerHTML = showinfo.position
})
