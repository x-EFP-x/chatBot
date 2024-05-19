import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from 'morgan';
import express from 'express';
import chatbotRouter from './routes/chatbot.js';

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.json());
app.use(logger('dev'));

app.use('/', chatbotRouter);

io.on('connection', ()=>{
  console.log(' se ha conectado un usuario')
})

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

export { io };
