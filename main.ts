import express from 'express'
import expressSession from 'express-session'
import https from 'https'
import { Server as SocketIO } from 'socket.io'
import { formatMessage } from './ts/messages'
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './ts/users'
import fs from 'fs'
import { logger } from './ts/logger'
import { eventRouter } from './ts/eventRoutes'
import { loginRoutes } from './ts/loginRoutes'
import { registerRouter } from './ts/registerRoutes'
import { client, isLogin, stripe, transporter } from './ts/middlewares'

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

export const io = new SocketIO(server) //io is for socketIO communicate

app.use(
	expressSession({
		secret: 'Yin',
		resave: true,
		saveUninitialized: true
	})
)
let botName = 'ChatCord Bot'
// let staffid = ''
let sessions = {}
// let companyname = ''
let selfInfo: { [key: string]: any } = {}
app.use((req, res, next) => {
	// console.log(req.url);
	// console.log(req.headers);
	// console.log(req.body);
	// console.log(req.ip);
	// console.log(req.session);
	// console.log(req.sessionID);

	botName = req.session['companyname']

	selfInfo.position = req.session['position']
	selfInfo.staffName = req.session['staffname']
	selfInfo.companyname = req.session['companyname']

	sessions = req.session
	// companyid = req.session['companyid']
	next()
})

// app.get('/logined', (req, res) => {
// 	console.log(req.session)
// 	res.json({
// 		session: req.session
// 	})
// })

app.post('/create-checkout-session', async (req, res) => {
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				price: 'price_1LKDFjDBzJ7zDZp9UmDCKh20'
			}
		],
		mode: 'subscription',
		success_url: `https://192.168.80.64:8080/success.html`,
		cancel_url: `https://192.168.80.64:8080/?error=payment faile`
	})
	if (session.url != null) {
		res.redirect(session.url, 303)
	} else {
		res.redirect('/')
	}
})

const endpointSecret =
	'whsec_9773db9bcbf7a040fbf8c7c78f16ca1a51a8c279db87254643d3d2155184f05c'
app.post(
	'/webhook',
	express.raw({ type: 'application/json' }),
	async (req, res) => {
		// console.log('body: ' + JSON.stringify(req.body))
		// console.log(req.body)
		const payload = req.body
		const sig = req.headers['stripe-signature'] as string

		let event
		try {
			event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
			// console.log(`before if: ${event.data.object}`)
			// console.log(event)
			// console.log(event.type)
			if (event.type === 'invoice.payment_succeeded') {
				console.log('Payment succeeded')
				console.log(event.data.object["customer_email"])
				console.log(event.data.object['customer_name'])
				await client.query(
					`UPDATE companys SET payment = TRUE, updated_at = NOW() WHERE companyname = '${event.data.object['customer_name']}'`
				)
				transporter.sendMail({
					to: event.data.object['customer_email'],
					subject: 'payment_succeeded',
					from: 'chenglokyin@gmail.com',
					text: 'Payment succeeded can use service'
				})
				// console.log("after if: "+event.data.object)
			}
		} catch (err) {
			res.status(400).send(`Webhook Error: ${err.message}`)
			return
		}

		res.status(200).end()
	}
)

app.use(express.static('public'))

app.use(express.urlencoded())
app.use(eventRouter)
app.use(loginRoutes)
app.use(registerRouter)

// let roomList:any[] = [];

let WebRTC = io.of('/WebRTC')
WebRTC.on('connect', (people) => {
	let socketidlist: string[] = []

	joinCompanyRoom()

	async function joinCompanyRoom() {
		console.log(`${selfInfo.staffName} Joined Company Room`)
		people.join(selfInfo.companyname) //分公司房
		selfInfo.stocketioID = people.id

		

		//selfInfo {position ,staffName, companyname,stocketioID}
		// people.emit('nameIdList',nameIdList)
		people.emit('selfInfo', selfInfo) //每次重新入網址收自己info
	}

	people.on('Iamready', async (e) => {
		//people join ready room
		people.join(`${selfInfo.companyname}ready`)
		people.emit(
			'joinreadyroomsuccess',
			`${selfInfo.staffName} joed ready room`
		) //自己

		await io
			.of('/WebRTC')
			.in(`${selfInfo.companyname}ready`)
			.allSockets()
			.then((items) => {
				items.forEach((item) => {
					socketidlist.push(item)
				})
				WebRTC.in(`${selfInfo.companyname}ready`).emit(
					'namelist',
					socketidlist
				)
				//當有人入房，所有人會收到一張最新人員名單
				console.log(socketidlist)
			})
	})

	// console.log(WebRTC.sockets.size)

	// people.join('chartRoom')

	people.on('sendOffer', (offerData) => {
		let sendto = offerData[1]

		WebRTC.to(sendto).emit('receiveOffer', offerData)

		// people.to(`${selfInfo.companyname}`).emit('offer', offers)
	})

	people.on('sendAnswer', (answerData) => {
		let sendto = answerData[1]
		console.log(answerData[0])
		WebRTC.to(sendto).emit('receiveAnswer', answerData)
	})

	people.on('hangup', (hangupID) => {
		console.log(hangupID)
		// let indexofleave  = socketidlist.indexOf(hangupID)
		// socketidlist.splice(indexofleave,0)
		socketidlist = []
		people.leave(`${selfInfo.companyname}ready`)
		people.join(selfInfo.companyname)
		WebRTC.to(`${selfInfo.companyname}ready`).emit('leaved', people.id)

		// WebRTC.in(`${selfInfo.companyname}ready`).emit('namelist', socketidlist)
		// console.log(socketidlist)
	})
	// people.on('leaveRoom',(leaveID)=>{
	// 	WebRTC.in(`${selfInfo.companyname}ready`).emit('haveLeave', leaveID)

	// 	people.join(selfInfo.companyname)
	// 	socketidlist = []
	// })

	people.on('disconnect', () => {
		//for use F5
		// let leave : string= people.id
		// let indexofleave  = socketidlist.indexOf(leave)
		// socketidlist.splice(indexofleave,0)
		socketidlist = []
		WebRTC.to(`${selfInfo.companyname}ready`).emit('leaved', people.id)
		// WebRTC.to(`${selfInfo.companyname}ready`).emit('leave', people.id)
	})
})

// Run when client connects
let chat = io.of('/chat')
chat.on('connection', function (socket) {
	socket.emit('sessionsend', sessions)

	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room)

		socket.join(user.room)

		// Welcome current user
		socket.emit('message', formatMessage(botName, '你真係好鍾意返工!'))

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(botName, `${user.username} has joined the chat`)
			)

		// Send users and room info
		chat.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		})
	})

	// Listen for chatMessage
	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id)

		chat.to(user.room).emit('message', formatMessage(user.username, msg))
	})

	// Runs when client disconnects
	socket.on('disconnect', () => {
		const user = userLeave(socket.id)

		if (user) {
			chat.to(user.room).emit(
				'message',
				formatMessage(botName, `${user.username} has left the chat`)
			)

			// Send users and room info
			chat.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			})
		}
	})
})

app.use(isLogin, express.static('private'))
// app.use(isManager, express.static('manager'))
app.use('/ing', express.static('img'))

// io.listen(8000)
// const socket =
server.listen(8000, function () {
	console.log('https server listening on port 8000')
})
