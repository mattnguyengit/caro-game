
module.exports = function(io) {
  let caroRooms = [];
  io
    .of('/games')
    .on('connection', socket => {
      socket.on('connectUser', userId => {
        if(caroRooms.includes(userId)) {
          console.log(caroRooms.includes(userId))
          socket.emit('hostRoom');
        } 
        else return socket.emit('newRoom', caroRooms); 
      })
      
      socket.on('hostRoom', hostId => {
        socket.join(`${hostId}`);
        caroRooms.push(hostId);
        socket.broadcast.emit('newRoom', caroRooms)
        socket.emit('hostRoom');
      })
      socket.on('leaveRoom', (hostId) => {
        socket.leave(`${hostId}`);
        index = caroRooms.indexOf(hostId);
        caroRooms.splice(index, 1);
        console.log(caroRooms)
        socket.broadcast.emit('newRoom', caroRooms)
        socket.emit('newRoom', caroRooms)
        socket.emit('leaveRoom', caroRooms);
      })
    })
}

