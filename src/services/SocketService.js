class SocketService {
    //connection socket
    connection (socket) {
        socket.on('disconnect', () => {
            console.log(`User connect id is ${socket.id}`)
        })

        // event on here 

        // socket.on('notification', noti => {
        //     console.log(`msg is ${noti}`)
        //     // _io.emit('notification', noti)
        //     // _io.emit('get notification', noti)
        // })
    }
}

module.exports  =  new  SocketService;