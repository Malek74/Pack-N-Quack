import product from "../models/productSchema.js";
import seller from "../models/sellerSchema.js";


//get product by ID
export const getProductByID = async (req, res) => {
    const { id } = req.params;
    console.log(id + "this is id");
    if (!id) {
        return res.status(400).json({ message: "Please provide a product ID" });
    }
    try {
        const searchedProduct = await product.findById(id);
        res.status(200).json(searchedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//create product
export const createProduct = async (req, res) => {
    const { name, price, description, seller_id, ratings, reviews, available_quantity } = req.body;
    if (!name || !price || !description || !seller_id || !available_quantity) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    try {
        const newproduct = await product.create({ name, price, description, seller_id, ratings, reviews, available_quantity });
        res.status(200).json(newproduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//update product by ID
export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, picture, price, description, seller_id, ratings, reviews, available_quantity } = req.body;

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
        if (available_quantity) {
            if (available_quantity > 0) {
                newInfo.available_quantity = available_quantity;
            } else {
                res.status(400).json({ message: "Please provide a valid quantity" });
            }
        }
        const newproduct = await product.findByIdAndUpdate(id, { $set: newInfo }, { new: true });
        res.status(200).json(newproduct);

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const searchProduct = async (req, res) => {
    const searchTerm = req.query.name;
    // console.log(req.query)


    try {
        const products = await product.find({
            name: { $regex: new RegExp(searchTerm, 'i') }
        });

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

//@desc get a single itinerary by id, category, or tag
//@route GET api/itinerary
export const getProducts = async (req, res) => {
    const name = req.query.name;
    const maxPrice = req.query.maxPrice;
    const minPrice = req.query.minPrice;
    const sortBy = req.query.sortBy;
    const order = req.query.order;

    let query = {}; // Create an object to build your query
    let sortOptions = {};

    try {
        // Build query based on input parameters

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = minPrice;
            } else {
                query.price.$gte = 0;
            }
            if (maxPrice) {
                query.price.$lte = maxPrice;
            } else {
                query.price.$lte = Number.MAX_SAFE_INTEGER;
            }
        }

        if (name) {
            query.name = name;
        }

        // Set sorting options if provided
        if (sortBy && order) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        console.log('Query:', query);
        console.log('Sort Options:', sortOptions);

        // Fetch the itinerary using the built query
        let products = await product.find(query).sort(sortOptions);

        if (products.length === 0) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        return res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server errors
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