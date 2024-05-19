import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getChatResponse = {
    chat: (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'chat', 'index.html'));
    },
    ping: (req, res) => {
        const userMessage = req.query.message || "Hola";
        const botResponse = `Bot: Recibí tu mensaje - "${userMessage}"`;

        res.json({ response: botResponse });
    }
};
