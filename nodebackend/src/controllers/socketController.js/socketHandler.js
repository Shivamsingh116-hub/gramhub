const users = {}

const socketHandler = (io, socket) => {
    console.log("⚡ New client connected:", socket.id);
    socket.on('register', (userId) => {
        users[userId] = socket.id
    })
    socket.on('privateMessage', ({ from, to, text }) => {
        const recipientSocket = users[to]
        if (recipientSocket) {
            io.to(recipientSocket).emit("receive_message", { from, text });
            console.log(`📨 Message from ${from} to ${to}: ${text}`);
        } else {
            console.log(`⚠️ User ${to} not connected.`);
        }
    })
    socket.on("disconnect", () => {
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId]
                console.log(`❌ ${userId} disconnected`);
                break;
            }
        }

    })
}
module.exports = { socketHandler }