import express from 'express';
import axios from "axios";
import tourist from '../models/touristSchema.js';


export const getCurrencies = async (req, res) => {

    try {
        const currencies = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXHANGE_RATE_API_KEY}/codes`);
        const codes = currencies.data.supported_codes;
        return res.status(200).json(codes);
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

//@route GET /api/currency/convert/:id
export const convertCurrency = async (req, res) => {

    const amount = (req.body.amount) * 1.00;
    const prefCurrency = req.body.currency;
    console.log(amount);

    if (!req.body.amount) {
        return res.status(400).json({ message: 'Please add an amount' });
    }

    try {
        const currencyConversion = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXHANGE_RATE_API_KEY}/pair/USD/${prefCurrency}/${amount}`);
        return res.status(200).json(currencyConversion.data.conversion_result);
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
