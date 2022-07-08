import express from 'express'
import { form } from './middlewares'
import { client } from '../main'
import { logger } from './logger'
import { hashPassword } from './hash'

export const registerRouter = express.Router()

registerRouter.use(express.json())

registerRouter.get('/register', async (req, res) => {
	let result
	try {
		result = await client.query(`
            SELECT company_id, companyname, dept_id, deptname, staff_id, name, positions.position FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id WHERE company_id = ${req.session['companyid']};
           `)
		res.send(result.rows)
		return
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
		return
	}
})

registerRouter.post('/register', async (req, res) => {
	form.parse(req, async (err, fields: { [T: string]: string }, files) => {
		try {
			let comid = req.session['companyid']
			let stfid = fields.id
			let pwd = await hashPassword(fields.password)
			let name = fields.name
			let dept = fields.dept
			let posit = fields.position
			let entryday = fields.entryDate

			await client.query(
				`INSERT INTO staffs (company, staff_id, staffPassword, name, dept, position, entry_date, created_at, updated_at) VALUES
            ((SELECT id FROM companys WHERE company_id = '${comid}'), $1, $2, $3, $4, $5, $6, NOW(), NOW())`,
				[stfid, pwd, name, dept, posit, entryday]
			)

			return
		} catch (err) {
			logger.error(err)
			return
		}
	})
	res.redirect('/staffinfo.html')
})

registerRouter.patch('/register/:id', async (req, res) => {})

registerRouter.delete('/register/:id', async (req, res) => {})
