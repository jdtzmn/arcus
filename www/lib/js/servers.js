var servers = {
  add: function(name, ip) {
    if (false) {

    } else {
      var servers = JSON.parse(window.localStorage.getItem('servers')) || [];
      servers.push({name: name, ip: ip});
      window.localStorage.setItem('servers', JSON.stringify(servers));
      return servers;
    }
  },
  remove: function(name) {
    if (false) {

    } else {
      var servers = JSON.parse(window.localStorage.getItem('servers')) || [];
      if (typeof name === 'string') {
        for (var i = 0; i < servers.length; i++) {
          if (servers[i].name === name) {
            servers.splice(i,1);
            window.localStorage.setItem('servers', JSON.stringify(servers));
            return servers;
          }
        }
      } else if (typeof name === 'number') {
        servers.splice(name,1);
        window.localStorage.setItem('servers', JSON.stringify(servers));
        return servers;
      }
    }
  },
  get: function() {
    if (false) {

    } else {
      var servers = JSON.parse(window.localStorage.getItem('servers')) || [];
      return servers;
    }
  },
  render: function() {
    if (servers.get().length > 0) {
      $('.nothing').hide();
      $('.data').fadeIn();
      $('.servers').hide().render(servers.get()).fadeIn();
    } else if (servers.get().length === 0) {
      $('.data').hide();
      $('.nothing').fadeIn();
    }
  },
  watch: function() {
    var watching;
    clearInterval(watching);
    watching = setInterval(function() {
      mcstatus(servers.get(), function(response) {
        if (response instanceof Error) {
          console.log(response);
        } else {
          console.log(response);
        }
      });
    }, 5000);
  },
  notify: function(message) {
    if (false) {

    } else {
      PNotify.prototype.options.styling = "fontawesome";
      PNotify.desktop.permission();
      new PNotify({
        title: 'Arcus',
        text: message,
        type: 'info',
        desktop: {
          desktop: true,
          icon: false
        }
      });
    }
  }
};

servers.render();
