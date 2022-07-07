const res = await fetch('/login')
const login = await res.json()

document.querySelector('span').innerHTML = login.res

