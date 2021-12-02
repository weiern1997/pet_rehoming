$(document).ready(function () {


  $('.btn.btn-warning').click(function () {
    let num = $(this).attr('id'); //number of the order. NOT object _id 
    $('#company_input').attr("placeholder", $('#company' + num).text());
    $('#outlet_input').attr("placeholder", $('#outlet' + num).text());
    $('#po_date_text').attr("placeholder", $('#po_date' + num).text());
    $('#ful_date_text').attr("placeholder", $('#ful_date' + num).text());
    $('#ponumber_input').attr("placeholder", $('#po_number' + num).text());
    $('#dnnumber_input').attr("placeholder", $('#dn_number' + num).text());
    $('#object_id_input').val($('#object_id' + num).text());
    //this the buggy one
    items = ($('#items' + num).text()).split('\n')
    quantities = ($('#quantity' + num).text()).split('\n')
    //clean the string
    cleaned = []
    cleaned_quantities = []
    for (var i = 0; i < items.length - 2; i++) {
      if (items[i].trim().length) { cleaned.push(items[i].trim()) }
    }
    for (var i = 0; i < quantities.length - 2; i++) {
      if (quantities[i].trim().length) { cleaned_quantities.push(quantities[i].trim()) }
    }
    for (var i = 0; i < cleaned.length; i++) {
      sku = cleaned[i].split(':');
      html = '<div class="form-group">';
      html += '<label>' + sku[0] + ': </label>';
      html += '<input type="hidden" name="sku" value="' + sku[0] + '">';
      html += '<input type="number" class="form-control" name="quantity" value="' + Number(cleaned_quantities[i]) + '"></div>';
      $('#item_input').append(html);
    }
  })

  $('.btn.btn-danger').click(function () {
    id = $(this).attr('id');
    if (confirm("Really delete this order?")) {
      $.post('/orders/delete', id, function (data, success) {
        if (data == 'OK') {
          $('form').trigger("reset")
          location.reload()
        }
      })
    }
  })

  $('#modal-warning').on('hidden.bs.modal', function () {
    $('#item_input').html('')
  })

});