import express from "express";
import { requestPasswordChange } from "../controllers/passChangeController.js";
import { protect } from "../middleware/authenticator.js";
const router = express.Router();

router.post("/:id", protect, requestPasswordChange);

export default router;
