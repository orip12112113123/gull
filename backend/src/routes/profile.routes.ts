import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getProfile,
  updateProfile,
  addSkill,
  updateResume,
  exploreProfiles,
} from '../controllers/profile.controller';

const router = Router();

router.get('/explore', authenticateToken, exploreProfiles);
router.get('/:id', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);
router.post('/skills', authenticateToken, addSkill);
router.put('/resume', authenticateToken, updateResume);

export default router;
