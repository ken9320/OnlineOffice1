import express from 'express'
import fs from 'fs'
import formidable from 'formidable'
import Stripe from 'stripe'
import { Client } from 'pg'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

export const client = new Client({
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
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

export const isManager = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session['isManager']) {
		// req.session['isAdmin'] = false;
		next()
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

export const stripe = new Stripe(
	'sk_test_51LJJVmDBzJ7zDZp91TXBsZzOtx09bt9CQzd4i0JgqUIiywK563qoSlUmVaAepS43teZp1obNH1ZaEJCWiSiFBqIg00bAtznTUP',
	{
		apiVersion: '2020-08-27'
	}
)

export const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: 'tom23400@gmail.com',
		pass: 'sjomcrorpqxkaidj'
	}
})
