var lock = null;
$(document).ready(function() {
   if (window.localStorage.getItem('userToken') !== null) {
     $.ajax({ url: 'https://arcus.auth0.com/userinfo', beforeSend: function(xhr) {
       xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
     }}).done(function( data ) {
       $('.login-span').stop().hide(0).text('Logout').fadeIn();
       $('.login-span-sm').stop().hide(0).text(', Logout').fadeIn();
       $('.user').stop().hide(0).text('Signed in as: ' + data.phone_number).fadeIn();
       $('.login').not('.login-sm').removeClass('btn-primary');
       $('.login').not('.login-sm').addClass('btn-default');
     });
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
