import express from "express";
import { deleteUser, getAdmins } from "../controllers/adminsController.js";

const router = express.Router();

router.get("/", getAdmins);
router.delete("/:id", deleteUser)

export default router;