import express from 'express';
import { confirmPayment } from '../controllers/webhook.js';

const router = express.Router();

router.post('/', confirmPayment)

export default router;
