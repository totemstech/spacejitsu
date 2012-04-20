#!/usr/bin/env node

var express = require("express");
var app = express.createServer();
var io = require('socket.io').listen(app);
var http = require('http');
var config = require('./../shared/config.js').config;

// Configuration
app.configure(function(){
  app.use(express.static(__dirname + '/../cli'));
//  app.use(express.cookieParser(...));
 // app.use(express.session(...));
});

io.set('log level', 1);

var incr = 0;
var game = require('./game.js').game({io: io});

game.start();


io.of('/game').on('connection', function(socket) {
  var id = ++incr;
  socket.set('id', id, function() {		
    socket.emit('init', { id : id });
    for(var i = 0; i < game.all().length; i++) {
      socket.emit('create', { desc: game.all()[i].desc() });
    }
  });	
  
  socket.on('push', function(data) {
    socket.get('id', function(err, id) {
      if(!err) {
	game.push(id, data.id, data.st);		
	io.of('/game').volatile.emit('push', data);
      }
    });
  });
  
  socket.on('create', function(data) {
    socket.get('id', function(err, id) {
      if(!err) {
	game.create(id, data.desc);
	io.of('/game').emit('create', { desc: data.desc });
      }
    });
  });
  
  socket.on('disconnect', function () {
    socket.get('id', function(err, id) {
      if(!err) {
	game.clear(id);
	io.of('/game').emit('kill', {id: id});
      }
    });
  });
});


game.on('destroy', function(ids) {
  io.of('/game').emit('destroy', ids);
});

app.get('/score/:id?', function(req, res, next) {
  if(req.params.id) {
    var id = parseInt(req.params.id, 10);
    if(isNaN(id)) {
      res.send("error");
      return;
    }
    res.send(game.getScore(id));
  } else {
    res.send(game.getScore());
  }
});

//endpoint used by fb plugin client side
app.get('/chn', function(req, res, next){
  res.send('<script src="//connect.facebook.net/en_US/all.js"></script>');
  
});


app.get('/login',function(req, res, next){
  var accessToken = req.params.accessToken;
  var options = {
    host: 'https://graph.facebook.com',
    port: 80,
    path: '/?accessToken=' + accessToken,
    method: 'GET'
  };
  console.log("hello");
  res.send("hello");
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });
  
});
app.listen(8080);

console.log('socket.io server started on port 8080');
