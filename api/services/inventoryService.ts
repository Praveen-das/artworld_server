import { Prisma } from "@prisma/client";
import db from "../config/prismaClient";

type ReturnTypes = {
  id: string;
  availableQty: number;
  reservedQty: number;
  product: {
    id: string;
    price: number;
    discount: number;
    salesPersonId: string;
    salesPersonAccountId: string;
  };
};

export async function getInventoryWithLock(productId: string, tx: Prisma.TransactionClient) {
  const inventory = await tx.$queryRawUnsafe<ReturnTypes[]>(
    `
    SELECT
      inv.id AS "id",
      inv."availableQty" AS "availableQty",
      inv."reservedQty" AS "reservedQty",
      json_build_object(
        'id', p.id,
        'price', p.price,
        'discount', p.discount,
        'salesPersonId',u.id, 
	      'salesPersonAccountId',la."accountId"
      ) AS "product"
    FROM "Inventory" inv
    JOIN "Product" p on inv."productId" = p."id"
    LEFT JOIN "User" u ON p."sales_person_id" = u."id"
    LEFT JOIN "linked_account" la ON la."userId" = u."id"
    WHERE p.id = $1
    `,
    productId
  );

  return inventory;
}

export async function updateInventory(id: string, data: any, tx: Prisma.TransactionClient) {
  return await tx.inventory.update({ where: { id }, data });
}

export async function _reserveStock(productId:string,quantity:number) {
  if (!productId || !quantity) throw new Error("Invalid input");

  const result = await db.$transaction(async (tx) => {
    const item = await getInventoryWithLock(productId, tx);
    const inv = item[0];

    if (!inv) {
      throw new Error(`Inventory not found for product ${productId}`);
    }

    if (inv.availableQty < quantity) {
      throw new Error(`Insufficient stock for product ${productId}`);
    }

    await updateInventory(
      inv.id,
      {
        availableQty: inv.availableQty - quantity,
        reservedQty: inv.reservedQty + quantity,
      },
      tx
    );

    return inv
  });

  return result;
}

export async function _consumeStock(productId:string,quantity:number) {
  if (!productId || !quantity) throw new Error("Invalid input");

  const result = await db.$transaction(async (tx) => {
    const item = await getInventoryWithLock(productId, tx);
    const inv = item[0];

    if (!inv) {
      throw new Error(`Inventory not found for product ${productId}`);
    }

    return await updateInventory(
      inv.id,
      {
        reservedQty: inv.reservedQty - quantity,
      },
      tx
    );
  });

  return result;
}

export async function _releaseStock(productId:string,quantity:number) {
  if (!productId || !quantity) throw new Error("Invalid input");

  const result = await db.$transaction(async (tx) => {
    const item = await getInventoryWithLock(productId, tx);
    const inv = item[0];

    if (!inv) {
      throw new Error(`Inventory not found for product ${productId}`);
    }

    return await updateInventory(
      inv.id,
      {
        availableQty: inv.availableQty + quantity,
        reservedQty: inv.reservedQty - quantity,
      },
      tx
    );
  });

  return result;
}
