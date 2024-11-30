import mongoose from 'mongoose';

const promoCodesSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    // startDate: {
    //     type: Date,
    //     required: true
    // },
    // endDate: {
    //     type: Date,
    //     required: true
    // },
    isActive: {
        type: Boolean,
        default: true
    },
    isBirthDay: {
        type: Boolean,
        default: false
    },
    stripeID: {
        type: String,
        default: ''
    }
});
const PromoCodes = mongoose.model('PromoCodes', promoCodesSchema);
export default PromoCodes;