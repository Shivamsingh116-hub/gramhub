const users = {}

const socketHandler = async (io, socket) => {
    console.log("⚡ New client connected:", socket.id);
    socket.on('register', (userId) => {
        users[userId] = socket.id
        console.log(users)
    })
    socket.on('message', ({ from, to, text }) => {
        console.log(`from ${from} to ${to} text ${text}`)
        const recipientSocket = users[to]
        io.to(recipientSocket).emit('recieve_message',{from,text})
    })

}
module.exports = { socketHandler }