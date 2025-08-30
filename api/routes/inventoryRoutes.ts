import express from "express";
// import limiter from "./rateLimiter";
import { reserveStock, releaseStock, consumeStock, createInventory } from "../controller/inventoryController";

const router = express.Router();

router.post("/create", createInventory);
router.post("/reserve", reserveStock);
router.post("/release", releaseStock);
router.post("/consume", consumeStock);

export default router;
