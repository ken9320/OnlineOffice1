import express from 'express'
import expressSession from 'express-session'
import https from 'https'
import { Server as SocketIO } from 'socket.io'
import { formatMessage } from './ts/messages'
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './ts/users'
import fs from 'fs'
import { logger } from './ts/logger'
import { Client } from 'pg'
import dotenv from 'dotenv'
import { eventRouter } from './ts/eventRoutes'
import { loginRoutes } from './ts/loginRoutes'

dotenv.config()

export const client = new Client({
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
})

client.connect()

// import path from "path";
// import events from "./event.js";

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
app.use(eventRouter)
app.use(loginRoutes)

let roomList: any[] = []
let WebRTC = io.of('/WebRTC')
WebRTC.on('connect', (people) => {
	roomList.push(people.rooms)
	console.log(roomList)
	people.emit('serverMsg', 'HI Users')

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
