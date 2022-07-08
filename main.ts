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
import { registerRouter } from './ts/registerRoutes'

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
let botName = 'ChatCord Bot'
let staffid = ''
// let companyid = ''
let companyname = ''
app.use((req, res, next) => {
	// console.log(req.url);
	// console.log(req.headers);
	// console.log(req.body);
	// console.log(req.ip);
	// console.log(req.session);
	// console.log(req.sessionID);
	companyname = req.session['companyname']
	botName = req.session['companyname']
	staffid = req.session['staffid']
	// companyid = req.session['companyid']
	next()
})

app.get('/logined', (req, res) => {
	console.log(req.session)
	res.json({
		session: req.session
	})
})

app.use(express.static('public'))

app.use(express.urlencoded())
app.use(eventRouter)
app.use(loginRoutes)
app.use(registerRouter)

// let roomList:any[] = [];

let WebRTC = io.of('/WebRTC')
WebRTC.on('connect', (people) => {
	people.emit('serverMsg', `HI Users ${companyname}`)

	joinroom()

	async function joinroom() {
		people.join(`${companyname}`)
		people.emit('joinroomsuccess', `${people.id}`);//自己
		// await io.of("/WebRTC").in(`${companyname}`).allSockets().then(items=>{ //in room name list
		// 	let count :string[]= [];
		//     items.forEach(item=>{
		// 		count.push(item)
		//         console.log(count)
		// 		console.log(count.length)

		//     })
		// });
		WebRTC.in(`${companyname}`).emit(
			'joinroomsuccess',
			`${companyname} + ${staffid}`
		) //WebRTC的ROOM ${companyname}內所有人
	}

	people.on('Iamready', async (e) => {
	
		// join ready room
		people.join(`${companyname}ready`)
		people.emit('joinroomsuccess', `${people.id}`);//自己
		//send how many people at room with out 自己
		await io.of('/WebRTC').in(`${companyname}ready`).allSockets().then((items) => {
		
				let namelist: string[] = []
				items.forEach((item) => {
						namelist.push(item)
					
				})
				WebRTC.in(`${companyname}ready`).emit(
					'namelist',
					`${namelist}`
					
				) 
				console.log(namelist)
			})
	})

	// console.log(WebRTC.sockets.size)

	// people.join('chartRoom')

	people.on('offer', (offers) => {
		console.log(offers)
		people.to(`${companyname}`).emit('offer', offers)
	})

	people.on('answer', (answer) => {
		console.log(answer)
		people.to(`${companyname}`).emit('answer', answer)
	})

	people.on('disconnect', () => {
		console.log(people.rooms.size)
		people.broadcast
			.in(`${companyname}`)
			.emit(`leave`, `${staffid} is leave`)
	})
})
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
