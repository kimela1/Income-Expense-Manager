class Transaction {
    constructor(id, name, amount, date_string, type, category_ids, categories)  {
        this.db_id = id;
        this.name = name;
        this.amount = parseFloat(amount);
        this.date_string = date_string,
        this.type = type;
        this.categories = [];
        this.category_ids = [];
        this.edit_status = false;
        this.row_id;
        if (categories) {
            this.add_categories(category_ids, categories);
        }
    }
    
    // Adds categories to Transaction. 
    // Also handles displaying categories on html page
    add_categories(category_ids, categories) {
        for(var i = 0; i<categories.length; i++) {
            if (categories[i] == null)
                continue;
            this.category_ids.push(category_ids[i]);
            this.categories.push(categories[i]);
        }

        if (this.row_id) {
            if (!this.edit_status) {
                this.fill_category_nonedit_td();
            } else {
                this.fill_categories_edit_td();
            }  
        }
    }

    // Returns the TR element for the Transaction
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
        this.fill_category_nonedit_td(td);
        tr.appendChild(td);

        // Option buttons
        td = document.createElement("td");
        td.setAttribute("id", "options-" + row_id);

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

    // Removes category from transaction
    remove_category(category_id) {
        T.remove_transaction_category_relationship(this.db_id, this.type, category_id);
        for (var i = 0; i < this.category_ids.length; i++) {
            // Remove From catgories & category_ids Arrays
            if (this.category_ids[i] == category_id) {
                this.category_ids.splice(i,1);
                this.categories.splice(i,1);
                break;
            }
        }
    }
    // Fill categories TD in viewing mode with category elements
    fill_category_nonedit_td(td) {
        if (!td) {
            td = document.getElementById("categories-" + this.row_id);
        }
        while(td.firstChild)
            td.removeChild(td.firstChild)
         
        var category;
        for(var i = 0; i< this.categories.length; i++) {
            category = document.createElement("span");
            category.innerText = this.categories[i];
            category.classList.add("btn");
            category.classList.add("btn-outline-secondary");
            category.classList.add("btn-sm");
            td.append(category);
        }
    }
    // Fill categories TD in edit mode with category elements
    fill_categories_edit_td() {
        var categories_td = document.getElementById("categories-" + this.row_id);

        // Remove Children
        while (categories_td.firstChild) {
            categories_td.removeChild(categories_td.firstChild);
        }

        
        var btn;
        if (this.categories !== undefined && this.categories.length > 0) {
            // Catagories Buttons 
            for (var i=0; i<this.categories.length; i++) {
                btn = document.createElement("button");
                btn.setAttribute("type", "button");
                btn.classList.add("btn");
                btn.classList.add("btn-outline-secondary");
                btn.classList.add("btn-sm");
                btn.innerText = this.categories[i] + "❌";

                btn.setAttribute("value", this.category_ids[i]);
                categories_td.append(btn);

                // Remove Category / Transaction Btn / Relationship
                btn.addEventListener("click", function(e) {
                    var button = e.target;
                        var category_id = e.target.value;

                    this.remove_category(category_id);

                    button.parentElement.removeChild(button);
                }.bind(this));
            }
        }
        
        btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("data-toggle", "modal");
        btn.setAttribute("data-target", "#exampleModal");
        btn.classList.add("btn");
        btn.innerText = "➕";
        categories_td.append(btn);
        btn.addEventListener("click", function(e) {
            T.fill_categories_relationship(
                this.db_id,
                this.type,
                "trans-categories-relationship-select",
                this.remove_modal_duplicate_categories.bind(this),
            );
        }.bind(this));
    }

    // Remove any duplicate categories from the transaction table html page
    remove_modal_duplicate_categories() {
        var categories_obj = {};
        for(var i = 0; i < this.category_ids.length;i++) {
            categories_obj[this.category_ids[i]] = true;
        }
        var select = document.getElementById("trans-categories-relationship-select");
        var select_children = select.children;
        for (var i = 0; i < select_children.length; i++) {
            if (select_children[i].value in categories_obj) {
                select.removeChild(select_children[i]);
                i--;
            }
        }
    }

    // Convert the transaction row (in the html table)
    //  into the edit form so that users can update the transaction
    change_edit_form() {
        var row_id = this.row_id;

        if (!this.edit_status) {
            this.edit_status = true;
            
            var amount_td       = document.getElementById("amount-" + row_id),
                name_td         = document.getElementById("name-" + row_id),
                date_td         = document.getElementById("date-" + row_id),
                options_td      = document.getElementById("options-" + row_id);

            var amount = parseFloat(amount_td.innerText),
                name = name_td.innerText;
            
            amount_td.innerHTML = "";
            name_td.innerHTML = "";
            date_td.innerHTML = "";
            options_td.innerHTML = "";

            var input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("id", "edit-amount-input-" + row_id);
            input.value = amount;
            input.required = true;
            amount_td.append(input);

            
            input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("id", "edit-name-input-" + row_id);
            input.value = name;
            input.required = true;
            name_td.append(input);

            
            input = document.createElement("input");
            input.setAttribute("type", "date");
            input.setAttribute("value", this.date_string);
            input.setAttribute("id", "edit-date-input-" + row_id);
            input.required = true;
            date_td.append(input);

            this.fill_categories_edit_td();

            var btn = document.createElement("button");
            btn.innerText = "✔️";
            btn.setAttribute("type", "button");   

            btn.setAttribute("id", "submit-edit-" + row_id);
            btn.addEventListener("click", function(e) {
                var row_id = this.row_id;
                var name = document.getElementById("edit-name-input-" + row_id).value,
                    date = document.getElementById("edit-date-input-" + row_id).value,
                    amount = parseFloat(document.getElementById("edit-amount-input-" + row_id).value);

                if (name.length >0 && date && amount) {
                    var o = {
                        name: name,
                        date: date,
                        amount: amount
                    };
                    T.update_transaction(this.db_id, this.type, o);
    
                    this.name = name;
                    this.date_string = date;
                    this.amount = amount;
    
                    // Revert Edit Form
                    this.change_edit_form();
                } else {
                    window.alert("One of the input values was entered incorrectly");
                }
                
            }.bind(this));
        
            options_td.append(btn);

            var btn = document.createElement("button");
            btn.innerText = "✖️";
            btn.setAttribute("type", "button");   

            btn.setAttribute("id", "delete-" + row_id);
            btn.addEventListener("click", function(e) {
                this.change_edit_form();
            }.bind(this));
        
            options_td.append(btn);  
        } else {
            this.edit_status = false;
            var old_tr = document.getElementById("tr-" + row_id),
                new_tr = this.get_tr(row_id);
            old_tr.parentNode.replaceChild(new_tr, old_tr);
        }
    }
}