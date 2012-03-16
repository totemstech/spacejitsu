#!/usr/bin/env node

var express = require("express");
var app = express.createServer();
var io = require('socket.io').listen(app);

var config = require('./../shared/config.js').config;

// Configuration
app.configure(function(){
  app.use(express.static(__dirname + '/../cli'));
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
    console.log(id);
    if(isNaN(id)) {
      res.send("error");
      return;
    }
    res.send(game.getScore(id));
  } else {
    res.send(game.getScore(id));
  }
});

app.listen(8080);

console.log('socket.io server started on port 8080');
