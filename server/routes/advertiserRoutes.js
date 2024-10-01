import express from 'express';
import { 
    createAdvertiser,

} from '../controllers/advertiserController.js';


const router = express.Router();

router.post('/advertiser', createAdvertiser); // Create



export default router;