let Cal = function (divId) {
	this.divId = divId

	this.DaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

	this.Months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]

	let d = new Date()
	this.currMonth = d.getMonth()
	this.currYear = d.getFullYear()
	this.currDay = d.getDate()
}

Cal.prototype.nextMonth = function () {
	if (this.currMonth == 11) {
		this.currMonth = 0
		this.currYear = this.currYear + 1
	} else {
		this.currMonth = this.currMonth + 1
	}
	this.showcurr()
}

Cal.prototype.previousMonth = function () {
	if (this.currMonth == 0) {
		this.currMonth = 11
		this.currYear = this.currYear - 1
	} else {
		this.currMonth = this.currMonth - 1
	}
	this.showcurr()
}

Cal.prototype.showcurr = function () {
	this.showMonth(this.currYear, this.currMonth)
}

Cal.prototype.showMonth = function (y, m) {
	let d = new Date(),
		firstDayOfMonth = new Date(y, m, 1).getDay(),
		lastDateOfMonth = new Date(y, m + 1, 0).getDate(),
		lastDayOfLastMonth =
			m == 0
				? new Date(y - 1, 11, 0).getDate()
				: new Date(y, m, 0).getDate()
	let html = '<table>'
	html += '<thead><tr>'
	html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>'
	html += '</tr></thead>'
	html += '<tr class="days">'
	for (let i = 0; i < this.DaysOfWeek.length; i++) {
		html += '<td>' + this.DaysOfWeek[i] + '</td>'
	}
	html += '</tr>'

	let i = 1
	do {
		let dow = new Date(y, m, i).getDay()
		if (dow == 0) {
			html += '<tr>'
		} else if (i == 1) {
			html += '<tr>'
			let k = lastDayOfLastMonth - firstDayOfMonth + 1
			for (let j = 0; j < firstDayOfMonth; j++) {
				html += `<td id="date${k}" class="not-current">${k}</td>`
				k++
			}
		}

		let chk = new Date()
		let chkY = chk.getFullYear()
		let chkM = chk.getMonth()
		let chkD = chk.getDay()
		if (
			chkY == this.currYear &&
			chkM == this.currMonth &&
			i == this.currDay
		) {
			html += `<td id="date${i}" class="today">${i}</td>`
		} else {
			html += `<td id="date${i}" class="normal">${i}</td>`
		}
		if (dow == 6) {
			html += '</tr>'
		} else if (i == lastDateOfMonth) {
			let k = 1
			for (dow; dow < 6; dow++) {
				html += `<td id="date${k}" class="not-current">${k}</td>`
				k++
			}
		}
		i++
	} while (i <= lastDateOfMonth)
	html += '</table>'

	document.getElementById(this.divId).innerHTML = html
}

window.onload = function () {
	let c = new Cal('divCal')
	c.showcurr()
	document.querySelector('#btnNext').addEventListener('click', function () {
		c.nextMonth()
	})
	document.querySelector('#btnPrev').addEventListener('click', function () {
		c.previousMonth()
	})
	let newdate = new Date()
	document.querySelector(`#day${newdate.getDay()}`).classList.add('active')

	const dates = document.querySelectorAll(`td`)
	for (const date of dates) {
		let day = parseInt(date.textContent)
		date.addEventListener('click', function () {
			const names = document.querySelectorAll(`.week-names > div`)
			for (const name of names) {
				name.classList.remove('active')
			}
			document.querySelector('#showdate').innerHTML = `${day} / ${
				newdate.getMonth() + 1
			}`
			document
				.querySelector(
					`#day${new Date(
						newdate.getFullYear(),
						newdate.getMonth(),
						day
					).getDay()}`
				)
				.classList.add('active')
		})
	}
}

document.querySelector('#showdate').innerHTML = `${new Date().getDate()} / ${
	new Date().getMonth() + 1
}`
