class Transaction {
    constructor(id, name, amount, date_string, type, category_ids, categories)  {
        this.db_id = id;
        this.name = name;
        this.amount = amount;
        this.date_string = date_string,
        this.type = type;
        this.categories = []
        this.category_ids = []
        if (categories) {
            this.add_categories(category_ids, categories);
        }
        this.row_id;
    }
    
    add_categories(category_ids, categories) {
        for(var i = 0; i<categories.length; i++) {
            this.category_ids.push(category_ids[i]);
            this.categories.push(categories[i]);
        }

        if (this.row_id) {
            var td = document.getElementById("categories-" + this.row_id);
            var categories_str = "";
            for(var i = 0; i< this.categories.length; i++) {
                categories_str += " " + this.categories[i];
            }
            td.textContent = categories_str;
        }
    }

    get_tr(row_id) {
        this.row_id = row_id;

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
        if (this.type == "inex_income") {
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

            this.change_edit_form();
        }.bind(this));

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

            T.transaction_table.delete_transaction(
                this.type, this.db_id, id
            );
        }.bind(this));
    
        td.append(btn);             
        tr.appendChild(td);
        
        return tr;
    }

    change_edit_form() {
        var row_id = this.row_id;
        var amount_td       = document.getElementById("amount-" + row_id),
            name_td         = document.getElementById("name-" + row_id),
            date_td         = document.getElementById("date-" + row_id),
            type_td         = document.getElementById("type-" + row_id),
            categories_td   = document.getElementById("categories-" + row_id);

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
    }
}

class Transaction_Table {
    constructor(tbody_id) {
        this.num_transactions = 0;
        this.tbody_id = tbody_id;
        this.transactions = {
            "inex_income": {},
            "inex_expense": {}
        };
    }

    add_transaction(transaction_object) {
        var tbody = document.getElementById("transactions-tbody");

        var id = transaction_object["id"],
            type = transaction_object["type"],
            categories = [transaction_object["category_name"],],
            category_ids = [transaction_object["category_id"],];

        // Transaction already exists, Add only Category
        if (this.transactions[type][id]) {
            this.transactions[type][id].add_categories(category_ids, categories)
        } else {
            this.num_transactions++;

            var t = new Transaction(
                id, 
                transaction_object["name"], 
                transaction_object["amount"], 
                transaction_object["date_string"], 
                type,
                category_ids,
                categories,
                );

            this.transactions[type][id] = t;
    
            var tr = t.get_tr(this.num_transactions);
    
            tbody.append(tr);
        }
    }

    create_edit_transaction_row() {

    }

    delete_transaction(type, db_id, element_id) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/ajax_delete_transaction", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        var body = { id: db_id, type:type };

        xhr.onload = function() {
        }
        xhr.send(JSON.stringify(body));
        
        this.num_transactions--;

        // Delete from transaction Dictionary/ Object
        delete this.transactions[type][db_id];

        // Get TR element by the ending ID
        var tr = document.getElementById("tr-" + element_id);
        // Get its parent element (because you have to delete it from the parent element)
        // It will be <tbody> in this case
        var parent_element = tr.parentElement;
        // Remove the row element tr from the tbody element with removeChild
        parent_element.removeChild(tr);
    }
}