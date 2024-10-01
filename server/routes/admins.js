import express from "express";
import { deletUser, getAdmins } from "../controllers/adminsController.js";

const router = express.Router();

router.get("/", getAdmins);
router.delete("/:id", deletUser)

export default router;