import express from "express"
import { createComplaint, getComplaints, markComplaintResolved, markComplaintPending, replyToComplaint, viewComplaintById } from "../controllers/complaintController.js"
import { protect } from "../middleware/authenticator.js";

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/", getComplaints);
router.get("/:id", viewComplaintById);
router.put("/resolved/:id", markComplaintResolved);
router.put("/pending/:id", markComplaintPending);
router.put("/reply/:id", replyToComplaint);

export default router;