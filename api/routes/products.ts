import express from "express";
import controller from "../controller/productController";

const router = express.Router();

const {
  fetchProducts,
  fetchProductById,
  addProduct,
  removeProduct,
  updateProduct,
  searchProductByName,
} = controller;

router.get("/", fetchProducts);
router.get("/:id", fetchProductById);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);
router.get("/search", searchProductByName);

/*----------->> ERROR HANDLER <<-----------*/
router.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
  res.status(400).send(err.message);
});

export default router;
