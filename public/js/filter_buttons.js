if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}


$(document).ready(function () {
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
 

  //for populating modal when editing orders
  // $('.btn.btn-warning').click(function () {
  //   let num = $(this).attr('id');
  //   $('#company_input').attr("placeholder", $('#company' + num).text());
  //   $('#outlet_input').attr("placeholder", $('#outlet' + num).text());
  //   $('#po_date_text').attr("placeholder", $('#po_date' + num).text());
  //   $('#ful_date_text').attr("placeholder", $('#ful_date' + num).text());
  //   $('#ponumber_input').attr("placeholder", $('#po_number' + num).text());
  //   $('#dnnumber_input').attr("placeholder", $('#dn_number' + num).text());
  //   $('#object_id_input').val($('#object_id' + num).text());
  //   //this the buggy one
  //   items = ($('#items' + num).text()).split('\n')
  //   //clean the string
  //   cleaned = []
  //   for (var i = 0; i < items.length - 2; i++) {
  //     if (items[i].search(': ') != -1) { cleaned.push(items[i].trim()) }
  //   }
  //   for (var i = 0; i < cleaned.length; i++) {
  //     sku = cleaned[i].split(':');
  //     html = '<div class="form-group">';
  //     html += '<label>' + sku[0] + ': </label>';
  //     html += '<input type="hidden" name="sku" value="' + sku[0] + '">';
  //     html += '<input type="number" class="form-control" name="quantity" value="' + Number(sku[1]) + '"></div>';
  //     $('#item_input').append(html);
  //   }
  // })

  // $('.btn.btn-danger').click(function () {
  //   id = $(this).attr('id');
  //   if (confirm("Really delete this order?")) {
  //     $.post('/orders/delete', id, function (data, success) {
  //       if (data == 'OK') {
  //         $('form').trigger("reset")
  //         location.reload()
  //       }
  //     })
  //   }
  // })



});