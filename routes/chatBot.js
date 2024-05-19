import { Router } from 'express';
import { getChatResponse} from '../controllers/chatbotController.js';

const router = Router();

router.get('/', getChatResponse.chat);

router.get('/chat', getChatResponse.ping);

export default router;
