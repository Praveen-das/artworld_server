import { Server } from 'socket.io'

let users: any = new Map()
let store: any = new Map()
let actions: any = new Map()
let blockedList: any = new Map()

interface chat_schema {
    from: string,
    to: string,
    message: string,
    active: false,
    new: true,
    receivedOn: number,
    status: string,
}

const origin = [
    'https://artworld-nine.vercel.app',
    'http://localhost:3000'
]

function initializeSocket(server: any) {
    const io = new Server(server, {
        cors: { origin },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true,
        }
    });

    io.on('connection', (socket: any) => {
        socket.user = socket.handshake.auth.user

        let messages = store.get(socket.user.user_id),
            requests = actions.get(socket.user.user_id)

        let user = users.get(socket.user.user_id)

        if (user) {
            user.active = true
            user.sid = socket.id
        } else {
            user = {
                ...socket.user,
                sid: socket.id,
                active: true,
            }
            users.set(socket.user.user_id, user)
        }

        let blockedUsers: Array<string> = []

        blockedList.forEach((value: Array<string>, key: string) => {
            if (value?.includes(socket.user.user_id)) {
                blockedUsers.push(key)
            }
        })

        socket.emit('users', {
            users: Array.from(users.values()),
            messages: messages ? Array.from(messages) : [],
            requests: requests ? Array.from(requests) : [],
            blockedUsers
        })

        socket.broadcast.emit("user connected", user);

        socket.on('user_chat', (chat: chat_schema) => {
            chat.active = false
            chat.new = true
            chat.from = socket.user.user_id
            chat.receivedOn = new Date().getTime()

            const user = users.get(chat.to)
            const roomId = generateRoomId(chat.from, chat.to)
            const blockedUsers = blockedList.get(socket.user.user_id) || []
            if (blockedUsers.includes(chat.to))
                return socket.emit('receive', chat)
            if (user.active) {
                chat.status = 'received'
                io.to(socket.id).to(user.sid).emit('receive', chat)
            } else {
                const messages = store.get(chat.to)

                chat.status = 'sent'

                if (messages) {
                    if (messages.has(roomId)) messages.get(roomId).push(chat)
                    else messages.set(roomId, [chat])
                } else store.set(chat.to, new Map([[roomId, [chat]]]))

                socket.emit('receive', chat)
            }
        })

        socket.on('chatSeen', ({ user_id, roomId }: any) => {
            const { sid } = users.get(user_id)
            store.get(socket.user.user_id)?.delete(roomId)
            io.to(socket.id).to(sid).emit('chatSeen', roomId)
        })

        socket.on('block_room', (user_id: string) => {
            blockedList.get(user_id)?.push(socket.user.user_id) ||
                blockedList.set(user_id, [socket.user.user_id])

            socket.emit('roomBlocked', user_id)
        })
        socket.on('unblock_room', (user_id: string) => {
            let chat = blockedList.get(user_id)
            chat = chat?.filter((uid: string) => uid !== socket.user.user_id)
            blockedList.set(user_id, chat)
            socket.emit('unblock_room', user_id)
        })

        socket.on('delete', (request: any) => {
            const { user_id, roomId, chatId } = request,
                user = users.get(user_id)

            if (user.active) io.to(socket.id).to(user.sid).emit('delete', [[roomId, [chatId]]])
            else {
                const userActions = actions.get(user_id)
                if (userActions) {
                    if (userActions.has(roomId)) userActions.get(roomId).push(chatId)
                    else userActions.set(roomId, [chatId])
                } else actions.set(user_id, new Map([[roomId, [chatId]]]))
                io.to(socket.id).emit('delete', [[roomId, [chatId]]])
            }
        })

        ////////////////////////////////////////////////
        socket.on('disconnect', (reason: any) => {
            const lastActive = new Date().getTime()
            const user = users.get(socket.user.user_id)
            user.lastActive = lastActive
            user.active = false

            socket.broadcast.emit('user disconnected', { sid: socket.id, user_id: socket.user.user_id, lastActive, active: false })
        });
    });

}

function generateRoomId(...userIds: any) {
    return userIds.sort().toString()
}

export default initializeSocket

