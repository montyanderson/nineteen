const http = require('http');
const fs = require('fs');

const app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});

	fs.createReadStream(`${__dirname}/index.html`).pipe(res);
});

const io = require('socket.io').listen(app);

const peers = [];

io.on('connection', function(socket) {
	socket.on('id', id => {
		peers.push({ id });
		console.log('join', { id, peers });

		socket.emit('peers', peers.filter(a => a.id !== id));

		socket.on('disconnect', () => {
			console.log('leave', { id, peers });
			peers.splice(peers.indexOf(id), 1);
		});
	});
});

app.listen(3000);
