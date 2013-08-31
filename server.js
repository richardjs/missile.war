var app = require('http').createServer(handler);

var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(8080);

var allowedURLs = [
	'/client.html',
	'/js/game.js',
];
function handler(request, response){
	var url = request.url;
	if(url == '/'){
		url = '/client.html';
	}

	if(allowedURLs.indexOf(url) == -1){
		response.writeHead(403);
		response.end('You are forbidden to access this resource.');
		return;
	}

	fs.readFile(url.substring(1), function(error, data){
		if(error){
			response.writeHead(500);
			return response.end('Error loading '+url);
		}
		response.writeHead(200);
		response.end(data);
	});
}

io.sockets.on('connection', function(socket){
	console.log('connection');
	socket.send('Hello, sockets!');
	//socket.emit('news', {hello: 'world'});

	socket.on('message', function(data){
		console.log(data);
		if(data == 'wazzup'){
			socket.send({message: 'not much'});
		}
	});
});

