import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMessages } from '../controllers/messageController';

const router = Router();

router.get('/:otherUserId', authenticate, getMessages);

export default router;
