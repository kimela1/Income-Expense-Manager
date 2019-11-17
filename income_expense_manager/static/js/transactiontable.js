class Transaction {
    constructor(id, name, amount, date_string, income_status, categories)  {
        this.name = name;
        this.amount = amount;
        this.date_string = date_string,
        this.income_status = income_status;
        this.categories = []
        if (categories) {
            this.add_categories(categories);
        }
    }
    
    add_categories(categories) {
        for(var i = 0; i<categories.length; i++) {
            this.categories.push(categories[i]);
        }
    }

    get_tr(row_id) {
        var tr = document.createElement("tr");

        tr.setAttribute("id", "tr-" + row_id);

        var td = document.createElement("td");
        var btn = document.createElement("button");
        
        // Add # Rows
        td.innerText = row_id;
        tr.appendChild(td);

        // Name
        td = document.createElement("td");
        td.innerText = this.name;
        td.setAttribute("id", "name-" + row_id);
        tr.appendChild(td);

        // Add Amount
        td = document.createElement("td");
        td.innerText = this.amount;
        td.setAttribute("id", "amount-" + row_id);
        tr.appendChild(td);
        
        // Date
        td = document.createElement("td");
        td.innerText = this.date_string;
        td.setAttribute("id", "date-" + row_id);
        tr.appendChild(td);

        // Income / Expense
        td = document.createElement("td");
        td.setAttribute("id", "type-" + row_id);
        if (this.income_status) {
            td.innerText = "Income";
        } else {
            td.innerText = "Expense";
        }
        tr.appendChild(td);

        // Categories td
        td = document.createElement("td");
        td.setAttribute("id", "categories-" + row_id);
        var categories_str = "";
        for(var i = 0; i< this.categories.length; i++) {
            categories_str += " " + this.categories[i];
        }
        td.textContent = categories_str;
        tr.appendChild(td);

        // Option buttons
        td = document.createElement("td");

        // EDIT BUTTON
        btn = document.createElement("button");
        btn.innerText = "📝"; 
        btn.setAttribute("type", "button");

        btn.setAttribute("id", "edit-" + row_id);

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

        btn.setAttribute("id", "delete-" + row_id);
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
        
        return tr;
    }
}

class Transaction_Table {
    constructor(tbody_id) {
        this.tbody_id = tbody_id;
        this.transactions = [];
    }

    create_table() {
        
    }

    add_transaction(id, name, amount, date_string, income_status, categories_str) {
        var tbody = document.getElementById("transactions-tbody");
        var t = new Transaction(id, name, amount, date_string, income_status, [categories_str,]);
        this.transactions.push(t);

        var tr = t.get_tr(this.transactions.length);

        tbody.append(tr);
    }

    create_edit_transaction_row() {

    }

    delete_transaction() {
        
    }
}