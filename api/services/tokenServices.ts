import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({ errorFormat: "minimal" });

async function saveToken(token: string, userId: string) {
  const expiresInMinutes = 15;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000).toISOString();

  return await db.token.upsert({
    where: { userId },
    update: {
      token,
      expiresAt
    },
    create: {
      userId,
      token,
      expiresAt,
    },
  });
}

async function fetchTokenByUserId(userId: string) {
  return await db.token.findUnique({ where: { userId } });
}

async function deleteToken(tokenId: string) {
  return await db.token.delete({ where: { id: tokenId } });
}

export default {
  saveToken,
  fetchTokenByUserId,
  deleteToken,
};
