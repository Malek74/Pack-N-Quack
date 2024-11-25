import adminModel from "../models/adminSchema.js";
import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernorScehma.js";
import Seller from "../models/sellerSchema.js";
import Advertiser from "../models/advertiserSchema.js";
import { getUserRole, createToken } from "../utils/Helpers.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";

config();

export const login = async (req, res) => {
    const { username, password } = req.body;
    const role = await getUserRole(username);
    let user;
    if (!username || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (!role) {
        return res.status(400).json({ message: "Username not found" });
    }

    switch (role) {
        case "Admin":
            user = await adminModel.findOne({ username: username });
            break;

        case "Advertiser":
            user = await Advertiser.findOne({ username: username });
            break;

        case "Seller":
            user = await Seller.findOne({ username: username });
            break;

        case "Tourist":
            user = await Tourist.findOne({ username: username });
            break;

        case "Tour Guide":
            user = await TourGuide.findOne({ username: username });
            break;

        case "Tourism Governer":
            user = await TouristGovernor.findOne({ username: username });
            break;

        default:
            user = null;
            break;
    }

    if (!user) {
        return res.status(400).json({ message: "Username not found" });
    }

    // check if password is correct
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
        return res.status(400).json({ error: 'Incorrect password' });
    }

    // create token
    console.log(user._id);
    const token = createToken(user.username, user._id, role);

    //create cookie
    res.cookie('jwt', token, { httpOnly: true });

    return res.status(200).json({ user });


}

export const logout = (req, res) => {
    //clear the cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        path: '/'
    });
    return res.status(200).json({ message: "Logout successful" });
}