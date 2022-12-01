import express from "express";
import controller from "../controller/cartController";

const router = express.Router();

const {
  fetchUserCart,
  addToCart,
  removeFromCart,
  updateCart,
  clearUserCart
} = controller;

router.get("/", fetchUserCart);
router.post("/", addToCart);
router.put("/update/:id", updateCart);
router.delete("/delete/:id", removeFromCart);
router.delete("/clear", clearUserCart);

/*----------->> ERROR HANDLER <<-----------*/
router.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
  res.status(400).send(err.message);
});

export default router;
