import express from "express";
import { getProducts, createProduct, getProductByID, updateProduct, searchProduct } from "../controllers/productController.js";

const router = express.Router();
router.get("/", getProducts);
router.post("/", createProduct);
router.get("/productDetails/:id", getProductByID);
router.put("/:id", updateProduct);
router.get("/search", searchProduct);

export default router;

