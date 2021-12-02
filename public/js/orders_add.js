$(document).ready(function () {
    orders_array = []
    $('#excel').click(function () {
        let data = new FormData($('#uploadForm')[0]);
        $.ajax({
            url: "/orders/add_orders_excel",
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: function (data, textStatus, jqXHR) {
                for (i = 0; i < data.length; i++) {
                    html = "<tr> <th scope=\"row\">" + (i + 1) + "</th>"
                    html += "<th>" + data[i].Client + "</th>"
                    html += "<th>" + data[i].Outlets + "</th>"
                    html += "<th>" + data[i]["PO Number"] + "</th>"
                    items = "<th>"
                    Object.keys(data[i].items).forEach(function (key) {
                        items += key + " :" + "<br>"
                    })
                    html += items + "</th>"
                    items = "<th>"
                    Object.keys(data[i].items).forEach(function (key) {
                        items += data[i].items[key] + "<br>"
                    })
                    html += items + "</th>"
                    html += "<th>" + data[i]["Fulfilment Date"] + "</th>"
                    html += "</tr>"
                    $("#table_body").append(html)
                }
                $('#modal-success').modal("show");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //if fails  
                alert("Form error please upload valid form")
            }
        });

    })

    $('#modal_submit').click(function () {
        if (confirm("Submit these orders?")) {
            $.post('/orders/submit_objects', orders_array, function (data, success) {
                if (data == 'OK') {
                    $('form').trigger("reset")
                    location.reload()
                }
            })
        }
    })
    $('#modal-success').on('hidden.bs.modal', function () {
        $("#table_body").html('')
    })
    $('#order_button').click(function () {
        if (!isFilled()) return alert('Fill in all fields')
        let order = $('#manual_add_form').serialize();
        $.post('/orders/add', order, function () {
        })
            .done(data => {
                string = ''
                for(i = 0; i<data.items.length; i++){
                    string += data.items[i].SKU + ': ' + data.items[i].quantity +'</br>'
                }
                $(document).Toasts('create', {
                    class: 'bg-success',
                    title: 'Success!',
                    autohide: false,
                    body: ('Order: ' + data.po + ' created!</br>' + string)
                })
                $('#manual_add_form')[0].reset()
            })
            .fail(data => {
                $(document).Toasts('create', {
                    class: 'bg-danger',
                    title: 'FAIL!',
                    autohide: true,
                    delay: 3000,
                    body: ('Order: ' + order.po_number)
                })
            })

    });
    $('.delete_sku').click(function () {
        let name = $(this).closest('tr').children('td.name').text();
        if (!confirm("Delete " + name + " ?")) return
        row = $(this).closest('tr');
        $.ajax({
          url: '/items/delete_sku',
          type: 'DELETE',
          data: { "SKU_name": name },
          success: function (result) {
            row.remove();
          }
        });
      })
})
function isFilled() {
    let filled = true
    $('[required]').each(function () {
        if ($(this).val() === '') {
            filled = false
            $(this).css("background-color", "#f07c7c")
        } else {
            $(this).css("background-color", "#FFF")
        }
    })
    return filled
}
function addInput() {
    let num_inputs = $('.row.input-group').length;
    let html = '<div class="row input-group"  id="input_group_' +
        num_inputs +
        '"><input placeholder="Item" class="form-control" list="SKUs" name="items[' +
        num_inputs +
        '][SKU]">\n<input type="number" placeholder="Quantity" class="form-control" min="1" oninput="validity.valid||(value="");" name="items[' +
        num_inputs +
        '][quantity]"></div>';
    $('#input_column').append(html);
}

function removeInput() {
    let num_inputs = $('.row.input-group').length;
    if (num_inputs == 1) return;
    num_inputs--;
    $('#input_group_' + num_inputs).remove()
}