import express from 'express';

import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post("/signup", rateLimiter, signup);
router.post("/login",rateLimiter, login);
router.post("/logout", logout);

router.post("/update-profile",protectRoute, rateLimiter, updateProfile);
router.get("/check", protectRoute, checkAuth)

export default router;