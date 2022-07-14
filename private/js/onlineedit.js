
socketinfo.on('sessionsend', (data) => {
	document.getElementById('mktpad').href = `/etherpad/p/${data.companyname}mktpad`
	document.getElementById('hrpad').href = `/etherpad/p/${data.companyname}hrpad`
	document.getElementById('acpad').href = `/etherpad/p/${data.companyname}acpad`
	document.getElementById('adminpad').href = `/etherpad/p/${data.companyname}adminpad`

	if (!data.isManager){
		document.querySelector('#adminNewPad').classList.add('hidden')
	}
})
