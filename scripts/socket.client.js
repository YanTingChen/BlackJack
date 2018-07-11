class SocketEvents {
  constructor() {
    const self = this;
    const socket = io.connect('http://localhost:8080');
    self.socket = socket;
  }

  // deal
  dealEmit() {
    const self = this;
    self.socket.emit('deal');
  }

  // hit
  hitEmit() {
    const self = this;
    self.socket.emit('hit');
  }

  // stand
  standEmit() {
    const self = this;
    self.socket.emit('stand');
  }

  // deal data
  dealOn(callback) {
    const self = this;
    self.socket.on('deal', (data) => {
      // console.log('deal data : ' + data);
      if (callback) { callback(data); }
    });
  }

  // hit data
  hitOn(callback) {
    const self = this;
    self.socket.on('hit', (data) => {
      // console.log('hit data : ' + data);
      if (callback) { callback(data); }
    });
  }

  // stand data
  standOn(callback) {
    const self = this;
    self.socket.on('stand', (data) => {
      // console.log('stand data : ' + data);
      if (callback) { callback(data); }
    });
  }
}


function events() {
  return new SocketEvents();
}

exports.events = events;
