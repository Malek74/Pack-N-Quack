import adminModel from "../models/adminSchema.js";
import product from "../models/productSchema.js";
import seller from "../models/sellerSchema.js";
import Stripe from "stripe";
import { convertPrice, getConversionRate } from "../utils/Helpers.js";
import cloudinary from '../utils/cloudinary.js';

//get product by ID
export const getProductByID = async (req, res) => {
    const { id } = req.params;
    const isAdmin = adminModel.findById(id);
    const prefCurrency = req.body.prefCurrency;


    console.log(id + "this is id");
    if (!id) {
        return res.status(400).json({ message: "Please provide a product ID" });
    }
    try {
        const searchedProduct = await product.findById(id).populate('seller_id');
        const newPrice = convertPrice(searchedProduct.price, prefCurrency);
        searchedProduct.price = newPrice;
        return res.status(200).json(searchedProduct);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

//create product
export const createProduct = async (req, res) => {

    const userID = req.body.id;
    console.log("SellerID: " + userID);
    const { name, price, description, available_quantity, } = req.body;
    if (!name || !price || !description || !available_quantity) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    //create product on stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const productStripe = await stripe.products.create({
        name: name,
        description: description,
        default_price_data: {
            currency: "usd",
            unit_amount: price * 100,
        },
    });

    const isAdmin = await adminModel.findById(userID);
    const isSeller = await seller.findById(userID);

    const imagesUrls = [];

    // Upload each image to Cloudinary
    for (const file of req.files.uploadImages) { // Access files using 'uploadImages'
        try {
            const sanitizedPublicId = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-]/g, '');
            const publicId = sanitizedPublicId;

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        public_id: publicId,
                        overwrite: true,
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                            return reject(error);
                        }
                        resolve(result);
                    }
                );

                uploadStream.end(file.buffer);
            });

            imagesUrls.push(result.secure_url)
        }
        catch (error) {
            console.error("Error during image upload to Cloudinary:", error);
            return res.status(500).json({ message: 'Error uploading image to Cloudinary.', error });
        }

        if (!isAdmin) {
            try {

                const newproduct = (await product.create({ name, price, description, available_quantity, sellerUsername: isSeller.username, seller_id: userID, stripeID: productStripe.id, picture: imagesUrls }));
                return res.status(200).json(newproduct);
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }
        else {
            try {
                console.log("Admin Product");
                const sellerUsername = await seller.findById(userID).username;
                const newproduct = (await product.create({ name, price, description, available_quantity, sellerUsername: "VTP", adminSellerID: userID, stripeID: productStripe.id, picture: imagesUrls }));
                return res.status(200).json(newproduct);
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }
    }
}

export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { description, price, isArchived } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Please provide a product ID" });
    }
    try {
        const productEdited = await product.findById(id);
        if (!productEdited) {
            return res.status(404).json({ message: "Product not found" });
        }
        let imagesUrls = [];
        try {
            const sanitizedPublicId = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-]/g, '');
            const publicId = sanitizedPublicId;

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        public_id: publicId,
                        overwrite: true,
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                            return reject(error);
                        }
                        resolve(result);
                    }
                );

                uploadStream.end(file.buffer);
            });

            imagesUrls.push(result.secure_url)
        }
        catch (error) {
            console.error("Error during image upload to Cloudinary:", error);
            return res.status(500).json({ message: 'Error uploading image to Cloudinary.', error });
        }


        //attempt to update product on stripe
        try {

            ///create new price on stripe
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const newPrice = await stripe.prices.create({
                unit_amount: price * 100, // Price in cents
                currency: 'usd',
                product: productEdited.stripeID, // Replace with your actual product ID
            });


            const updatedProduct = await stripe.products.update(productEdited.stripeID, {
                description: description,
                default_price: newPrice.id,
            })
        }
        catch (error) {
            console.log(error);
        }

        if (imagesUrls.length == 0) {
            const newproduct = await product.findByIdAndUpdate(id, { description: description, price: price }, { new: true }).populate('seller_id');
        }
        else {
            const newproduct = await product.findByIdAndUpdate(id, { description: description, price: price, picture: imagesUrls }, { new: true }).populate('seller_id');
        }

        return res.status(200).json(newproduct);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

