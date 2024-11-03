import adminModel from "../models/adminSchema.js";
import product from "../models/productSchema.js";
import seller from "../models/sellerSchema.js";


//get product by ID
export const getProductByID = async (req, res) => {
    const { id } = req.params;
    const isAdmin = adminModel.findById(id);


    console.log(id + "this is id");
    if (!id) {
        return res.status(400).json({ message: "Please provide a product ID" });
    }
    try {
        const searchedProduct = await product.findById(id).populate('seller_id');
        return res.status(200).json(searchedProduct);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

//create product
export const createProduct = async (req, res) => {

    const userID = req.body.id;
    console.log("SellerID: " + userID);
    const { name, price, description, available_quantity } = req.body;
    if (!name || !price || !description || !available_quantity) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const isAdmin = await adminModel.findById(userID);
    const isSeller = await seller.findById(userID);

    if (!isAdmin) {
        try {
            const newproduct = (await product.create({ name, price, description, available_quantity, sellerUsername: isSeller.username, seller_id: userID }));
            return res.status(200).json(newproduct);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    else {
        try {
            console.log("Admin Product");

            const sellerUsername = await seller.findById(userID).username;
            const newproduct = (await product.create({ name, price, description, available_quantity, sellerUsername: "VTP", adminSellerID: userID }));
            return res.status(200).json(newproduct);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { description, price,isArchived } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Please provide a product ID" });
    }
    try {
        const newproduct = await product.findByIdAndUpdate(id, { description, price,isArchived }, { new: true }).populate('seller_id');
        console.log(newproduct)
        return res.status(200).json(newproduct);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
//update product by ID
export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, picture, price, description, seller_id, ratings, reviews, available_quantity,product_sales, isArchived } = req.body;

    

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
        if (isArchived==true) {
            newInfo.isArchived = true;}
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
        
        const products = await product.findOne({name}).select('name product_sales available_quantity'); 
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
            query.name = { $regex: name, $options: 'i' };
        }

        // Set sorting options if provided
        if (sortBy && order) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        console.log('Query:', query);
        console.log('Sort Options:', sortOptions);

        // Fetch the itinerary using the built query
        let products = await product.find(query).sort(sortOptions).populate('seller_id');
         products= products.filter(product=> product.isArchived===false)

        return res.status(200).json(products);


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