import express from "express";
import {getProducts,createProduct,getProductByID,updateProduct,searchProduct,sortProduct} from "../controllers/productController.js";

const router = express.Router();
router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductByID);
router.put("/:id", updateProduct);
router.get("/search", searchProduct);
router.get("/sort", sortProduct);

export default router;

