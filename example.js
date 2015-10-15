var http = require('http');
var msg = "Hellooo Nurse!";
http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	console.log("Hey");
	response.end(msg);
}).listen(8124);

