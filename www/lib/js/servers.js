var watching;

var servers = {
  get: function() {
    var servers = JSON.parse(window.localStorage.getItem('servers')) || [];
    return servers;
  },
  add: function(name, ip) {
    if (validToken) {
      auth0.add(name, ip, function() {
        auth0.get(function(data) {
          window.localStorage.setItem('servers', JSON.stringify(data.body.servers));
          servers.render();
        });
      });
    }
    var serversobj = servers.get();
    serversobj.push({name: name, ip: ip});
    window.localStorage.setItem('servers', JSON.stringify(serversobj));
    return serversobj;
  },
  remove: function(name) {
    if (validToken) {
      auth0.remove(name, function() {
        auth0.get(function(data) {
          window.localStorage.setItem('servers', JSON.stringify(data.body.servers));
          servers.render();
        });
      });
    }
    var serversobj = servers.get();
    if (typeof name === 'string') {
      for (var i = 0; i < serversobj.length; i++) {
        if (serversobj[i].name === name) {
          serversobj.splice(i,1);
          window.localStorage.setItem('servers', JSON.stringify(serversobj));
          return serversobj;
        }
      }
    } else if (typeof name === 'number') {
      serversobj.splice(name,1);
      window.localStorage.setItem('servers', JSON.stringify(serversobj));
      return serversobj;
    }
  },
  render: function() {
    if (servers.get().length > 0) {
      $('.nothing').hide();
      $('.data').fadeIn();
      $('.servers').hide().render(servers.get(), {
        cancel: {
          style: function() {
            return 'display: none';
          }
        }
      }).fadeIn();
    } else if (servers.get().length === 0) {
      $('.data').hide();
      $('.nothing').fadeIn();
    }
    servers.watch();
  },
  watch: function() {
    mcstatus(servers.get(), function(response) {
      if (response instanceof Error) {
        console.log(response);
      } else {
        servers.notify(response);
      }
    });
    clearInterval(watching);
    watching = setInterval(function() {
      mcstatus(servers.get(), function(response) {
        if (response instanceof Error) {
          console.log(response);
        } else {
          servers.notify(response);
        }
      });
    }, 5000);
  },
  notify: function(message) {
    PNotify.prototype.options.styling = "fontawesome";
    PNotify.desktop.permission();
    if (validToken) {
      $.ajax({ url: '/api/notify?msg=' + message, beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
      }}).done(function( data ) {
        new PNotify({
          title: 'Arcus',
          text: message,
          type: 'info',
          icon: false,
          mouse_reset: false,
          desktop: {
            desktop: true,
            icon: false
          },
          nonblock: {
            nonblock: true
          },
          mobile: {
            swipe_dismiss: true,
            styling: true
          }
        });
      });
    } else {
      new PNotify({
        title: 'Arcus',
        text: message,
        type: 'info',
        icon: false,
        mouse_reset: false,
        desktop: {
          desktop: true,
          icon: false
        },
        nonblock: {
          nonblock: true
        },
        mobile: {
          swipe_dismiss: true,
          styling: true
        }
      });
    }
  }
};
