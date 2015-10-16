var express = require('express');
var https = require('https');
var querystring = require('querystring');

var app = express();
var host = 'status.github.com';

function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      var jsonData = JSON.parse(data);
      console.log(jsonData);
      success(jsonData);
    });
  });

  req.write(dataString);
  req.end();
};

app.get('/', function(req, res) {
	performRequest('/api.json', 'GET', '', function(data) {
		var statusUrl = data.status_url;
		var lastMessageUrl = data.last_message_url;
		performRequest(statusUrl, 'GET', '', function(date) {
			var currentStatus = data;
			performRequest(lastMessageUrl, 'GET', '', function(data) {
				res.send(statusUrl+"<BR>"+lastMessageUrl);
			});
		});
		
	});
});



var server = app.listen(8888);