var express = require('express');
var https = require('https');
var querystring = require('querystring');

var app = express();

var host = 'status.github.com';
var apiJSON = '/api.json';

// For making simple requests with https 
function simpleRequest(endpoint, processor) {
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
			processor(jsonData);
		});
	});
	req.end();
};

// Proccessing the data from github's api
app.get('/', function(req, res) {
	// Dynamicaly get relevant urls 
	simpleRequest(apiJSON, function(data) { 
		var statusUrl = data.status_url;
		var messagesUrl = data.messages_url;
		var lastMessageUrl = data.last_message_url;
		// Get current status from github api
		simpleRequest(statusUrl, function(data) {
			var currentStatus = data;
			// Get recent messages from github api
			simpleRequest(messagesUrl, function(data) {
				// Trying to get as much information as possible
				// Somtimes github has no messages but does have last message in it's api
				if (data == '') {
					simpleRequest(lastMessageUrl, function(data) {
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

// Run the server on port 8888
var server = app.listen(8888);