var ttable,
    addtransform;

var T = {
    transaction_table: null,
    add_transaction_form: null,
    start: function() {
        this.transaction_table = ttable = new Transaction_Table("transactions-tbody");
        this.add_transaction_form = addtransform = new AddTransactionForm();
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

    load_transactions_to_table() {
        T.transaction_table.clear_table();
        var search_data = T.transaction_table.get_search_data();

        var url = "/get_transactions_json/?";
        url += "start_date=" + search_data["start_date"];
        url += "&end_date=" + search_data["end_date"];

        if ( search_data.search_term && search_data.search_term.length > 0) {
            url += "&search_option=" + search_data["search_option"];
            url += "&search_term=" + search_data["search_term"];
        }

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

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
    },
    search_transactions() {
        T.transaction_table.clear_table();
        var search_data = T.transaction_table.get_search_data();

        var start_url = "/get_transactions_json/?";
        var append_url = "";

        append_url += "start_date=" + search_data["start_date"];
        append_url += "&end_date=" + search_data["end_date"];

        if ( search_data.search_term && search_data.search_term.length > 0) {
            if (search_data["search_option"] == "category") {
                start_url = "/transactions_by_category_name_json/?";
            }

            append_url += "&search_option=" + search_data["search_option"];
            append_url += "&search_term=" + search_data["search_term"];
        }
        let xhr = new XMLHttpRequest();
        xhr.open("GET", start_url + append_url, true);

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
    }
};

window.addEventListener("load", function(e) {
    T.start();
    T.load_transactions_to_table();
});