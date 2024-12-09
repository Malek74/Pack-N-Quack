import { showMyNotifications, markAsRead } from "../controllers/notificationsController.js";
import express from "express";
import { protect } from "../middleware/authenticator.js";

const router = express.Router();

router.get('/', protect, showMyNotifications);
router.put('/:id', markAsRead);

export default router;