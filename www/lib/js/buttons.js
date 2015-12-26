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
        $('.add').popover('hide');
        $('.navbar-collapse').collapse('hide');
        servers.render();
      }
      return false;
    });

    $('.cancel-popover').click(function() {
      $('.cancel-popover:visible').parents('.popover').popover('hide');
    });
  });

  $('.remove').click(function() {
    $(this).blur();
    $('.cancel').animate({ width: 'hide' }).delay(100).animate({ width: 'show' });
  });

  $(':not(.remove)').click(function() {
    $('.cancel:visible').animate({ width: 'hide' });
  });

  $('.delete').click(function() {
    servers.remove($('tbody > tr').index($(this).parents('tr')));
    servers.render();
  });

  $('.navbar-collapse .remove, .login-sm').click('li', function() {
    $('.navbar-collapse').collapse('hide');
  });
});
