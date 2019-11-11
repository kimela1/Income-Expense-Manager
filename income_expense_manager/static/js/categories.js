window.addEventListener("load", function() {
    categories_table.add_row("Job", 1, [{"name": "Ralphs", "type": "Expense"}]);
    categories_table.add_row("Hobby", 1, []);
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

        td = document.createElement("td");
        var str = "";

        for (var i = 0; i < transaction_arr.length; i++) {
            str += transaction_arr[i]["name"] + " - [" + transaction_arr[i]["type"] + "] ";
        }

        td.innerText = str;

        tr.append(td);

        tbody.append(tr);
    },
};