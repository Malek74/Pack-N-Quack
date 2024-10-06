import express from "express";
import { getProducts, createProduct, getProductByID, updateProduct, searchProduct, editProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();
router.get("/", getProducts);
router.post("/", createProduct);
router.get("/productDetails/:id", getProductByID);
router.put("/:id", updateProduct);
router.get("/search", searchProduct);
router.put("/update/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

export default router;

