import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function main() {
  try {
    const user = await prisma.user.findFirst({ where: { onboardingStatus: "success", role: "seller" } });
    if (!user) return;
    const seller = await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingStatus: "success",
        role: "seller",
        linked_account: {
          create: {
            status: "created",
            accountId: "acc_R8Q7wNZVk4uazs",
            id: randomUUID(),
          },
        },
      },
    });

    console.log(seller)
  } catch (error) {
    console.log(error);
  }
}

main();
