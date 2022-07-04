import express from 'express'
import expressSession from 'express-session'
import https from 'https'
import { Server as SocketIO } from 'socket.io'
import fs from 'fs'
import { logger } from './logger'
import { Client } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export const client = new Client({
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
})

client.connect()

// import path from "path";
// import events from "./event.js";
let peopleID = ''
logger.info('Client connected')
const app = express()

//讀取憑證及金鑰 by: https://blog.twtnn.com/2020/04/nodejshttps.html
const prikey = fs.readFileSync('privatekey.pem', 'utf8')
const cert = fs.readFileSync('ca.pem', 'utf8')

//建立憑證及金鑰
const credentials = {
	key: prikey,
	cert: cert
}
const server = https.createServer(credentials, app)

const io = new SocketIO(server) //io is for socketIO communicate

// io.listen(8000)
// const socket =
server.listen(8000, function () {
	console.log('https server listening on port 8000')
})
app.use(
	expressSession({
		secret: 'Yin',
		resave: true,
		saveUninitialized: true
	})
)

app.use((req, res, next) => {
	// console.log(req.url);
	// console.log(req.headers);
	// console.log(req.body);
	// console.log(req.ip);
	// console.log(req.session);
	// console.log(req.sessionID);

	next()
})

app.use(express.static('public'))
app.use(express.urlencoded())

io.on('connect', (people) => {
	people.join('chartRoom')
	console.log('Have connect request')
	people.emit('serverMsg', 'HI Users')
	peopleID = people.id
	console.log(peopleID)

	people.on('offer', (offers) => {
		console.log(offers)
		people.to('chartRoom').emit('offer', offers)
	})

	people.on('answer', (answer) => {
		console.log(answer)
		people.to('chartRoom').emit('answer', answer)
	})
})

app.use(express.static('private'))