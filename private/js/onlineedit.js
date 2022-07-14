
socketinfo.on('sessionsend', (data) => {
	document.getElementById('mktpad').href = `/etherpad/p/${data.companyname}mktPad`
	document.getElementById('hrpad').href = `/etherpad/p/${data.companyname}hrPad`
	document.getElementById('acpad').href = `/etherpad/p/${data.companyname}acPad`
	document.getElementById('adminpad').href = `/etherpad/p/${data.companyname}adminPad`

	if (!data.isManager){
		document.querySelector('#adminNewPad').classList.add('hidden')
	}
})
