import express from "express"
import { createComplaint, getComplaints, markComplaintResolved, markComplaintPending, replyToComplaint, viewComplaintById } from "../controllers/complaintController.js"

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/:id", viewComplaintById);
router.put("/resolved/:id", markComplaintResolved);
router.put("/pending/:id", markComplaintPending);
router.put("/reply/:id", replyToComplaint);

export default router;