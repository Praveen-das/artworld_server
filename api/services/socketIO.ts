import { Server } from 'socket.io'
let users: any = []

interface chat_schema {
    user_id: string,
    to: string,
    message: string,
    active: false,
    read: false,
    receivedOn: number,
    room: string
    self: boolean
}

function initializeSocket(server: any) {
    const io = new Server(server, {
        cors: { origin: ["http://localhost:3000"] },
    });

    // io.on('connection', (socket: any) => {
    //     socket.on('connect_room', (user_id: string) => {
    //         for (let room of rooms) {
    //             const [sid, user_id] = room?.split('|')
    //             if (sid === user_id) {
    //                 if (!receivers.some((o: any) => o.room === room)) {
    //                     receivers.push({ isVisited: false, room, user_id, sid })
    //                 }
    //                 socket.join(room)
    //             }
    //         }
    //         socket.emit('receivers', receivers)
    //     })

    //     //-------------FOR CLIENT-------------///////////////
    //     socket.on('chat', (data: any) => {
    //         !rooms.includes(data.room) && rooms.push(data.room)
    //         !Array.from(socket.rooms).includes(data.room) && socket.join(data.room)
    //         io.to(data.room).emit('message', data.message)
    //     })

    //     socket.on('disconnect', (args: any) => {
    //         console.log('user disconnected');
    //     });
    // });
    io.on('connection', (socket: any) => {
        socket.user = socket.handshake.auth.user

        const userData = {
            ...socket.user,
            sid: socket.id,
            active: true,
            messages: []
        }

        users = users.filter((o: any) => o?.user_id !== socket.user.user_id)
        users.push(userData)

        socket.broadcast.emit("user connected", userData);
        socket.emit('users', users)

        socket.on('user_chat', (chat: chat_schema) => {
            chat.user_id = socket.user.user_id
            chat.active = false
            chat.read = false
            chat.receivedOn = new Date().getTime()

            const array = [chat.user_id, chat.to]
            chat.room = array.sort().join('|')

            const receiver = users.find((user: any) => user.user_id === chat.to)
            // receiver.messages.push(chat)

            if (receiver) {
                io.to(socket.id).to(receiver.sid).emit('receive', chat)
            }
        })

        ////////////////////////////////////////////////
        socket.on('disconnect', () => {
            const lastActive = new Date().getTime()
            users = users.map((user: any) => {
                if (user.sid === socket.id) {
                    user.lastActive = lastActive
                    user.active = false
                }
                return user
            })
            socket.broadcast.emit('user disconnected', { sid: socket.id, user_id: socket.user.user_id, lastActive, active: false })
        });
    });

}

export default initializeSocket