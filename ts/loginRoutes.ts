import express from 'express'
import { client } from '../main'
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
			`select * from staffs where staff_id=$1 `,
			[user]
		)
<<<<<<< HEAD
=======
	
		// console.log('stafflist.rows[0].staffid' + stafflist.rows[0].staff_id)
>>>>>>> 221941748be987dcb42ab9ef0e7ec6695a674cd2

		// console.log('stafflist.rows[0].staffid: ' + stafflist.rows[0].staff_id)
		// console.log('stafflist.rows[0].staffPassword: ' + stafflist.rows[0].staffpassword)

		if (stafflist.rows.length == 0) {
			res.redirect('/?error=staffid or password incorrect')
			return
		} else if (
			await checkPassword(password, stafflist.rows[0].staffpassword)
		) {
			req.session['isAdmin'] = true
<<<<<<< HEAD
			req.session['staffid'] = stafflist.rows[0].staffid
=======
			req.session['staffid'] = req.body.staffid
			req.session['companyid'] = stafflist.rows[0].company
			console.log(req.session)
>>>>>>> 221941748be987dcb42ab9ef0e7ec6695a674cd2
			// console.log(req.session)
			res.redirect('/logined.html')
			return
		}
	} catch (err) {
		logger.error(err)
		res.status(500).send('Internal Server Error')
	}
})

export const isLogin = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session['isAdmin']) {
		next()
	} else {
		res.redirect('/')
	}
}

loginRoutes.post('/logout', (req, res) => {
	req.session['isAdmin'] = false
	res.redirect('/')
})
