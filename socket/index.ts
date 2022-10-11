import {Server} from "socket.io";

const createSocketServer = (server: any) => {
    const io = new Server(server, {
        transports: ["websocket"],
    });

    const rooms: any = {}

    const leaveRoom = (props: {socket: any}) => {
        const { socket } = props

        const user = socket.data.user
        const room = rooms[user.room]

        if (room && rooms[room.name].users.filter((item: any) => item.id === user.id).length > 0) {

            const roomName = room.name
            rooms[roomName].users = rooms[roomName].users.filter((item: any) => item.id !== user.id)

            const message = {
                type: 'notification',
                name: user.name,
                value: `User ${user.name} leaved room ${roomName}`,
                date: new Date()
            }

            rooms[roomName].messages.push(message)
            io.to(roomName).emit('sendMessage', {room: rooms[roomName]})
            socket.leave(roomName)
        }
    }

    io.on('connection', (socket: any) => {
        socket.data.user = { id: socket.id }

        socket.on('joinRoom', (props: {room: string, name: string}) => {

            const { room, name } = props

            socket.join(room)
            socket.data.user.room = room
            socket.data.user.name = name

            const message = {
                type: 'notification',
                name,
                value: `User ${name} joined room ${room}`,
                date: new Date()
            }

            const user = { name, id: socket.id }

            if(rooms[room]) {
                rooms[room] = {
                    name: room,
                    users: rooms[room].users.concat([user]),
                    messages:rooms[room].messages.concat([message])
                }
            } else {
                rooms[room] = { name: room, messages: [message], users: [user]}
            }
            io.to(room).emit('joinRoom', {room: rooms[room]})
        })

        socket.on('sendMessage', (props: {value: string, room: string, name: string}) => {
            const {value,room, name} = props

            if(rooms[room]) {
                const message = {
                    type: 'text',
                    name,
                    value,
                    date: new Date()
                }
                rooms[room].messages.push(message)
                io.to(room).emit('sendMessage', {room: rooms[room]})
            }
        })

        socket.on('leaveRoom', () => {
            leaveRoom({socket})
        })

        socket.on('disconnect', () => {
            leaveRoom({socket})
        });
    })
}

export default createSocketServer