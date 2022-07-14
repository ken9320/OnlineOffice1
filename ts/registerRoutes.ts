import express from 'express'
import { form, isManager } from './middlewares'
import { client } from './middlewares'
import { logger } from './logger'
import { hashPassword } from './hash'

export const registerRouter = express.Router()

registerRouter.use(express.json())

registerRouter.get('/register', isManager, async (req, res) => {
	let result
	let search
	try {
		result = await client.query(`
            SELECT company_id, companyname, dept_id, deptname, staff_id, name, positions.position, photo, fire FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id WHERE company_id = ${req.session['companyid']};
           `)

		if (req.query.search != null) {
			search = await client.query(
				`
            SELECT company_id, companyname, dept_id, deptname, staff_id, name, positions.position, photo, fire FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id WHERE company_id IN (SELECT company_id FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id WHERE (positions.position LIKE $1 OR department.deptname LIKE $1) AND company_id=$2);`,
				[req.query.search + '%', req.session['companyid']]
			)
			res.send(search.rows)
		} else {
			res.send(result.rows)
		}
		return
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
		return
	}
})

registerRouter.post('/register', isManager, async (req, res) => {
	form.parse(req, async (err, fields: { [T: string]: string }, files) => {
		try {
			let comid = req.session['companyid']
			let stfid = fields.id
			let pwd = await hashPassword(fields.password)
			let name = fields.name
			let dept = parseInt(fields.dept)
			let posit = parseInt(fields.position)
			let entryday = fields.entryDate
			let photo =
				files.photo != null && !Array.isArray(files.photo)
					? files.photo.newFilename
					: null

			console.log(stfid, pwd, name, dept,posit, entryday, photo)
			await client.query(
				`INSERT INTO staffs (company, staff_id, staffPassword, name, dept, position, entry_date, photo, created_at, updated_at, fire) VALUES
            ((SELECT id FROM companys WHERE company_id = '${comid}'), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), false)`,
				[stfid, pwd, name, dept, posit, entryday, photo]
			)
			res.redirect('/staffinfo.html')
			return
		} catch (err) {
			logger.error(err)
			return
		}
	})
	// res.redirect('/staffinfo.html')
})

registerRouter.patch('/register/:id', async (req, res) => {
	const editId = req.params.id
	// console.log(editId)
	try {
		await client.query(
			`UPDATE staffs SET fire = true, staffpassword = '**********', updated_at = NOW() WHERE staff_id = $1`,
			[editId]
		)
		// res.redirect('/staffinfo.html')
		return
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
		return
	}
	
})


