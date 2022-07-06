import express from 'express'
import formidable from 'formidable'
import { client } from '../main'
import { logger } from './logger'

export const eventRouter = express.Router()
const form = formidable()

eventRouter.post('/event', function (req, res) {
	form.parse(req, async (err, fields) => {
		console.log(fields)
		try {
			let whatevent = fields.event
			let whatdate = fields.date
			let whattime = fields.time
			let whatdiv =
				new Date(fields.date.toString()).getDay() * 100 +
				new Date(
					fields.date.toString().concat(' ', fields.time.toString())
				).getHours()

			let result = await client.query(
				`
            INSERT INTO schedule (staffid, event, date, time, div_id, created_at, updated_at) VALUES (000, $1, $2, $3, $4, NOW(), NOW()) returning id`,
				[whatevent, whatdate, whattime, whatdiv]
			)
			res.send({ result: true, res: result.rows })
			res.end()
			return
		} catch (err) {
			logger.error(err)
			res.send({ result: false, res: [] })
			return
		}
	})
})

eventRouter.get('/event', async (req, res) => {
	let result
	try {
		result = await client.query('SELECT * FROM schedule;')
		res.send(result.rows)
	} catch (err) {
		res.send([])
	}
})
