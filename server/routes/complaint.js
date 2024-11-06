import express from "express"
import { createComplaint, getComplaints, viewMyComplaints, markComplaintResolved, markComplaintPending, replyToComplaint } from "../controllers/complaintController.js"

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/:id", viewMyComplaints);
router.put("/resolved/:id", markComplaintResolved);
router.put("/pending/:id", markComplaintPending);
router.put("/reply/:id", replyToComplaint);

export default router;