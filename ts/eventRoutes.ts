import express from 'express'
import { form } from './middlewares'
import { client } from '../main'
import { logger } from './logger'

export const eventRouter = express.Router()

eventRouter.use(express.json())

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

			await client.query(
				`
            INSERT INTO schedule (staffid, event, date, time, div_id, created_at, updated_at) VALUES (000, $1, $2, $3, $4, NOW(), NOW()) returning id`,
				[whatevent, whatdate, whattime, whatdiv]
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
			'SELECT * FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id;'
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
	// console.log(editId,editContent);
	try {
		await client.query(
			`UPDATE schedule SET event = $1, updated_at = NOW() WHERE div_id = $2`,
			[editContent, editId]
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
	console.log(delId)
	try {
		await client.query(`DELETE FROM schedule WHERE div_id=$1`, [delId])
		res.end()
		return
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
		return
	}
})
