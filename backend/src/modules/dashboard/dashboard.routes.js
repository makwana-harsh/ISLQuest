import { Router } from 'express';
import { getStats } from './dashboard.controller.js';

const router = Router();

// Public: Accessible on landing page and user dashboard
router.get('/stats', getStats);

export default router;