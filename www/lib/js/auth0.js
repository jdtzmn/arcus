var lock = null;
$(document).ready(function() {
   lock = new Auth0LockPasswordless('qB53zH4XKon2YWheT9dXixXjyvEoy0Sq', 'arcus.auth0.com');
   if (window.localStorage.getItem('userToken') !== null) {
     $.ajax({ url: 'https://arcus.auth0.com/userinfo', beforeSend: function(xhr) {
       xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
     }}).done(function( data ) {
       $('.user').hide().removeClass('hidden').fadeIn();
       $('.login').addClass('hidden');
       $('.number').text(data.phone_number);
     }).fail(function() {
       $('.user').addClass('hidden');
       $('.login').hide().removeClass('hidden').fadeIn();
     });
   } else {

   }
});

function open() {
  lock.sms({
    callbackURL: '',
    authParams: {
      scope: 'openid profile'
    },
    autoclose: true
  }, function(err, profile, id_token, access_token, state, refresh_token) {
    if (!err) {
      window.localStorage.setItem('userToken', access_token);
      $('.user').hide().removeClass('hidden').fadeIn();
      $('.login').addClass('hidden');
      $('.number').text(profile.phone_number);
    }
  });
}
