const http = require('http');
const fs = require('fs');
const url = require('url');
const blackjack = require('./lib/blackjack');

const Server = {};

Server.getGame = function getGame(socket, data, callback) {
  const game = socket.game;
  callback(socket, game);
};

Server.deal = function deal(socket, data) {
  console.log('deal');
  Server.getGame(socket, data, (socket, game) => {
    if (!game.isInProgress()) {
      game.newGame();
    }
    socket.emit('deal', game.toJson());
  });
};

Server.hit = function hit(socket, data) {
  console.log('hit');
  Server.getGame(socket, data, (socket, game) => {
    game.hit();
    socket.emit('hit', game.toJson());
  });
};

Server.stand = function stand(socket, data) {
  console.log('stand');
  Server.getGame(socket, data, (socket, game) => {
    game.stand();
    socket.emit('stand', game.toJson());
  });
};

// 註冊socket監聽事件
Server.registerSocketIO = function registerSocketIO(io) {
  io.on('connection', (socket) => {
    console.log('User connected');
    // 初始化遊戲
    socket.game = blackjack.newGame();
    // deal
    socket.on('deal', (data) => {
      Server.deal(socket, data);
    });
    // hit
    socket.on('hit', (data) => {
      Server.hit(socket, data);
    });
    // stand
    socket.on('stand', (data) => {
      Server.stand(socket, data);
    });
    // disconnect
    socket.on('disconnect', (socket) => {
      console.log('User disconnected');
    });
  });
};

Server.init = function init() {
  const httpServer = http.createServer((req, res) => {
    let path = url.parse(req.url).pathname;
    // console.log(path);
    const contentType = 'text/html';
    if (path === '/') {
      path = '/index.html';
    }
    // else if (path.indexOf('.css')) {
    //     contentType = 'text/css';
    // } else if (path.indexOf('.svg')) {
    //     contentType = 'image/svg+xml';
    // }
    fs.readFile(__dirname + path, (error, data) => {
      res.writeHead(200, {
        'Content-Type': contentType,
      });
      res.end(data, 'utf-8');
    });
  }).listen(8080);

  const io = require('socket.io').listen(httpServer);
  Server.registerSocketIO(io);
};

Server.init();
