if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}
function invoice(id){
  $('#object_id_input').val(id);
}


$(document).ready(function () {

  
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

 

  // $('.btn.btn-primary').click(function () {
  //   id = $(this).attr('id');
  //   if (confirm("Invoice done?")) {
  //     $.post('/orders/invoice', id, function (data, success) {
  //       if (data == 'OK') {
  //         $('form').trigger("reset")
  //         location.reload()
  //       }
  //     })
  //   }
  // })

  $('#modal-warning').on('hidden.bs.modal', function () {
    $('#item_input').html('')
  })

});