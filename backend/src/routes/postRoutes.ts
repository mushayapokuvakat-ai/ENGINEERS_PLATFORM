import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createPost, getPosts, createComment } from '../controllers/postController';

const router = Router();

router.get('/', authenticate, getPosts);
router.post('/', authenticate, createPost);
router.post('/:postId/comments', authenticate, createComment);

export default router;
