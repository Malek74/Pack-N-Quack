import express from 'express';
import { convertCurrency, getCurrencies } from '../controllers/currencyController.js';

const router = express.Router();

router.get('/', getCurrencies)
router.get('/convert/:id', convertCurrency);

export default router;