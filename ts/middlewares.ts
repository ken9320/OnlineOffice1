import express from 'express'
import fs from 'fs'
import formidable from 'formidable'

export const isLogin = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session['isAdmin']) {
		next()
	} else if (req.session['isManager']) {
		res.redirect('/admin.html')
	} else {
		res.redirect('/')
	}
}

const uploadDir = 'img'
fs.mkdirSync('img', { recursive: true })
export const form = formidable({
	uploadDir: uploadDir,
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 20 * 1024 * 1024 ** 2,
	filter: (part) => part.mimetype?.startsWith('image/') || false
})
