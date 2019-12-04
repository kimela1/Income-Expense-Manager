var ttable,
    addtransform;

var T = {
    transaction_table: null,
    add_transaction_form: null,
    start_date: null,
    end_date: null,
    month_time_span: 6,
    set_dates() {
        var start_date = document.getElementById("start-date-input"),
            end_date = document.getElementById("end-date-input");

        var end = new Date(),
            start = new Date();
        
        end.setMonth(end.getMonth() + 1);
        end.setDate(-1);
        end_date.valueAsDate = end;

        start.setMonth(start.getMonth() - this.month_time_span);
        start.setDate(0);
        start_date.valueAsDate = start;

        console.log(start_date, end_date);

    },

    start: function() {
        this.transaction_table = ttable = new Transaction_Table("transactions-tbody");
        this.add_transaction_form = addtransform = new AddTransactionForm();
        this.set_dates();
    },
    remove_transaction_category_relationship(transaction_id, type, category_id) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/ajax_remove_transaction_category_relationship", true);

        xhr.setRequestHeader("Content-Type", "application/json");
        var o = { 
            "type": type,
            "transaction_id": transaction_id,
            "category_id": category_id,
        }

        xhr.onload = function() {}
        xhr.send(JSON.stringify(o));
    },
    // edit_obj = includes name, amount, date
    update_transaction(transaction_id, type, edit_obj) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/ajax_update_transaction", true);

        xhr.setRequestHeader("Content-Type", "application/json");
        var o = {
            "type": type,
            "transaction_id": transaction_id,
            "name": edit_obj["name"],
            "date": edit_obj["date"],
            "amount": edit_obj["amount"],
        }

        xhr.onload = function() {}
        xhr.send(JSON.stringify(o));
    },
    get_categories_data(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/get_categories_json", true);

        xhr.onload = function() {
            if (xhr.status != 200) {
                alert( 'Error: ' + xhr.status);
                return;
            } else {
                callback(xhr.response);
            }
        }

        xhr.send();
    },
    // Fills options into select element.
    // callback function, if it exists, is used
    // to remove options, select already known.
    fill_categories_option(select_id, callback) {
        function make_categories(xhr_response) {
            var categories = JSON.parse(xhr_response);

            var select = document.getElementById(select_id),
                option;
            // Clear select child
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }

            // Add Categories to Select Menu
            for (var i = 0; i<categories.length; i++) {
                var c = categories[i];
                
                var id = c.category_id,
                    name = c.category_name;

                option = document.createElement("option");
                option.innerText = name;
                option.setAttribute("value", id);
                
                select.append(option);
            }

            if (callback)
                callback();
        }
        T.get_categories_data(make_categories);
    },
    // Fill select element with categories for modal form to add
    // relationships to a transaction. Also, flags it with Transaction Table instance
    fill_categories_relationship(transaction_id, type, options_id, callback) {
        ttable.set_add_category_relationship_status(transaction_id, type);
        T.fill_categories_option(options_id, callback);
    },
    add_category_relationship(transaction_id, type, category_id) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/ajax_set_transaction_category_relationship", true);

        xhr.setRequestHeader("Content-Type", "application/json");
        var o = {
            "type": type,
            "transaction_id": transaction_id,
            "category_id": category_id,
        }

        xhr.onload = function() {}
        xhr.send(JSON.stringify(o));
    },
};

window.addEventListener("load", function(e) {
    T.start();
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_transactions_json", true);

    xhr.onload = function() {
        var transactions = JSON.parse(xhr.response);
        // Add Data to Transactions Table
        for (var i = 0; i<transactions.length; i++) {
            var t = transactions[i];
            var o = {
                type: t["type"],
                name: t["name"],
                category_name: t["category_name"],
                category_id: t["category_id"],
                date: t["date"],
                amount: t["amount"],
                id: t["id"]
            }
            ttable.add_transaction(o);
        }
    }
    xhr.send();
});
