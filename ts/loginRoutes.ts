import express from 'express'
import { client } from '../main'
import { logger } from './logger'

export const loginRoutes = express.Router()

loginRoutes.post('/login', async (req, res) => {
	try {
		console.log(req.body)
		console.log(typeof req.body.staffid)

		let stafflist = await client.query(
			`select staffpassword from staffs where staffid=$1 `,
			[req.body.staffid]
		)
		console.log(stafflist.rows[0].staffid)

		if (
			// req.body.staffid === req.body.staffid &&
			req.body.password === stafflist.rows[0].staffpassword
		) {
			req.session['isAdmin'] = true
			req.session['staffid'] = req.body.staffid
			console.log(req.session)
			res.redirect('/logined.html')
			return
		} else {
			res.redirect('/')
		}
	} catch (err) {
		logger.log(err)
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
