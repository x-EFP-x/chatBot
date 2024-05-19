import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from 'morgan';
import express from 'express';
import chatbotRouter from './routes/chatbot.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});
const port = 3000;

app.use(express.json());
app.use(logger('dev'));

app.use('/', chatbotRouter);

io.on('connection', (socket)=>{
  console.log('Se ha conectado un usuario');

  socket.on('disconnect', ()=>{
    console.log('Se ha desconectado un usuario')
  })

  socket.on('message', (msg) => {
    io.emit('message', msg),
    console.log(msg);
  })
})

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

export { io };
