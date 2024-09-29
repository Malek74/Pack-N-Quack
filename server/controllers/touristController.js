import tourist from "../models/touristSchema.js";



// Creating Tourist for Registration
export const createTourist = async (req, res) => {
    const { email, username, password, mobile, dob, nationality, job, wallet } = req.body; 

    try {
        // Check if the email is already taken
        const existingTourist = await tourist.findOne({ email });

        if (existingTourist) {
            return res.status(400).json({ message: "Email already taken." });
        }

        // If the email is not taken, create a new tourist
        const newTourist = await tourist.create({ email, username, password, mobile, dob, nationality, job, wallet });
        res.status(200).json(newTourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Tourist view Profile
export const getTourist = async (req, res) => {
    const { email } = req.params; 

    try {
        //Find by email as it is unique identifier
        const touristProfile = await tourist.findOne({ email }); 

        res.status(200).json(touristProfile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Tourist update data
export const updateTourist = async (req, res) => {
    //DOB, Username,Wallet are not changable according to req.
    const { email, password, mobile, nationality, job } = req.body;
    const newEmail = req.body.email;

    try {
        // Check if the new email already exists in the database 
        if (newEmail) {
            const existingTourist = await tourist.findOne({ email: newEmail });
            if (existingTourist) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Update the tourist's data
         const updatedTourist = await tourist.findOneAndUpdate(
                { email },  
                { email: newEmail, password, mobile, nationality, job },  
                { new: true }  
            );
        
        res.status(200).json(updatedTourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

