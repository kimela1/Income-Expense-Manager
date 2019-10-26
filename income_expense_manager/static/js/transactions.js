window.addEventListener("load", function(e) {
    // Add Data to Transactions Table
    transaction_table.add_transaction(1, "Job", "+500", "2019-10-16", true);
    transaction_table.add_transaction(2, "Groceries", "-15", "2019-10-21", false);
    transaction_table.add_transaction(3, "Gas", "-24.36", "2019-10-20", false);

    var submit_button = document.getElementById("trans-submit");

    submit_button.addEventListener("click", function(e) {
        e.preventDefault();

        var tbody = document.getElementById("transactions-tbody");
        var name_input = document.getElementById("name-input"),
            amount_input = document.getElementById("amount-input"),
            date_input = document.getElementById("date-input"),
            income_radio = document.getElementById("income-radio");
            //edit_button = document.getElementById("edit_button"),
            //delete_button = document.getElementById("delete_button");

        // ID for now. Needs to be replaced later with real ID.
        var num_rows = tbody.childElementCount;
        var id = num_rows+1;
        
        var name = name_input.value,
            amount = amount_input.value,
            date_string = date_input.value;
        
        var income_status;
        // If income radio is checked
        if (income_radio.checked)
            income_status = true;
        else
            income_status = false;

        transaction_table.add_transaction(id, amount, date_string, income_status);
        
        document.getElementById("trans-form").reset();
    });
});

var transaction_table = {
    add_transaction(id, name, amount, date_string, income_status) {
        var tbody = document.getElementById("transactions-tbody");
        var tr = document.createElement("tr");

        tr.setAttribute("id", "tr-" + id);

        var td = document.createElement("td");
        var btn = document.createElement("button");
        
        // Add # Rows
        td.innerText = id;
        tr.appendChild(td);

        // Name
        td = document.createElement("td");
        td.innerText = name;
        tr.appendChild(td);

        // Add Amount
        td = document.createElement("td");
        td.innerText = amount;
        tr.appendChild(td);
        
        // Date
        td = document.createElement("td");
        td.innerText = date_string;
        tr.appendChild(td);

        // Income / Expense
        td = document.createElement("td");
        if (income_status) {
            td.innerText = "Income";
        } else {
            td.innerText = "Expense";
        }
        tr.appendChild(td);

        // Option buttons
        td = document.createElement("td");

        btn = document.createElement("button");
        btn.innerText = "📝"; 
        btn.setAttribute("type", "button");   

        td.append(btn);     

        btn = document.createElement("button");
        btn.innerText = "❌";         
        btn.setAttribute("type", "button");   

        btn.setAttribute("id", "delete-" + id);
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
        tr.appendChild(td);    
        
        tbody.append(tr);

    }
};