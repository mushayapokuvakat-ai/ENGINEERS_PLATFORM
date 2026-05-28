import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getProfile, updateProfile } from '../controllers/profileController';

const router = Router();

router.get('/me', authenticate, getProfile);
router.get('/:userId', authenticate, getProfile);
router.put('/', authenticate, updateProfile);

export default router;
