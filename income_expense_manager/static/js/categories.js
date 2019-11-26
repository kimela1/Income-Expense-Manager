/* window.addEventListener("load", function() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_categories_json", true);
    xhr.onload = function() {
        var categories = JSON.parse(xhr.response);
        // Add Data to categories table
        for (var i = 0; i<categories.length; i++) {
            var t = categories[i];
            var type = (t["type"] == "inex_income" ? true : false),
                transaction_name = t["transaction_name"],
                category_name = t["category_name"],
                category_id = t["category_id"];
            categories_table.add_row(category_name, i, [{"name": transaction_name, "type": type}]);
        }
    }
    xhr.send();
});
var categories_table = {
    add_row(category_name, category_id, transaction_arr) {
        var tbody = document.getElementById("categories-tbody");
        var tr = document.createElement("tr");
        tr.setAttribute("id", "tr-" + category_id);
        // Category Name
        var td = document.createElement("td");
        td.innerText = category_name;
        td.setAttribute("id", "category-td-"+ category_id);
        tr.append(td);
        td = document.createElement("td");
        // EDIT BUTTON
        btn = document.createElement("button");
        btn.innerText = "📝"; 
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "edit-" + category_id);
        // Edit transactions
        btn.addEventListener("click", function(e){
            // Get ID of Button Element
            var element_id = e.target.id;
            console.log(element_id);
            // Match this with the Regular Expression to get # at the end (true id)
            var id_regexp = /-(\d+)/;
            var result = id_regexp.exec(element_id);
            //Get ID from results
            var id = result[1];
            var new_name = window.prompt("What will be the new category name?");
            if (new_name) {
                var category_td = document.getElementById("category-td-" + id);
                category_td.innerText = new_name;
            }
        });
        td.append(btn);
        // DELETE BUTTON
        btn = document.createElement("button");
        btn.innerText = "❌";
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "delete-" + category_id);
        btn.addEventListener("click", function(e) {
            // Get ID of Button Element
            var element_id = e.target.id;
            // Match this with the Regular Expression to get # at the end (true id)
            var id_regexp = /-(\d+)/;
            var result = id_regexp.exec(element_id);
            //Get ID from results
            var id = result[1];
            // Get TR element by the ending ID
            var tr = document.getElementById("tr-" + id);
            // Get its parent element (because you have to delete it from the parent element)
            // It will be <tbody> in this case
            var parent_element = tr.parentElement;
            // Remove the row element tr from the tbody element with removeChild
            parent_element.removeChild(tr);
        });
    
        td.append(btn);
    
        tr.append(td);
        tbody.append(tr);
    },
}; 
*/

/*
function categories_search() {
    // Get name 
    var search_name = document.getElementById('search_name').value
    // Redirect to URL
    window.location = '/categories/search/' + encodeURI(search_name)
}*/

function edit_categories(category_id){
    $.ajax({
        url: '/update_categories/' + category_id,
        type: 'PUT',
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