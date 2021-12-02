if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}


$(document).ready(function () {

  let $select1 = $('#company_select'),
    $select2 = $('#outlet_select'),
    $options = $select2.find('option');
  $select1.on('change', function () {
    $select2.html($options.filter('[data-dep="' + this.value + '"]'));
  }).trigger('change');

  $('#podate').datetimepicker({
    format: 'DD/MM/YYYY'
  });

  $('#fuldate').datetimepicker({
    format: 'DD/MM/YYYY'
  });
  

  $('.show_date').each(function (index, elem) {
    readable = $(elem).text()
    date = new Date(readable).toLocaleDateString()
    timearray = date.split('/')
    sgtime = timearray[1] +'/'+timearray[0] + '/'+timearray[2]
    $(elem).text(sgtime)
    //($(elem).text($.datepicker.formatDate(shortDateFormat, new Date($(elem).text()))))
  })

  $('.ful_date').each(function (index, elem) {
    readable = $(elem).text()
    date = new Date(readable).toLocaleDateString()
    timearray = date.split('/')
    sgtime = timearray[1] +'/'+timearray[0] + '/'+timearray[2]
    $(elem).text(sgtime)
    //($(elem).text($.datepicker.formatDate(shortDateFormat, new Date($(elem).text()))))
  })

  $('.del_date').each(function (index, elem) {
    // readable = $(elem).text()
    // date = new Date(readable).toLocaleDateString()
    // timearray = date.split('/')
    // sgtime = timearray[1] +'/'+timearray[0] + '/'+timearray[2]
    // $(elem).text(sgtime)
      //($(elem).text($.datepicker.formatDate(shortDateFormat, new Date($(elem).text()))))
  })

  $('#filter_date').datetimepicker({
    format: 'DD/MM/YYYY'
  });

  $('#filter_range').daterangepicker({
    locale: {
      format: 'DD/MMM/YYYY'
    }
  })

  $('#download_range').daterangepicker({
    locale: {
      format: 'DD/MMM/YYYY'
    }
  })

  $('#company_filter_button').click(function () {
    $('tr').show()
    let $company = $('#company_select');
    let x = $company.val();
    $('tr:has( td.company:not(:contains(' + x + ')))').hide()
  })

  $('#date_filter_button').click(function () {
    $('tr').show()
    let $date = $('#filter_date1');
    let dateparts = $date.val().split('/')
    let x = new Date(+dateparts[2], dateparts[1] - 1, +dateparts[0]);
    $('td.ful_date').each(function (j) {
      let dateparts = $(this).text().split('/')
      let y = new Date(+dateparts[2], dateparts[1] - 1, +dateparts[0]);
      if (x.getTime() != y.getTime()) {
        $(this).closest('tr').hide();
      }
    })
  })

  $('#range_filter_button').click(function () {
    $('tr').show()
    let $range = $('#filter_range');
    let [startdate, endate] = $range.val().split(' - ');
    startdate = new Date(startdate).getTime();
    endate = new Date(endate).getTime();
    $('td.ful_date').each(function (j) {
      let dateparts = $(this).text().split('/')
      let x = new Date(+dateparts[2], dateparts[1] - 1, +dateparts[0]).getTime();
      if (x < startdate || x > endate) {
        $(this).closest('tr').hide();
      }
    })
  })

  $('#clear_filter_button').click(function () {
    $('tr').show()
  })


  $('#expirydate').datetimepicker({
    format: 'DD/MM/YYYY'
  });

  $('#harvestdate').datetimepicker({
    format: 'DD/MM/YYYY'
  });

  $("#add_button").click(function () {
    $("#SKU_name").val($("select").val());
  })

  $('#withdraw_button').click(function () {
    var $inputs = $('form :input');
    var values = {};
    $inputs.each(function () {
      if ($(this).val())
        values[this.name] = $(this).val();
    });
    $.post('/inventory/withdraw', values, function (data, success) {
      if (data == 'OK') {
        $('form').trigger("reset")
        location.reload()
      }
    });
  });

  $('#set_button').click(function () {
    var $inputs = $('form :input');
    var values = {};
    $inputs.each(function () {
      if ($(this).val())
        values[this.name] = $(this).val();
    });
    $.post('/items/set', values, function (data, success) {
      if (data == 'OK') {
        $('form').trigger("reset")
        location.reload()
      }
    });
  });
  
  $('.btn.btn-warning').click(function () {
    let num = $(this).attr('id');
    $('#company_input').attr("placeholder", $('#company' + num).text());
    $('#outlet_input').attr("placeholder", $('#outlet' + num).text());
    $('#po_date_text').attr("placeholder", $('#po_date' + num).text());
    $('#ful_date_text').attr("placeholder", $('#ful_date' + num).text());
    $('#ponumber_input').attr("placeholder", $('#po_number' + num).text());
    $('#dnnumber_input').attr("placeholder", $('#dn_number' + num).text());
    $('#object_id_input').val($('#object_id' + num).text());
    //this the buggy one
    items = ($('#items' + num).text()).split('\n')
    //clean the string
    cleaned = []
    for (var i = 0; i < items.length - 2; i++) {
      if (items[i].search(': ') != -1) { cleaned.push(items[i].trim()) }
    }
    for (var i = 0; i < cleaned.length; i++) {
      sku = cleaned[i].split(':');
      html = '<div class="form-group">';
      html += '<label>' + sku[0] + ': </label>';
      html += '<input type="hidden" name="sku" value="' + sku[0] + '">';
      html += '<input type="number" class="form-control" name="quantity" value="' + Number(sku[1]) + '"></div>';
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