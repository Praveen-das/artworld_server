import { Request, Response } from "express";
import prisma from "../db/prisma";

import {
  _consumeStock,
  _releaseStock,
  _reserveStock,
  getInventoryWithLock,
  updateInventory,
} from "../services/inventoryService";

export async function createInventory(req: Request, res: Response) {
  const { productId, availableQty } = req.body;

  if (!productId || typeof availableQty !== "number" || availableQty < 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const existing = await prisma.inventory.findUnique({
      where: {
        productId,
      },
    });

    if (existing) {
      return res.status(409).json({ error: "Inventory already exists for this product" });
    }

    const newInventory = await prisma.inventory.create({
      data: {
        productId,
        availableQty,
      },
    });

    res.status(201).json(newInventory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function reserveStock(req: Request, res: Response) {
  const { productId, quantity } = req.body;

  try {
    const result = await _reserveStock(productId, quantity);
    res.status(200).json({ message: "Reserved", data: result });
  } catch (e: any) {
    res.status(409).json({ error: e.message });
  }
}

export async function consumeStock(req: Request, res: Response) {
  const { productId, quantity } = req.body;

  try {
    const result = await _consumeStock(productId, quantity);

    res.status(200).json({ message: "Consumed", data: result });
  } catch (e: any) {
    res.status(409).json({ error: e.message });
  }
}

export async function releaseStock(req: Request, res: Response) {
  const orders = req.body;

  try {
    for (let order of orders) {
      const result = await _releaseStock(order.productId, order.quantity);
    }

    res.status(200).json({ message: "Released" });
  } catch (e: any) {
    res.status(409).json({ error: e.message });
  }
}
