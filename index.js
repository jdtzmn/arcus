var express = require('express');
var request = require('request');
var app = express();
var db = require('orchestrate')('40fa0088-fc60-4d68-a02a-2808efe8d9a5');
var client = require('twilio')('ACc7a81da7cc0f53ab18ec67225e8923da','5c13c3b32e5211e021d9fdcfb0196438');

app.use(express.static(__dirname + '/www/dist'));

function checkID(req, cb, number) {
	var userToken = req.headers.authorization;
	request({
		headers: {
			'Authorization': userToken
		},
		url: 'https://arcus.auth0.com/userinfo'
	}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			if (!number) {
				cb(true, JSON.parse(body).user_id);
			} else {
				cb(true, JSON.parse(body).user_id, JSON.parse(body).phone_number);
			}
	  } else {
			cb(false);
		}
	});
}

//\/\/\/ Edit Here: \/\/\/

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/www/index.html');
});

app.get('/fonts/:file', function(req, res) {
	res.sendFile(__dirname + '/www/lib/bower_components/font-awesome/fonts/' + req.params.file);
});

app.get('/api/get', function(req, res) {
	if (!req.headers.authorization) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing authorization.'});
		return;
	}

	//checks for correct authorization:
	checkID(req, function(verified, id) {
		if (verified === true) {

			//sends the GET request to the server:
			db.get('servers', id)
			.then(function (result) {
				res.send({success: true, statusCode: result.statusCode, body: result.body});
			})
			.fail(function (err) {
				res.send({success: false, statusCode: err.statusCode, body: err.body});
			});
		}
		else {
			res.send({success: false, statusCode: 401, body: 'Unauthorized'});
		}
	});

});

app.get('/api/add', function(req, res) {
	if (!req.query.body || !req.headers.authorization) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing either authorization or body query.'});
		return;
	}

	//checks for correct authorization:
	checkID(req, function(verified, id) {
		if (verified === true) {

			//sends the MERGE request to the server:
			db.merge('servers', id, JSON.parse(req.query.body))
			.then(function (result) {
				res.send({success: true, statusCode: result.statusCode, body: result.body});
			})
			.fail(function (err) {
				res.send({success: false, statusCode: err.statusCode, body: err.body});
			});
		}
		else {
			res.send({success: false, statusCode: 401, body: 'Unauthorized'});
		}
	});
});

app.get('/api/remove', function(req, res) {
	if (!req.query.body || !req.headers.authorization) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing either authorization or body query.'});
		return;
	}

	//checks for correct authorization:
	checkID(req, function(verified, id) {
		if (verified === true) {

			//sends the GET request to the server:
			db.get('servers', id)
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
				db.remove('servers', id)
				.then(function(result) {

					//sends a PUT request to update the value of the key to the new object:
					db.put('servers', id, obj)
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
		}
		else {
			res.send({success: false, statusCode: 401, body: 'Unauthorized'});
		}
	});


});

app.get('/api/update', function(req, res) {
	if (!req.query.body || !req.headers.authorization) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing either authorization or body query.'});
		return;
	}

	//checks for correct authorization:
	checkID(req, function(verified, id) {
		if (verified === true) {

			//update the key's value:
			db.put('servers', id, JSON.parse(req.query.body))
			.then(function(result) {
				res.send({success: true, statusCode: result.statusCode, body: result.body});
			})
			.fail(function(err) {
				res.send({success: false, statusCode: err.statusCode, body: err.body});
			});
		}
		else {
			res.send({success: false, statusCode: 401, body: 'Unauthorized'});
		}
	});
});



//Twilio text api:

app.get('/api/notify', function(req, res) {
	if (!req.headers.authorization || !req.query.msg) {
		res.status('422').send({success: false, statusCode: 422, body: 'Missing either authorization or msg query.'});
		return;
	}

	checkID(req, function(verified, id, number) {

		//send text:
		client.messages.create({
		  body: req.query.msg,
		  to: number,
		  from: "Arcus"
		}, function(err, message) {
		  if (err) {
				if (err.code === 21606) {
					client.messages.create({
					  body: req.query.msg,
					  to: number,
					  from: "Arcus"
					}, function(err, message) {
						if (err) {
							console.log(err);
						} else {
							res.send({success: true});
						}
					});
				} else {
					console.log(err);
				}
			} else {
				res.send({success: true});
			}
		});

	}, true);
});


///\/\/\ Edit Here: /\/\/\


app.use(function(req, res) {
	res.redirect('/');
});

app.listen(process.env.PORT || 3000);
