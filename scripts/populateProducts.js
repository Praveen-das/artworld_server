import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
  try {
    await prisma.cart_item.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.transfer.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.inventory.deleteMany();

    const dummy_products = await import("./dummy_products.json", { with: { type: "json" } }).then((res) => res.default);
    const sales_person = await prisma.user.findFirst({ where: { onboardingStatus: "success", role: "seller" } });

    if (!sales_person) return;

    const transactions = dummy_products.map(({ quantity, ...item }) => {
      let inventory = {
        create: {
          availableQty: quantity,
        },
      };

      return prisma.product.create({
        data: { ...item, sales_person_id: sales_person.id, inventory },
        include: { inventory: true },
      });
    });

    const res = await prisma.$transaction(transactions);
  } catch (error) {
    console.log(error);
  }
}

main();
