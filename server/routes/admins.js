import express from "express";

import { getAdmins, addAdmin, deleteUser, getAllUsers, getPendingPasswordChangeRequests, handlePasswordChangeRequest, acceptOrReject } from "../controllers/adminsController.js";
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
router.get("/complaints", getComplaints);
router.get("/complaints/:id", viewComplaintById);
router.put("/complaints/pending/:id", markComplaintPending);
router.put("/complaints/resolved/:id", markComplaintResolved);
router.get("/deleteRequests", getDeleteRequests);
router.post("/confirmDelete", handleDeleteRequest)

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await adminModel.findOne({ username }) || await advertiserModel.findOne({ username });
    if (user) {
        console.log(password + " " + user.password);
        if (password === user.password) {
            const token = jwt.sign(
                { username: username, _id: user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2m" }
            )

            res.status(200).json({
                id: user._id,
                username: user.username,
                token: token,
            });
        } else {
            res.status(400).json({ message: "Incorrect password" });
        }
    } else {
        res.status(400).json({ message: "Username not found" });
    }
});

router.get("/verify", protect, (req, res) => {
    res.status(200).json(req.user);
});

router.get("/complaints", viewComplaints);
router.get("/complaints/:id", viewComplaintById);
router.put("/complaints/pending/:id", markComplaintPending);
router.put("/complaints/resolved/:id", markComplaintResolved);

export default router;