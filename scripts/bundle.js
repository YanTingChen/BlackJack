(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1]);
