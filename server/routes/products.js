import express from "express";
import { getProducts, createProduct, getMaxPrice, getProductByID, updateProduct, searchProduct, getMyProducts, editProduct, deleteProduct, allProductSwQ, eachProductSwQ } from "../controllers/productController.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();
router.get("/", getProducts);
router.post("/:id", upload.fields([{ name: 'images', maxCount: 10 }]), createProduct);
router.get("/productDetails/:id", getProductByID);
router.put("/:id", updateProduct);
router.get("/search", searchProduct);
router.put("/update/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/maxProductPrice", getMaxPrice);
router.get("/allSwQ", allProductSwQ);
router.get("/eachSwQ/:name", eachProductSwQ);
router.get("/myProducts/:id", getMyProducts);


export default router;


