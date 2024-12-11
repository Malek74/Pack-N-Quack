import express from "express";
import { getProducts, createProduct, getMaxPrice, getProductByID, updateProduct, searchProduct, getMyProducts, editProduct, deleteProduct, allProductSwQ, eachProductSwQ } from "../controllers/productController.js";
import { upload } from "../middleware/multer.js";
import { protect } from '../middleware/authenticator.js';

const router = express.Router();
router.get("/", getProducts);
router.post("/",protect, upload.fields([{ name: 'images', maxCount: 10 }]), createProduct);
router.get("/productDetails", getProductByID);
router.put("/",protect, updateProduct);
router.get("/search", protect,searchProduct);
router.put("/update/:id",protect, editProduct);
router.delete("/delete/:id", protect,deleteProduct);
router.get("/maxProductPrice", protect,getMaxPrice);
router.get("/allSwQ", protect,allProductSwQ);
router.get("/eachSwQ/:name",protect, eachProductSwQ);
router.get("/myProducts",protect, getMyProducts);

export default router;


