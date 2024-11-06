import activityModel from "../models/activitySchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import { usernameExists, emailExists } from "../utils/Helpers.js";

export const addAdvertiser = async (req, res) => {
    const { email, username, password } = req.body;

    const doesEmailExists = await emailExists(email);
    if (doesEmailExists) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const doesUsernameExists = await usernameExists(username);
    if (doesUsernameExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const newAdvertiser = new advertiserModel({ email, username, password });
    try {
        const advertiser = await newAdvertiser.save();
        return res.status(200).json(advertiser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getAdvertisers = async (req, res) => {
    try {
        const advertisers = await advertiserModel.find({});
        return res.status(200).json(advertisers);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// @desc Get a single advertiser
// @route GET /api/advertisers/:id
// @params id of advertiser
export const getAdvertiser = async (req, res) => {
    const id = req.params.id;
    try {
        const advertiser = await advertiserModel.findById(id);
        res.status(200).json(advertiser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Delete an advertiser
// @route DELETE /api/advertisers/delete/:id
// @params id of advertiser
export const deleteAdvertiser = async (req, res) => {
    const id = req.params.id;
    try {
        const activitiesByAdvertiser = await activityModel.deleteMany({ advertiserID: id });
        console.log(activitiesByAdvertiser.deletedCount, 'activities deleted');
        const deletedAdvertiser = await advertiserModel.findByIdAndDelete(id);
        res.status(200).json(deletedAdvertiser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Update an advertiser
// @route PUT /api/advertisers/edit/:id
// @params id of advertiser
// @Body { companyName, email, username, password, website, hotline, establishmentDate, description, isAccepted }
export const updateAdvertiser = async (req, res) => {
    const id = req.params.id;
    if (req.body.email != req.body.oldEmail) {
        const doesEmailExists = await emailExists(req.body.email);
        if (doesEmailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }
    }
    try {
        const updatedAdvertiser = await advertiserModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedAdvertiser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Get created activities of advertiser
// @route GET /api/advertisers/activities/:id
// @params id of advertiser
export const getAdvertiserActivities = async (req, res) => {
    const id = req.params.id;
    try {
        const activities = await activityModel.find({ advertiserID: id }).populate('advertiserID categoryID tags');
        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const acceptTerms = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Advertiser ID is required." });
    }
    try{
        const advertiser = await advertiserModel.findById(id);
        if(!advertiser){
            return res.status(404).json({ message: "Advertiser not found." });
        }
        const newAdvertiser = await advertiserModel.findByIdAndUpdate(id,{hasAcceptedTerms: true}, {new: true})
        return res.status(200).json(newAdvertiser);
    }
    catch(error){
        return res.status(404).json({ message: error.message });
    }
}