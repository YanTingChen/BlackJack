var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    blackjack = require('./lib/blackjack');

var Server = {}

Server.getGame = function (socket, data, callback) {
    var game = socket.game;
    callback(socket, game);
}

Server.deal = function (socket, data) {
    console.log('deal');
    Server.getGame(socket, data, function (socket, game) {
        if (!game.isInProgress()) {
            game.newGame();
        }
        socket.emit('deal', game.toJson());
    });
}

Server.hit = function (socket, data) {
    console.log('hit');
    Server.getGame(socket, data, function (socket, game) {
        game.hit();
        socket.emit('hit', game.toJson());
    });
}

Server.stand = function (socket, data) {
    console.log('stand');
    Server.getGame(socket, data, function (socket, game) {
        game.stand();
        socket.emit('stand', game.toJson());
    });
}

//註冊socket監聽事件
Server.registerSocketIO = function (io) {

    io.on('connection', function (socket) {
        console.log('User connected');
        //初始化遊戲
        socket.game = blackjack.newGame()
        //deal
        socket.on('deal', function (data) {
            Server.deal(socket, data);
        });
        //hit
        socket.on('hit', function (data) {
            Server.hit(socket, data);
        });
        //stand
        socket.on('stand', function (data) {
            Server.stand(socket, data);
        });
        //disconnect
        socket.on('disconnect', function (socket) {
            console.log('User disconnected');
        });
    });
}

Server.init = function () {
    var httpServer = http.createServer(function (req, res) {
        var path = url.parse(req.url).pathname;
        // console.log(path);
        var contentType = 'text/html';
        if (path === '/') {
            path = '/index.html';
        }
        // else if (path.indexOf('.css')) {
        //     contentType = 'text/css';
        // } else if (path.indexOf('.svg')) {
        //     contentType = 'image/svg+xml';
        // }
        fs.readFile(__dirname + path, function (error, data) {
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(data, 'utf-8');
        });
    }).listen(8080);

    var io = require('socket.io').listen(httpServer);
    Server.registerSocketIO(io);
}

Server.init();