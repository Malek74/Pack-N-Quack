import advertiser from "../models/AdvertiserSchema.js";

export const addAdvertiser = async (req, res) => {
    const { email, username, password } = req.body;
    const advertiserExists = await advertiser.findOne({ email });

    if (advertiserExists) {
        return res.status(400).json({ message: "Advertiser already exists" });
    }

    const usernameExists = await advertiser.findOne({ username });

    if (usernameExists) {
        return res.status(400).json({ message: "Username already taken" });
    }

    const newAdvertiser = new advertiser({ email, username, password });
    try {
        const a = await newAdvertiser.save();
        res.status(200).json(a);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getAdvertisers = async (req, res) => {
    try {
        const advertisers = await advertiser.find({});
        res.status(200).json(advertisers);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}