import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createProject, getProjects, joinProject, updateProjectMemberStatus } from '../controllers/projectController';

const router = Router();

router.get('/', authenticate, getProjects);
router.post('/', authenticate, createProject);
router.post('/:projectId/join', authenticate, joinProject);
router.put('/:projectId/members/:memberId/status', authenticate, updateProjectMemberStatus);

export default router;
