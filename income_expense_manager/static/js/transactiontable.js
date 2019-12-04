class Transaction_Table {
    constructor(tbody_id) {
        // Transaction Counter, Used for ROW_ID
        // Only Increment
        this.transaction_counter = 0;
        this.tbody_id = tbody_id;
        this.transactions = {
            "inex_income": {},
            "inex_expense": {}
        };
        this.add_transaction_category_relationship = null;

        this.add_category_relationship_handler();
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
            this.transaction_counter++;

            var date_string = transaction_object["date"],
                re = /(\d{4}-\d{2}-\d{2})/;

            // Convert Date to yyyy-mm-dd
            var con_date_string = date_string.match(re)[1];

            var t = new Transaction(
                id, 
                transaction_object["name"], 
                transaction_object["amount"], 
                con_date_string, 
                type,
                category_ids,
                categories,
                );

            this.transactions[type][id] = t;
    
            var tr = t.get_tr(this.transaction_counter);
    
            tbody.append(tr);
        }
    }

    set_add_category_relationship_status(transaction_id, type) {
        this.add_transaction_category_relationship = this.transactions[type][transaction_id];
    }

    delete_transaction(type, db_id, element_id) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/ajax_delete_transaction", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        var body = { id: db_id, type:type };

        xhr.onload = function() {
        }
        xhr.send(JSON.stringify(body));

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

    add_category_relationship_handler() {
        var submit_btn = document.getElementById("add-category-relationship-btn");
        submit_btn.addEventListener("click", function(e) {
            var category_select = document.getElementById("trans-categories-relationship-select"),
                category_id = category_select.value,
                category_name = category_select.options[category_select.selectedIndex].text;
            
            var trans = this.add_transaction_category_relationship;
            T.add_category_relationship(trans.db_id, trans.type, category_id);

            // Renew Categories TD
            trans.add_categories([category_id,], [category_name,]);
            
            // Close Modal Menu
            var btn = document.getElementById("close-category-modal-btn");
            btn.click();
        }.bind(this))
    }
}