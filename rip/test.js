var express = require('express');
var https = require('https');
var querystring = require('querystring');

var app = express();
var host = 'status.github.com';
var apiJSON = '/api.json';

function makeRequest(endpoint, process) {
	var options = {
		host: host,
		path: endpoint,
		method: 'GET'
	};

	var req = https.request(options, function(res) {
		var responseString = '';
		res.on('data', function(data) {
			var jsonData = JSON.parse(data);
			console.log(jsonData);
			process(jsonData);
		});
	});
	req.end();
};

app.get('/', function(req, res) {
	makeRequest(apiJSON, function(data) {
		var statusUrl = data.status_url;
		var messagesUrl = data.messages_url;
		var lastMessageUrl = data.last_message_url;
		makeRequest(statusUrl, function(data) {
			var currentStatus = data;
			makeRequest(messagesUrl, function(data) {
				if (data == '') {
					makeRequest(lastMessageUrl, function(data) {
						var lastMessage = data;
						var fullResponse = {currentStatus: currentStatus, recentMessages: [lastMessage]};
						res.send(fullResponse);
					});
				} 
				else {
					var recentMessages = data;
					var fullResponse = {currentStatus: currentStatus, recentMessages: [recentMessages]};
					res.send(fullResponse);
				};
			});
		});	
	});
});

var server = app.listen(8888);