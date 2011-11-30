#!/usr/bin/env node

var express = require("express");
var app = express.createServer();
var io = require('socket.io').listen(app);

// Configuration
app.configure(function(){
	app.use(express.static(__dirname + '/../cli'));
    });

var game = require('./game.js').game({});
var incr = 0;

io.of('/game').on('connection', function(socket) {
	var id = ++incr;
	socket.set('id', id, function() {
		socket.emit('init', { id : id });		
	    });	
    });


app.listen(8080);

console.log('socket.io server started on port 8080');
