import express from 'express';
import complaintModel from '../models/complaintScehma';

export const getComplaints = async (req, res) => {

    const { sortBy, order, status } = req.query;

    sortOptions = {}
    query = {}
    try {

        if (status) {
            query.status = status;
        }
        if (sortBy && order) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        }

        const complaints = await complaintModel.find(query).sort(sortOptions);
        return res.status(200).json(complaints);

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }

}

export const viewMyComplaints = async (req, res) => {
    const touristID = req.params.id;
    try {
        const complaints = await complaintModel.find({ issuer: touristID });
        return res.status(200).json(complaints);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}