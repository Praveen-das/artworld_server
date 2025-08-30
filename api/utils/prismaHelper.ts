import db from "../config/prismaClient";

export async function deleteExpiredSessions() {
  const now = new Date();

  const result = await db.token.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  console.log(`Deleted ${result.count} expired tokens`);
}
