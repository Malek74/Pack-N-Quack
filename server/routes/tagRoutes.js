// /routes/tagRoutes.js

import express from 'express';
import { createTag } from '../controllers/touristGovernorController.js'
import { isTourismGovernor } from '../middleware/auth.js'; // Import your middleware

const router = express.Router();

// Protect the createTag route with isTourismGovernor middleware
router.post('/tags', isTourismGovernor, createTag); // Only tourism governors can create tags

export default router;
