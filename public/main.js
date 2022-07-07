const params = new URLSearchParams(window.location.search)
console.log(params)
for (const param of params) {
	console.log(param)
	document.querySelector('span').innerHTML = param[1]
}
