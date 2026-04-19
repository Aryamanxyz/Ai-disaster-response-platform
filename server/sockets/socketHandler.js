module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('user:join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('incident:create', (incident) => {
      io.emit('incident:new', incident);
    });

    socket.on('incident:update', (incident) => {
      io.emit('incident:updated', incident);
    });

    socket.on('resource:allocate', (data) => {
      io.emit('resource:updated', data);
    });

    socket.on('alert:send', (alert) => {
      io.emit('alert:received', alert);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};