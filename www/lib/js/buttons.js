$(document).ready(function() {
  $('.add').popover({
    html: true,
    placement: 'bottom',
    trigger: 'manual',
    container: 'body',
    content: function() {
      return $('#popover-content').html();
    }
  });

  $('.add-text').popover({
    html: true,
    placement: 'bottom',
    trigger: 'manual',
    content: function() {
      return $('#popover-content').html();
    }
  });

  $('.add, .remove').keyup(function(e){
   if(e.keyCode == 32){
       $(this).click();
   }
});

  $('.add, .add-text').click(function() {
    $(this).blur();
    $('.cancel:visible').animate({ width: 'hide' });
    $(this).popover('toggle');
    $('.popover').find('#name').focus();
    $('.add-server').click(function(e) {
      if ($('.popover').find('#name').val() === '') {
        $('.popover').find('#name').addClass('animated shake');
        $('.popover').find('#name').parent().parent().addClass('has-error');
        setTimeout(function() {
          $('.popover').find('#name').removeClass('animated shake');
        }, 1000);
      }
      if ($('.popover').find('#ip').val() === '') {
        $('.popover').find('#ip').addClass('animated shake');
        $('.popover').find('#ip').parent().parent().addClass('has-error');
        setTimeout(function() {
          $('.popover').find('#ip').removeClass('animated shake');
        }, 1000);
      } else if ($('.popover').find('#ip').val() !== '' && $('.popover').find('#name').val() !== ''){
        servers.add($('.popover').find('#name').val(),$('.popover').find('#ip').val());
        $(this).parents('.popover').popover('hide');
        $('.navbar-collapse').collapse('hide');
        servers.render();
      }
      return false;
    });

    $('.add-server').mouseup(function(e) {
      e.preventDefault();
      return false;
    });

    $('.cancel-popover').click(function() {
      $('.cancel-popover:visible').parents('.popover').popover('hide');
    });
  });

  $('.remove').click(function(e) {
    $(this).blur();
    $('.cancel').animate({ width: 'toggle' });
    e.stopPropagation();
  });

  $(document).click(function() {
    $('.cancel:visible').animate({ width: 'hide' });
  });

  $('.delete').click(function(e) {
    servers.remove($('tbody > tr').index($(this).parents('tr')));
    servers.render();
    e.stopPropagation();
  });

  var keysdown = {},
        number = '';

  $(document).keydown(function(e) {

    //makes sure the keydown event fires only once:
    if (keysdown[String.fromCharCode(e.keyCode)]) {
      return;
    }
    keysdown[String.fromCharCode(e.keyCode)] = true;


    if (e.keyCode === 27) {
      $('.cancel:visible').animate({
        width: 'hide'
      });

      $('.cancel-popover:visible').parents('.popover').popover('hide');
    }

    //chcking for number after r
    if (keysdown.R && !isNaN(String.fromCharCode(e.keyCode)) && !$('input').is(':focus')) {
      number += String.fromCharCode(e.keyCode);
    }

    //adding shortcut for .add
    if (e.keyCode === 78 && !$('input').is(':focus')) {
      $('.add').click();
      e.preventDefault();
    }

  });

  $(document).keyup(function(e) {

    if (String.fromCharCode(e.keyCode) === 'R' && number !== '' && !$('input').is(':focus')) {
      servers.remove(+number - 1);
      servers.render();
      number = '';
      return;
    }

    //adding shortcut for .cancel;
    if (e.keyCode === 82 && !$('input').is(':focus')) {
      $('.cancel').animate({ width: 'toggle' });
    }

    //sets the keys which were down to being up:
    keysdown[String.fromCharCode(e.keyCode)] = false;

  });

  $('.navbar-collapse .remove, .login-sm').click('li', function() {
    $('.navbar-collapse').collapse('hide');
  });
});
