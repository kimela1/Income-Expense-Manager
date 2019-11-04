window.addEventListener("load", function(e) {
    // Add Data to Transactions Table
    transaction_table.add_transaction(1, "Job", "+500", "2019-10-16", true, "Job");
    transaction_table.add_transaction(2, "Ralphs", "-15", "2019-10-21", false, "Grocery");
    transaction_table.add_transaction(3, "76 Shell", "-24.36", "2019-10-20", false, "Gas");

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

        transaction_table.add_transaction(id, name, amount, date_string, income_status);
        
        document.getElementById("trans-form").reset();
    });

    var show_transactions_btn = document.getElementById("add-trans-btn");
    show_transactions_btn.addEventListener("click", function(e){
        var add_form = document.getElementById("trans-form");
        add_form.removeAttribute("hidden");

        show_transactions_btn.style.display = "none";
    });
});

var transaction_table = {
    add_transaction(id, name, amount, date_string, income_status, categories_str) {
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
        td.setAttribute("id", "name-" + id);
        tr.appendChild(td);

        // Add Amount
        td = document.createElement("td");
        td.innerText = amount;
        td.setAttribute("id", "amount-" + id);
        tr.appendChild(td);
        
        // Date
        td = document.createElement("td");
        td.innerText = date_string;
        td.setAttribute("id", "date-" + id);
        tr.appendChild(td);

        // Income / Expense
        td = document.createElement("td");
        td.setAttribute("id", "type-" + id);
        if (income_status) {
            td.innerText = "Income";
        } else {
            td.innerText = "Expense";
        }
        tr.appendChild(td);

        // Categories td
        td = document.createElement("td");
        td.setAttribute("id", "categories-" + id);
        td.textContent = categories_str;
        tr.appendChild(td);

        // Option buttons
        td = document.createElement("td");

        // EDIT BUTTON
        btn = document.createElement("button");
        btn.innerText = "📝"; 
        btn.setAttribute("type", "button");

        btn.setAttribute("id", "edit-" + id);

        // Edit transactions
        btn.addEventListener("click", function(e){
            // Get ID of Button Element
            var element_id = e.target.id;

            // Match this with the Regular Expression to get # at the end (true id)
            var id_regexp = /-(\d+)/;
            var result = id_regexp.exec(element_id);
            //Get ID from results
            var id = result[1];

            var amount_td       = document.getElementById("amount-" + id),
                name_td         = document.getElementById("name-" + id),
                date_td         = document.getElementById("date-" + id),
                type_td         = document.getElementById("type-" + id),
                categories_td   = document.getElementById("categories-" + id);

            var amount = parseInt(amount_td.innerText),
                name = name_td.innerText,
                date = date_td.innerText,
                type = type_td.innerText,
                categories = categories_td.innerText;
            
            amount_td.innerText = "";
            name_td.innerText = "";
            date_td.innerText = "";
            type_td.innerText = "";
            categories_td.innerText = "";

            var input = document.createElement("input");
            input.setAttribute("type", "number");
            input.value = amount;
            amount_td.append(input);

            
            input = document.createElement("input");
            input.setAttribute("type", "text");
            input.value = name;
            name_td.append(input);

            input = document.createElement("input");
            input.setAttribute("type", "date");
            input.value = date;
            date_td.append(input);

            input = document.createElement("select");
            var option = document.createElement("option");
            option.innerText = "Income";
            input.append(option);
            if (type == "Income")
                option.setAttribute("selected", "True")
            option = document.createElement("option");
            option.innerText = "Expense";
            if (type == "Expense")
                option.setAttribute("selected", "True");
            input.append(option);
            type_td.append(input);

            // Catagories Section
            var btn = document.createElement("button");
            btn.setAttribute("type", "button");
            btn.classList.add("btn");
            btn.innerText = categories + "❌";
            categories_td.append(btn);

            // Categories Plus Btn
            btn = document.createElement("button");
            btn.setAttribute("type", "button");
            btn.classList.add("btn");
            btn.innerText = "➕";
            categories_td.append(btn);
        });

        td.append(btn);

        // DELETE BUTTON
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