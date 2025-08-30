import express from "express";
import controller from "../controller/salesOrderController";

const router = express.Router();

const {
  getSalesOrderByUserId,
  createSalesOrder,
  getOrdersByUserId,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
  dismisOrder,
} = controller;

router.get("/", getOrdersByUserId);
router.put("/:id", updateOrder);
router.patch("/status", updateOrderStatus);
router.get("/sales", getSalesOrderByUserId);
router.post("/create", createSalesOrder);
router.patch("/cancel/:id", cancelOrder);
router.post("/dismis/:id", dismisOrder);


/*----------->> ERROR HANDLER <<-----------*/
router.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
});


export default router;
