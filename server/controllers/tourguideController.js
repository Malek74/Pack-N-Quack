import tourGuide from '../models/tourGuideSchema.js';

//@desc Create a new tour guide
//@route POST /api/tourGuide
//@access Public
export const createTourGuide = async (req, res) => {
    const { email, username, password, mobile, experienceYears, previousWork } = req.body;

    const tourGuideExists = await tourGuide.findOne({ email: email });

    // Check if all required fields are present
    if (!email || !username || !password) {
        return res.status(400).json({ message: "Email, username, and password are required." });
    }
    if (tourGuideExists) {
        res.status(400).json({ message: "Tour Guide already exists" });
    }

    try {
        const newTourGuide = await tourGuide.create({ email: email, username, password, mobile, experienceYears, previousWork });
        res.status(201).json(newTourGuide);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

//@desc Get all tour guides
//@route GET /api/tourGuide
export const getTourGuides = async (req, res) => {
    try {
        const tourGuides = await tourGuide.find();
        res.status(200).json(tourGuides);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//@desc edit a tour guide
//@route PUT /api/tourGuide/:id
//@access Public
export const editTourGuide = async (req, res) => {
    try {
        const id = req.params.id;
        const { mobile, experienceYears, previousWork, isAccepted } = req.body;

        // Create an object with the fields to update
        const updatedFields = {};
        if (mobile) updatedFields.mobile = mobile;
        if (experienceYears) updatedFields.experienceYears = experienceYears;
        if (previousWork) updatedFields.previousWork = previousWork;
        if (isAccepted) updatedFields.isAccepted = isAccepted;

        // Check if the tour guide exists
        let tourGuideEdited = await tourGuide.findById(id);

        if (!tourGuideEdited) {
            return res.status(404).json({ message: "Tour guide doesn't exist" });
        }

        // Update the tour guide
        tourGuideEdited = await tourGuide.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
        console.log(updatedFields);
        console.log(id);
        // Send the updated tour guide data
        res.status(200).json(tourGuideEdited);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

