import express from "express";

import { getAdmins, addAdmin, deleteUser, getAllUsers, getPendingPasswordChangeRequests, handlePasswordChangeRequest, acceptOrReject, adminCreatePromoCode,getTotalUsersNum,getTotalNewUsersCount } from "../controllers/adminsController.js";
import adminModel from "../models/adminSchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authenticator.js";
import { getComplaints, viewComplaintById, markComplaintPending, markComplaintResolved, viewComplaints } from "../controllers/complaintController.js";
import { getDeleteRequests, handleDeleteRequest } from "../controllers/deleteRequestsController.js";

const router = express.Router();
config();

router.get("/", getAdmins);
router.delete("/:id", deleteUser)
router.get("/users", getAllUsers)
router.post("/", addAdmin);
router.get("/getpending", getPendingPasswordChangeRequests);
router.post("/reviewreq", handlePasswordChangeRequest);
router.put("/isAccepted", acceptOrReject);

router.get("/deleteRequests", getDeleteRequests);
router.post("/confirmDelete", handleDeleteRequest);
router.get("/sum", getTotalUsersNum);
router.get("/newsum", getTotalNewUsersCount);

router.get("/complaints", viewComplaints);
router.get("/complaints/:id", viewComplaintById);
router.put("/complaints/pending/:id", markComplaintPending);
router.put("/complaints/resolved/:id", markComplaintResolved);
router.post("/createPromocode", adminCreatePromoCode);

export default router;


