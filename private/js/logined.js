const socketinfo = io.connect('/chat')
socketinfo.on('sessionsend', (data) => {
	document.querySelector('#photo').innerHTML = `<img src="ing/${data.photo}">`
	document.querySelector('#company').innerHTML = data.companyname
	document.querySelector('#name').innerHTML = data.staffname
	document.querySelector('#id').innerHTML = data.staffid
	document.querySelector('#dept').innerHTML = data.deptname
	document.querySelector('#position').innerHTML = data.position
	// console.log(data.isManager)
	if (!data.isManager) {
		document.querySelector('#admin').classList.add('hidden')
	}
})

Chart.defaults.font.size = 20
Chart.defaults.color = '#000'

new Chart(document.getElementById('bar-chart'), {
	type: 'bar',
	data: {
		labels: ['Hong Kong', 'Janpan', 'Korea', 'Europe', 'America'],
		datasets: [
			{
				backgroundColor: [
					'#3e95cd',
					'#8e5ea2',
					'#3cba9f',
					'#e8c3b9',
					'#c45850'
				],
				data: [874900, 526700, 473400, 78400, 43300],
				hoverBorderWidth: 3,
				hoverBorderColor: '#000'
			}
		]
	},
	options: {
		plugins: {
			title: {
				display: true,
				text: 'Active Customer',
				color: '#000',
				font: {
					size: 40
				}
			},
			legend: {
				display: false,
				labels: {
					color: '#000',
					font: {
						size: 30
					}
				}
			}
		}
	}
})

new Chart(document.getElementById('pie-chart'), {
	type: 'pie',
	data: {
		labels: ['127store', '689store', '456store', '123store', '789store'],
		datasets: [
			{
				label: 'Population (millions)',
				backgroundColor: [
					'#3e95cd',
					'#8e5ea2',
					'#3cba9f',
					'#e8c3b9',
					'#c45850'
				],
				data: [2478, 5267, 734, 784, 433]
			}
		]
	},
	options: {
		plugins: {
			title: {
				display: true,
				text: 'Market Share',
				color: '#000',
				font: {
					size: 40
				}
			},
			legend: {
				labels: {
					color: '#000',
					font: {
						size: 30
					}
				}
			}
		}
	}
})

new Chart(document.getElementById('line-chart'), {
	type: 'line',
	data: {
		labels: [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		],
		datasets: [
			{
				data: [
					1793, 1238, 3769, 799, 2872, 2077, 2825, 3641, 4000, 4550,
					4900, 6000
				],
				label: 'Foods',
				borderColor: '#3e95cd',
				backgroundColor: '#3e95cd',
				fill: false
			},
			{
				data: [
					2887, 1788, 1965, 1669, 5714, 4177, 1960, 4339, 942, 2823,
					1955, 5474
				],
				label: 'Electronics',
				borderColor: '#8e5ea2',
				backgroundColor: '#8e5ea2',
				fill: false
			},
			{
				data: [
					639, 4669, 2621, 3523, 1338, 3976, 1647, 2753, 3016, 3138,
					3136, 4000
				],
				label: 'Computers',
				borderColor: '#3cba9f',
				backgroundColor: '#3cba9f',
				fill: false
			},
			{
				data: [
					1079, 5890, 3814, 2978, 1111, 525, 3902, 5524, 3094, 3240,
					1482, 6000
				],
				label: 'Smart Devices',
				borderColor: '#e8c3b9',
				backgroundColor: '#e8c3b9',
				fill: false
			},
			{
				data: [
					4323, 1017, 1506, 652, 3151, 3899, 2945, 528, 1528, 2592,
					5045, 5947
				],
				label: 'Fashion',
				borderColor: '#c45850',
				backgroundColor: '#c45850',
				fill: false
			}
		]
	},
	options: {
		plugins: {
			title: {
				display: true,
				text: 'Increase of Months',
				color: '#000',
				font: {
					size: 40
				}
			},
			legend: {
				labels: {
					color: '#000',
					font: {
						size: 30
					}
				}
			}
		}
	}
})
