import express from "express";
import { getTags, addTag, deleteTag, updateTag } from "../controllers/itineraryTagsController.js";

const router = express.Router();

router.get("/", getTags);
router.post("/", addTag);
router.delete("/:id", deleteTag);
router.put("/:id", updateTag)

export default router;