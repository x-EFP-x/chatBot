import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from 'morgan';
import express from 'express';
import chatbotRouter from './routes/chatbot.js';
import dotenv from 'dotenv'
import { createClient } from '@libsql/client';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});
const port = 3000;
const db = createClient({
  url:"libsql://caring-monstress-hard32x.turso.io",
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT
  )
  `)

app.use(express.json());
app.use(logger('dev'));

app.use('/', chatbotRouter);

io.on('connection', async (socket)=>{
  console.log('Se ha conectado un usuario');

  socket.on('disconnect', ()=>{
    console.log('Se ha desconectado un usuario');
  })

  socket.on('authentication', async(user)=>{
    try {
      const results = await db.execute({
        sql: 'SELECT id, content, user FROM messages WHERE id > ? AND user = ?',
        args: [socket.handshake.auth.serverOffset ?? 0, user?? 'Edwin']
      })

      results.rows.forEach(row => {
        socket.emit('message', row.content, row.id.toString())
      })
    }
    catch (e){
      console.error(e)
    }
  })

  socket.on('message', async(msg, username) => {
    let user = username || ' ';
    let result 
    try{
      result = await db.execute({
        sql: `INSERT INTO  messages (content, user) VALUES (:msg, :user)`,
        args: { msg, user }
      })
    } catch (e) {
      console.error(e);
      return
    }
    io.emit('message', msg, result.lastInsertRowid.toString(), username)
  })

  if(!socket.recovered){
    try {
      const results = await db.execute({
        sql: 'SELECT id, content, user FROM messages WHERE id > ? AND user = ?',
        args: [socket.handshake.auth.serverOffset ?? 0, socket.handshake.auth.username ?? '']
      })

      results.rows.forEach(row => {
        socket.emit('message', row.content, row.id.toString())
      })
    }
    catch (e){
      console.error(e)
    }
  }
})

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

export { io };
