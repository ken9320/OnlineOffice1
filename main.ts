import express from 'express'
import expressSession from 'express-session'
import formidable from 'formidable'
import https from 'https'
import { Server as SocketIO } from 'socket.io'
import { formatMessage } from './ts/messages'
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './ts/users'
import fs from 'fs'
import { logger } from './ts/logger'
import { Client } from 'pg'
import dotenv from 'dotenv'
// import { eventRouter } from './ts/eventRoutes'
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

app.use(eventRouter)

app.post('/login', async (req, res) => {
	try {
		// console.log(req.body)
		// console.log(typeof req.body.staffid)

		let stafflist = await client.query(
			`select staffpassword from staffs where staffid=${req.body.staffid} `
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
			console.log('HI')

			res.redirect('/')
		}
	} catch (err) {
		console.log(err)
		res.status(500).send('Internal Server Error')
	}
})

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

app.use(express.static('private'))
