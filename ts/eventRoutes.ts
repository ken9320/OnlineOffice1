import express from 'express'
import { client, form } from './middlewares'
import { logger } from './logger'

export const eventRouter = express.Router()

eventRouter.use(express.json())

let stfid: number
let divid: string
eventRouter.use((req, res, next) => {
	stfid = req.session['staffid']

	// console.log(stfid)
	next()
})

eventRouter.post('/event', function (req, res) {
	form.parse(req, async (err, fields) => {
		console.log(fields)
		try {
			console.log(stfid)
			let whatevent = fields.event
			let whatdate = fields.date
			let whattime = fields.time
			let whatdiv =
				new Date(fields.date.toString()).getDay() * 100 +
				new Date(
					fields.date.toString().concat(' ', fields.time.toString())
				).getHours()
			divid = stfid.toString() + '+' + whatdiv

			await client.query(
				`
            INSERT INTO schedule (staffid, event, date, time, div_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
				[stfid, whatevent, whatdate, whattime, divid]
			)
			return
		} catch (err) {
			logger.error(err)
			res.send({ result: false, res: [] })
			return
		}
	})
	res.redirect('/schedule.html')
})

eventRouter.get('/event', async (req, res) => {
	let result
	try {
		result = await client.query(
			'SELECT * FROM schedule WHERE staffid = $1;',
			[stfid]
		)
		res.send(result.rows)
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
	}
})

eventRouter.patch('/event/:id', async (req, res) => {
	const editId = req.params.id
	const editContent = req.body.content
	divid = stfid.toString() + '+' + editId
	console.log(editId, editContent, divid)
	try {
		await client.query(
			`UPDATE schedule SET event = $1, updated_at = NOW() WHERE div_id = $2`,
			[editContent, divid]
		)
		res.end()
		return
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
		return
	}
})

eventRouter.delete('/event/:id', async (req, res) => {
	const delId = req.params.id
	divid = stfid.toString() + '+' + delId
	// console.log(delId,divid)
	try {
		await client.query(`DELETE FROM schedule WHERE div_id=$1`, [divid])
		// res.redirect('/schedule.html')
		// return
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
		return
	}
	res.redirect('/schedule.html')
})
