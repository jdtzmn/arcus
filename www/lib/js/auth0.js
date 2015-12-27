var lock = null;
var validToken = false;

var auth0 = {
  get: function(cb) {

    //gets the servers data on the user account:
    $.ajax({ url: '/api/get', beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
    }}).done(function( data ) {
      cb(data);
    });
  },
  update: function(body, cb) {
    $.ajax({ url: '/api/update?body=' + JSON.stringify({servers: body}), beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
    }}).done(function( data ) {
      cb(data);
    });
  },
  add: function(name, ip, cb) {
    auth0.get(function(data) {
      var servers = data.body.servers;
      servers.push({name: name, ip: ip});
      auth0.update(servers, function(data) {
        if (data.success === true) {
          cb(data);
        } else {
          console.log(new Error(data.statusCode, data.body));
        }
      });
    });
  },
  remove: function(name, cb) {
    auth0.get(function(data) {
      var servers = data.body.servers;
      if (typeof name === 'string') {
        for (var i = 0; i < servers.length; i++) {
          if (servers[i].name === name) {
            servers.splice(i,1);
          }
        }
      } else if (typeof name === 'number') {
        servers.splice(name,1);
      }
      auth0.update(servers, function(data) {
        if (data.success === true) {
          cb(data);
        } else {
          console.log(new Error(data.statusCode, data.body));
        }
      });
    });
  }
};


$(document).ready(function() {
   if (window.localStorage.getItem('userToken') !== null) {
     $.ajax({ url: 'https://arcus.auth0.com/userinfo', beforeSend: function(xhr) {
       xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
     }}).done(function( data ) {
       validToken = true;
       $('.login-span').stop().hide(0).text('Logout').fadeIn();
       $('.login-span-sm').stop().hide(0).text(', Logout').fadeIn();
       $('.user').stop().hide(0).text('Signed in as: ' + data.phone_number).fadeIn();
       $('.login').not('.login-sm').removeClass('btn-primary');
       $('.login').not('.login-sm').addClass('btn-default');
     }).fail(function() {
       window.localStorage.removeItem('userToken');
       servers.render();
     });
     auth0.get(function(data) {
       window.localStorage.setItem('servers', JSON.stringify(data.body.servers));
       servers.render();
     });
   } else {
     servers.render();
   }

  $('.login').click(function() {
    if ($('.login').text() === 'Logout' || $('.login-sm').text() === ', Logout') {
      window.localStorage.removeItem('userToken');
      window.localStorage.removeItem('smsCred');
      window.location.replace('/');
      return;
    }

    lock = new Auth0LockPasswordless('qB53zH4XKon2YWheT9dXixXjyvEoy0Sq', 'arcus.auth0.com');
    lock.sms({
      callbackURL: '',
      authParams: {
        scope: 'openid profile'
      },
      autoclose: true
    }, function(err, profile, id_token, access_token, state, refresh_token) {
      if (!err) {
        window.localStorage.setItem('userToken', access_token);
        window.location.replace('/');
      }
    });
  });
});
