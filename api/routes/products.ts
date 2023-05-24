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
router.post("/add", addProduct);
router.get("/search", searchProductByName);

router.get("/popular", (req, res, next) => {
  const { limit } = req.query
  const filter = {
    o: {
      item: 'rating',
      value: 'desc'
    },
    limit
  }
  req.query = filter
  fetchProducts(req, res, next)
});

router.get("/latest", (req, res, next) => {
  const { limit } = req.query
  const filter = {
    o: {
      item: 'createdAt',
      value: 'desc'
    },
    limit
  }
  req.query = filter
  fetchProducts(req, res, next)
});

router.get("/:id", fetchProductById);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);


/*----------->> ERROR HANDLER <<-----------*/
router.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
  res.status(400).send(err.message);
});

export default router;
