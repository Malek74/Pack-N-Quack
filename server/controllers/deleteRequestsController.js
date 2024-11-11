import DeleteRequest from '../models/deleteRequests.js';

//get all delete requests
export const getDeleteRequests = async (req, res) => {
    try {
        const deleteRequests = await DeleteRequest.find({}).populate('touristID sellerID tourGuideID advertiserID');
        res.status(200).json(deleteRequests);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

