import express from 'express';
import http from 'http';
import {Server as SocketIO} from 'socket.io';
import {logger} from './logger';
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const client = new Client({
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
});

client.connect();


const app = express();
const server = new http.Server(app);
const io = new SocketIO(server);

io.on('connection', function (socket) {
    io.emit('connection', "socket");
});

app.get('/event', async function (req, res) {
    try{
		let result;
		result = await client.query(`SELECT * FROM schedule`)
	    res.send(result.rows)
    }catch(err){
		res.send([])
    }
});

app.post('/event', async function (req, res) {
   try{
    await client.query(`
    INSERT INTO schedule (staffid, event, date, time, created_at, updated_at) VALUES (getid, $1, $2, $3, NOW(), NOW()) returning id`,
    [whatevent, whatdate, whattime])
    res.end()
   }catch(err){
    logger.error(err)
   } 
});


app.use(express.static('private'))

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
});