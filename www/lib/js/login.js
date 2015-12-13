var lock = null;
$(document).ready(function() {
   lock = new Auth0Lock('qB53zH4XKon2YWheT9dXixXjyvEoy0Sq', 'arcus.auth0.com');
});

var userProfile;

$('.btn-login').click(function(e) {
  e.preventDefault();
  lock.show(function(err, profile, token) {
    if (err) {
      // Error callback

    } else {
      // Success callback

      // Save the JWT token.
      localStorage.setItem('userToken', token);

      // Save the profile
      userProfile = profile;
    }
  });
});
