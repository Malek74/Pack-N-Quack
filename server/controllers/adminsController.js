import admin from "../models/AdminSchema.js";
import tourGuide from "../models/tourGuideSchema.js";
import seller from "../models/sellerSchema.js";
import advertiser from "../models/advertiserSchema.js";
import touristGoverner from "../models/touristGovernor.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await admin.find({});
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const deletUser = async (req, res) => {
    const role = req.body.role;



    if (role === 'admin') {

        try {
            let adminToDelete = await admin.findById(id);
            if (!adminToDelete) {
                return res.status(404).json({ message: "User not found" }); // Change status code to 404
            }

            adminToDelete = await admin.findByIdAndDelete(id);
            res.status(201).json(adminToDelete);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    }


    if (role === 'tourGuide') {


        try {

            let adminToDelete = await tourGuide.findById(id);



            if (!adminToDelete) {
                return res.status(404).json({ message: "User not found" }); // Change status code to 404
            }

            adminToDelete = await tourGuide.findByIdAndDelete(id);
            res.status(201).json(adminToDelete);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    }

    if (role === 'seller') {

        try {

            let adminToDelete = await seller.findById(id);
            if (!adminToDelete) {
                return res.status(404).json({ message: "User not found" }); // Change status code to 404
            }

            adminToDelete = await seller.findByIdAndDelete(id);
            res.status(201).json(adminToDelete);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    }

    if (role === 'tourist') {


        try {

            let adminToDelete = await tourist.findById(id);



            if (!adminToDelete) {
                return res.status(404).json({ message: "User not found" }); // Change status code to 404
            }

            adminToDelete = await tourist.findByIdAndDelete(id);
            res.status(201).json(adminToDelete);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    }

    if (role === 'advertiser') {
        try {

            let adminToDelete = await advertiser.findById(id);



            if (!adminToDelete) {
                return res.status(404).json({ message: "User not found" }); // Change status code to 404
            }

            adminToDelete = await advertiser.findByIdAndDelete(id);
            res.status(201).json(adminToDelete);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    }

    if (role === 'toruismGovernor') {


        try {

            let adminToDelete = await touristGoverner.findById(id);



            if (!adminToDelete) {
                return res.status(404).json({ message: "User not found" }); // Change status code to 404
            }

            adminToDelete = await touristGoverner.findByIdAndDelete(id);
            res.status(201).json(adminToDelete);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    }
}