var express = require('express');
var app = express();

app.use(express.static(__dirname + '/www/dist'));

//\/\/\/ Edit Here: \/\/\/ 

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/www/index.html');
});

///\/\/\/\/\/\


app.use(function(req, res) {
	res.redirect('/');
});

app.listen(process.env.PORT || 3000);

