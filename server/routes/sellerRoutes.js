import express from 'express';
import { 
    createSeller,

} from '../controllers/sellerController.js';


const router = express.Router();

router.post('/seller', createSeller); // Create



export default router;