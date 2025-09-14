import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
  try {
    const sales_person = await prisma.user.findFirst({ where: { onboardingStatus: "success", role: "seller" } });

    if (!sales_person) return;

    const res = await prisma.product.deleteMany({
      where: { sales_person_id: sales_person.id },
    });

    console.log(res)
  } catch (error) {
    console.log(error);
  }
}

main();
