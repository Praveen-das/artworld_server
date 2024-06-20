import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

export const getUserMessages = async (id: string) => {
    return await db.conversation.findMany()
    // return await db.conversation.groupBy({
    //     by: ['user_id'],
    //     where: {
    //         chat: {
    //             every: { user_id: id }
    //         }
    //     }
    // })
}

export const addChatMessage = async (uid: string, message: string) => {
    return await db.chat.create({
        data: {
            message,
            user_id: uid
        }
    })
}