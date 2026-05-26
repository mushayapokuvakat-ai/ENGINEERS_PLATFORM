import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { getPendingUsers, updateUserStatus, getSystemStats } from '../controllers/adminController';

const router = Router();

// Only ADMIN and SUB_ADMIN can access these routes
router.use(authenticate);
router.use(requireRole(['ADMIN', 'SUB_ADMIN']));

router.get('/pending-users', getPendingUsers);
router.put('/users/:targetUserId/status', updateUserStatus);
router.get('/stats', getSystemStats);

export default router;
