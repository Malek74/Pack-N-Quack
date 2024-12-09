import express from 'express';
import complaintModel from '../models/complaintSchema.js';
import touristModel from '../models/touristSchema.js';
import e from 'express';
import tourist from '../models/touristSchema.js';

export const getComplaints = async (req, res) => {
    try {
        const complaints = await complaintModel.find();
        return res.status(200).json(complaints);

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }

}

export const viewComplaints = async (req, res) => {
    const status = req.query.statusFilter;
    const sort = req.query.sortBy;
    // console.log(status,sort);
    try {
        let query = {};
        let sortQuery = {};
        if (status !== 'undefined') {
            query.status = status;
        }
        if (sort !== 'undefined') {
            sortQuery.createdAt = sort === 'asc' ? 1 : -1;
        }
        const complaints = await complaintModel.find(query).sort(sortQuery);
        return res.status(200).json(complaints);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const viewComplaintById = async (req, res) => {
    const complaintId = req.params.id;
    try {
        const complaints = await complaintModel.findById(complaintId);
        return res.status(200).json(complaints);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const viewMyComplaints = async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const user = await touristModel.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const complaints = await complaintModel.find({ issuerID: userId });
        return res.status(200).json(complaints);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const createComplaint = async (req, res) => {
    const { title, body } = req.body;
    console.log(req.body);

    const issuerID = req.user._id;

    if (!issuerID) {
        return res.status(400).json({ message: "Issuer ID is required" });
    }
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    if (!body) {
        return res.status(400).json({ message: "Body is required" });
    }
    const issuerExists = await touristModel.findById(issuerID);
    if (!issuerExists) {
        return res.status(400).json({ message: "Issuer not found" });
    }

    try {
        const newComplaint = await complaintModel.create({ issuerID, title, body });
        return res.status(200).json(newComplaint);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const markComplaintResolved = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Complaint ID is required" });
    }
    try {
        const complaint = await complaintModel.findByIdAndUpdate(id, { status: "resolved" }, { new: true });
        res.status(200).json(complaint);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const markComplaintPending = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Complaint ID is required" });
    }
    try {
        const complaint = await complaintModel.findByIdAndUpdate(id, { status: "pending" }, { new: true });
        res.status(200).json(complaint);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const replyToComplaint = async (req, res) => {
    const { id } = req.params;
    const reply = req.body.reply;
    console.log(reply);
    if (!id) {
        return res.status(400).json({ message: "Complaint ID is required" });
    }
    if (!reply) {
        return res.status(400).json({ message: "Reply is required" });
    }
    try {
        const complaint = await complaintModel.findByIdAndUpdate(id, { $push: { reply: reply } }, { new: true });
        return res.status(200).json(complaint);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
}