//update product by ID
export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, picture, price, description, seller_id, ratings, reviews, available_quantity, product_sales, isArchived } = req.body;



    const oldproduct = await product.findById(id);
    if (!oldproduct) {
        return res.status(404).json({ message: "Product not found" });
    }

    try {
        const newInfo = {};
        if (name) newInfo.name = name;
        if (picture) newInfo.picture = picture;
        if (price) newInfo.price = price;
        if (seller_id) {
            if (!seller.findById(seller_id)) {
                return res.status(404).json({ message: "New Seller not found" });
            } else {
                newInfo.seller_id = seller_id;
            }
        }
        if (description) newInfo.description = description;
        if (ratings) newInfo.ratings = ratings;
        if (reviews) newInfo.reviews = reviews;
        if (product_sales) newInfo.product_sales = product_sales;
        if (isArchived == true) {
            newInfo.isArchived = true;
        }
        else {
            newInfo.isArchived = false;
        }


        if (available_quantity) {
            if (available_quantity > 0) {
                newInfo.available_quantity = available_quantity;
            } else {
                return res.status(400).json({ message: "Please provide a valid quantity" });
            }
        }

        //create product on stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const productStripe = await stripe.products.create({
            name: name,
            description: description,
            default_price_data: {
                currency: "usd",
                unit_amount: price * 100,
            },
        });

        const newproduct = await product.findByIdAndUpdate(id, { $set: newInfo }, { new: true }).populate('seller_id');
        return res.status(200).json(newproduct);

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const searchProduct = async (req, res) => {
    const searchTerm = req.query.name;


    try {
        const products = await product.find({
            name: { $regex: new RegExp(searchTerm, 'i') }
        }).populate('seller_id');

        console.log(products);

        if (products.length > 0) {
            return res.status(200).json(products);

        } else {
            return res.status(404).json({ message: `No products found for the search term: ${searchTerm}` });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
        throw error;
    }
}
//get max price of product
export const getMaxPrice = async (req, res) => {
    try {
        // Fetch the max price of all unarchived products

        const result = await product.aggregate([
            { $group: { _id: null, maxPrice: { $max: "$price" } } }
        ]);
        if (result.length === 0) {
            res.json({ maxPrice: 0 });
        }
        res.json(result[0]);

    } catch (error) {
        console.error('Error fetching max price:', error);
        throw new Error('Failed to get max price');
    }
}

//@desc get a single itinerary by id, category, or tag
//@route GET api/itinerary
export const allProductSwQ = async (req, res) => {
    try {

        let products = await product.find({ $or: [{ isArchived: false }, { isArchived: { $exists: false } }] }).select('name product_sales available_quantity');
        // products = products.filter(product => product.isArchived == false);
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching product sales and quantities:", error);
        return res.status(500).json({ message: error.message });
    }
};



export const eachProductSwQ = async (req, res) => {
    const name = req.params.name;
    try {

        const products = await product.findOne({ name }).select('name product_sales available_quantity');
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products sales and quantities:", error);
        return res.status(500).json({ message: error.message });
    }
};



export const getProducts = async (req, res) => {
    const name = req.query.name;
    const maxPrice = req.query.maxPrice;
    const minPrice = req.query.minPrice;
    const sortBy = req.query.sortBy;
    const order = req.query.order;
    const prefCurrency = req.query.prefCurrency;
    console.log('Pref Currency:', prefCurrency);
    const isArchived = req.query.isArchived;
    console.log('Is Archived:', isArchived);

    let query = {}; // Create an object to build your query
    let sortOptions = {};

    try {
        // Build query based on input parameters
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                //parseInt converts string to integer
                query.price.$gte = parseInt(minPrice);
            } else {
                query.price.$gte = 0;
            }
            if (maxPrice) {
                query.price.$lte = parseInt(maxPrice);
            } else {
                query.price.$lte = Number.MAX_SAFE_INTEGER;
            }
        }

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        console.log(isArchived);
        if (isArchived) {
            if (isArchived === 'true' || isArchived === 'false') {
                query.isArchived = isArchived === 'true';
            }
        }

        // Set sorting options if provided
        if (sortBy && order) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }
        const baseCurrency = prefCurrency || 'USD';
        console.log('Query:', query);
        console.log('Sort Options:', sortOptions);

        // Assume conversionRate is fetched from an API beforehand
        const conversionRate = await getConversionRate(baseCurrency);
        console.log('Conversion Rate:', conversionRate);
        const products = await product.find(query).sort(sortOptions).populate('seller_id');

        // Convert prices to preferred currency
        const convertedProducts = products.map(product => {
            product.price *= conversionRate;
            return product;
        })

        console.log('Converted Products:', convertedProducts);


        return res.json(convertedProducts);

    } catch (error) {
        return res.status(500).json({ message: error.message }); // Handle server errors
    }
};


/*//get all products
export const getProducts = async (req, res) => {
    try {
        const products = await product.find();
        res.status(200).json(products)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
*/

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Please provide a product ID" });
    }
    try {
        const deletedProduct = await product.findByIdAndDelete(id);
        return res.status(200).json(deletedProduct);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}