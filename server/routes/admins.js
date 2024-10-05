import express from "express";

import { getAdmins, addAdmin,deleteUser} from "../controllers/adminsController.js";
import admin from "../models/AdminSchema.js";
import advertiser from "../models/AdvertiserSchema.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authenticator.js";

const router = express.Router();
config();

router.get("/", getAdmins);
router.delete("/:id", deleteUser)

router.post("/", addAdmin);

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await admin.findOne({ username }) || await advertiser.findOne({ username });
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

export default router;