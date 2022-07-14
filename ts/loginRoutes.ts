import express from 'express'
import { client } from './middlewares'
import { checkPassword } from './hash'
import { logger } from './logger'
export const loginRoutes = express.Router()

loginRoutes.post('/login', async (req, res) => {
	try {
		// console.log(req.body)
		// console.log('staffid' + req.body.staffid)
		let user = req.body.staffid.trim()
		let password = req.body.password.trim()

		let stafflist = await client.query(
			`SELECT * FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id where staff_id=$1 `,
			[user]
		)
		// console.log('stafflist.rows[0].staffid: ' + stafflist.rows[0].staff_id)
		// console.log('stafflist.rows[0].staffPassword: ' + stafflist.rows[0].staffpassword)
		// console.log(stafflist.rows[0].payment)
		if (!stafflist.rows[0].payment) {
			res.redirect('/?error=Not pay yet')
			return
		}
		if (stafflist.rows.length == 0) {
			res.redirect('/?error=staffid or password incorrect')
			return
		} else if (
			await checkPassword(password, stafflist.rows[0].staffpassword)
		) {
			req.session['isAdmin'] = true
			req.session['staffid'] = stafflist.rows[0].staff_id
			req.session['staffname'] = stafflist.rows[0].name
			req.session['companyid'] = stafflist.rows[0].company_id
			req.session['companyname'] = stafflist.rows[0].companyname
			req.session['deptid'] = stafflist.rows[0].dept_id
			req.session['deptname'] = stafflist.rows[0].deptname
			req.session['position'] = stafflist.rows[0].position
			req.session['isManager'] = stafflist.rows[0].manager
			req.session['photo'] = stafflist.rows[0].photo
			// console.log('login session: ' + req.session['staffid'] )
			// if (req.session['isManager']) {
			// 	res.redirect('/admin.html')
			// 	return
			// } else
			if (req.session['isAdmin']) {
				res.redirect('/logined.html')
				return
			}
			return
		} else {
			res.redirect('/?error=staffid or password incorrect')
		}
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
	}
})

loginRoutes.post('/logout', (req, res) => {
	req.session['isAdmin'] = false
	req.session['isManager'] = false
	res.redirect('/')
})
