import { Router } from "express";
import controller from "../controller/productController";

const router = Router();

const {
  fetchProducts,
  fetchProductById,
  addProduct,
  removeProduct,
  updateProduct,
  searchProductByName,
  fetchFilterParams,
  fetchTopSellingProducts
} = controller;

router.get("/", fetchProducts);
router.get("/fetch", fetchFilterParams);
router.get("/categories", fetchFilterParams);
router.post("/add", addProduct);
router.get("/search", searchProductByName);

router.get("/topselling", fetchTopSellingProducts);

router.get("/latest", (req, res, next) => {
  req.query.orderBy = {
    createdAt: 'desc'
  }
  fetchProducts(req, res, next)
});

router.route("/:id")
  .get(fetchProductById)
  .put(updateProduct)
  .delete(removeProduct);


/*----------->> ERROR HANDLER <<-----------*/
router.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
  res.status(400).send(err.message);
});

export default router;
