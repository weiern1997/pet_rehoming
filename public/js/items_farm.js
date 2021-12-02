if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}


$(document).ready(function () {
  $('#set_button').click(function () {
    var $inputs = $('form :input');
    var values = {};
    $inputs.each(function () {
      if ($(this).val())
        values[this.name] = $(this).val();
    });
    delete values['SKU_name']
    $.post('/items/set', values, function (data, success) {
      if (data == 'OK') {
        $('form').trigger("reset")
        location.reload()
      }
    });
  });
  
 


});