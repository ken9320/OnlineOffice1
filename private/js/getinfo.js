export async function getinfo() {
	const res = await fetch('/logined')
	const result = await res.json()
	console.log(result)
}
