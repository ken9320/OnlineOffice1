import express from 'express'
import expressSession from 'express-session'
import formidable from 'formidable'
import https from 'https'
import { Server as SocketIO } from 'socket.io'
import { formatMessage } from './ts/messages'
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './ts/users'
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

const botName = 'ChatCord Bot'

// Run when client connects
io.on('connection', function (socket) {
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room)

		socket.join(user.room)

		// Welcome current user
		socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(botName, `${user.username} has joined the chat`)
			)

		// Send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		})
	})

	// Listen for chatMessage
	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id)

		io.to(user.room).emit('message', formatMessage(user.username, msg))
	})

	// Runs when client disconnects
	socket.on('disconnect', () => {
		const user = userLeave(socket.id)

		if (user) {
			io.to(user.room).emit(
				'message',
				formatMessage(botName, `${user.username} has left the chat`)
			)

			// Send users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			})
		}
	})
})

const form = formidable()

app.post('/event', function (req, res) {
	form.parse(req, async (err, fields) => {
		console.log(fields)
		try {
			let whatevent = fields.event
			let whatdate = fields.date
			let whattime = fields.time

			let result = await client.query(
				`
            INSERT INTO schedule (staffid, event, date, time, created_at, updated_at) VALUES (000, $1, $2, $3, NOW(), NOW()) returning id`,
				[whatevent, whatdate, whattime]
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

app.use(express.static('private'))
