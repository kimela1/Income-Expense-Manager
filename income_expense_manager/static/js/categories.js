// Source: https://www.w3schools.com/howto/howto_js_filter_table.asp
function categories_search() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search_name");
    filter = input.value.toUpperCase();
    table = document.getElementById("categories_table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }
    }
}

function edit_categories(category_id){
    $.ajax({
        url: '/update_categories/' + category_id,
        type: 'POST',
        data: $('#update_categories').serialize(),
        success: function(result){
            // Redirect to URL
            window.location = '/categories';
        }
    })
};

function delete_categories(category_id){
    $.ajax({
        url: '/categories/' + category_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};