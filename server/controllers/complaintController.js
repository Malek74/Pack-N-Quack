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

export const viewMyComplaints = async (req, res) => {
    const complaintId = req.params.id;
    try {
        const complaints = await complaintModel.findById(complaintId);
        return res.status(200).json(complaints);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const createComplaint = async (req, res) => {
    const {issuer, title, body} = req.body;
    
    if(!issuer){
        return res.status(400).json({message:"Issuer ID is required"});
    }
    if(!title){
        return res.status(400).json({message:"Title is required"});
    }
    if(!body){
        return res.status(400).json({message:"Body is required"});
    }
    const issuerExists = await touristModel.findById(issuer);
    if (!issuerExists) {
        return res.status(400).json({message: "Issuer not found"});
    }

    try {
        const newComplaint = await complaintModel.create({issuer, title, body});
        return res.status(200).json(newComplaint);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const markComplaintResolved = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({message:"Complaint ID is required"});
    }
    try {
        const complaint = await complaintModel.findById(id);
        complaint.status = "resolved";
        await complaint.save();
        res.status(200).json(complaint);    
    }
    catch(error){
        return res.status(400).json({ message: error.message });
    }
}

export const markComplaintPending = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({message:"Complaint ID is required"});
    }
    try {
        const complaint = await complaintModel.findById(id);
        complaint.status = "pending";
        await complaint.save();
        res.status(200).json(complaint);
    }
    catch(error){
        return res.status(400).json({ message: error.message });
    }
}

export const replyToComplaint = async (req, res) => {
    const {id} = req.params;
    const reply = req.body.reply;
    if(!id){
        return res.status(400).json({message:"Complaint ID is required"});
    }
    if(!reply){
        return res.status(400).json({message:"Reply is required"});
    }
    try {
        const complaint = await complaintModel.findById(id);
        complaint.reply = reply;
        await complaint.save();
        return res.status(200).json(complaint);
    }
    catch(error){
        return res.status(400).json({ message: error.message });
    }
}


