import express from "express";
import { getTags, addTag, deleteTag, updateTag } from "../controllers/itineraryTagsController.js";

const router = express.Router();

router.get("/", getTags);
router.post("/", addTag);
router.delete("/:name", deleteTag);
router.put("/:name", updateTag)

export default router;


//create new date and set its time
const startTime = new Date();
