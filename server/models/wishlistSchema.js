import {Schema, model} from 'mongoose';

const wishlistSchema = new Schema({
    touristtId: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },

    product: {
        type: [Schema.Types.ObjectId],
        ref: 'Product',
        required: false,
        default: []
    },
});

const Wishlist = model('Wishlist', wishlistSchema);

export default Wishlist;
    
