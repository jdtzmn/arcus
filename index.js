var express = require('express');
var app = express();
var db = require('orchestrate')('40fa0088-fc60-4d68-a02a-2808efe8d9a5');

app.use(express.static(__dirname + '/www/dist'));

//\/\/\/ Edit Here: \/\/\/

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/www/index.html');
});

app.get('/api/get/:key', function(req, res) {
	if (!req.params.key) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing key parameter.'});
	}

	//sends the GET request to the server:
	db.get('servers', req.params.key)
	.then(function (result) {
		res.send({success: true, statusCode: result.statusCode, body: result.body});
	})
	.fail(function (err) {
		res.send({success: false, statusCode: err.statusCode, body: err.body});
	});

});

app.get('/api/add/:key', function(req, res) {
	if (!req.query.body || !req.params.key) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing either key parameter or body query.'});
	}

	//sends the MERGE request to the server:
	db.merge('servers', req.params.key, JSON.parse(req.query.body))
	.then(function (result) {
		res.send({success: true, statusCode: result.statusCode, body: result.body});
	})
	.fail(function (err) {
		res.send({success: false, statusCode: err.statusCode, body: err.body});
	});
});

app.get('/api/remove/:key', function(req, res) {
	if (!req.query.body || !req.params.key) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing either key parameter or body query.'});
	}

	//sends the GET request to the server:
	db.get('servers', req.params.key)
	.then(function (result) {


		//returns new object without the requested values:
		var obj = result.body;
		var arr = Object.keys(JSON.parse(req.query.body));
	  for (var i in obj) {
			if (arr.indexOf(i) !== -1) {
	      delete obj[i];
	    }
	  }

		//sends a DELETE request to delete the key:
		db.remove('servers', req.params.key)
		.then(function(result) {

			//sends a PUT request to update the value of the key to the new object:
			db.put('servers', req.params.key, obj)
			.then(function(result) {
				res.send({success: true, statusCode: result.statusCode, body: result.body});
			})
			.fail(function(err) {
				res.send({success: false, statusCode: err.statusCode, body: err.body});
			});

		})
		.fail(function(err) {
			res.send({success: false, statusCode: err.statusCode, body: err.body});
		});

	})
	.fail(function (err) {
		res.send({success: false, statusCode: err.statusCode, body: err.body});
	});
});

app.get('/api/update/:key', function(req, res) {
	if (!req.query.body || !req.params.key) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing either key parameter or body query.'});
	}

	db.get('servers', req.params.key)
	.then(function(result) {

		//if the key exists, update the key's value:
		db.put('servers', req.params.key, JSON.parse(req.query.body))
		.then(function(result) {
			res.send({success: true, statusCode: result.statusCode, body: result.body});
		})
		.fail(function(err) {
			res.send({success: false, statusCode: err.statusCode, body: err.body});
		});

	})
	.fail(function(err) {
		res.send({success: false, statusCode: err.statusCode, body: err.body});
	});
});

///\/\/\ Edit Here: /\/\/\


app.use(function(req, res) {
	res.redirect('/');
});

app.listen(process.env.PORT || 3000);
