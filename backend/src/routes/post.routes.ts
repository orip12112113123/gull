import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  createPost,
  getFeed,
  likePost,
  unlikePost,
  commentOnPost,
} from '../controllers/post.controller';

const router = Router();

router.post('/', authenticateToken, createPost);
router.get('/feed', authenticateToken, getFeed);
router.post('/:postId/like', authenticateToken, likePost);
router.delete('/:postId/like', authenticateToken, unlikePost);
router.post('/:postId/comments', authenticateToken, commentOnPost);

export default router;
