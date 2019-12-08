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
        this.month_time_span = 6;
        this.set_date_range_inputs();
        this.add_search_submit_handler();
    }

    // Search handler for search bar/ form
    add_search_submit_handler() {
        var form = document.getElementById("search-form");
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            T.search_transactions();
        })
    }

    show_total_amount() {
        var total = 0.0;
        var incomes = this.transactions.inex_income,
            expenses = this.transactions.inex_expense;
        var id;
        for (id in incomes) {
            total += incomes[id].amount;
        }
        for (id in expenses) {
            total -= expenses[id].amount;
        }
        var amount_element = document.getElementById("total-amount-element");
        amount_element.innerText = total;
    }

    // Add Transactions to table or add category to transactions
    //  if the transaction already exists
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
            this.show_total_amount();
        }
    }

    set_add_category_relationship_status(transaction_id, type) {
        this.add_transaction_category_relationship = this.transactions[type][transaction_id];
    }

    // Delete a transaction
    // this.num_transactions NOT decreased
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

        this.show_total_amount()
    }

    // Add Handler for deleting / adding categories to transactions
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

    // Set the search date inputs to a time interval
    //  the first 1 one month and the last day in the last month
    //  Set by this.month_time.span
    set_date_range_inputs() {
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
    }

    // Sets date inputs to default date if values are undefined.
    get_search_data() {
        var start_date = document.getElementById("start-date-input").value,
            end_date = document.getElementById("end-date-input").value;

        // if Dates were blank for some reason, set it default 6 months of present
        if (!end_date || !start_date) {
            this.set_date_range_inputs();
            start_date = document.getElementById("start-date-input").value,
            end_date = document.getElementById("end-date-input").value;
        }

        // If start_date is later than end_date
        if (start_date > end_date) {
            var temp = start_date;
            start_date = end_date;
            end_date = temp;
        }

        // Get Search term if it exists
        var option = document.getElementById("search-select").value,
            search_term = document.getElementById("search-term-input").value;
        
        switch(option) {
            case "1": option = "name"; break;
            case "2": option = "category"; break;
            default: search_term = "";
        }

        return {
            start_date: start_date,
            end_date: end_date,
            search_term: search_term,
            search_option: option,
        }
    }

    // Delete all transactions & clear from display
    clear_table() {
        var income = this.transactions.inex_income,
            expense = this.transactions.inex_expense;

        for (var member in income) delete income[member];
        for (var member in expense) delete expense[member];

        this.transactions = {
            "inex_income": {},
            "inex_expense": {}
        };

        var tbody = document.getElementById(this.tbody_id);
        while (tbody.firstChild){
            tbody.removeChild(tbody.firstChild);
        }
    }

    // Returns data required for displaying for Chart.js
    // [ {x: date_string, y: income/expense amount}]
    // The dictionaries in the array are sorted
    get_chart_data(type) {
        var data_arrs;
        if (type == "inex_income" || type == "income") {
            data_arrs = this.transactions["inex_income"];
        } else {
            data_arrs = this.transactions["inex_expense"];
        }
        var data = {};

        var date_string, amount, i, e;
        // Get Income Data for Chart
        for (var id in data_arrs) {
            i = data_arrs[id];
            amount = i["amount"]
            date_string = i["date_string"]
            if (date_string in data) {
                data[date_string] += amount;
            } else {
                data[date_string] = amount;
            }
        }
        data_arrs = [];
        for (var date_string in data) {
            data_arrs.push({x: date_string, y: data[date_string]});
        }
        data_arrs.sort(function(first, second) {
            if (second.x > first.x)
                return -1;
            if (second.x < first.x)
                return 1;
            return 0;
        });
        return data_arrs;
    }

    // Display the transactions to chart with Charts
    // Chart Div is 'transactions-chart'
    display_chart() {
        var expense_arr = this.get_chart_data("inex_expense"),
            income_arr = this.get_chart_data("inex_income");

        var ctx = document.getElementById('transactions-chart').getContext('2d');
        
        var timeFormat = 'YYYY-MM-DD';

        var config = {
            type:    'line',
            data:    {
                datasets: [
                    {
                        label: "Expense",
                        data: expense_arr,
                        fill: false,
                        borderColor: 'red'
                    },
                    {
                        label: "Income",
                        data:income_arr,
                        fill: false,
                        borderColor: 'green'
                    },
                ]
            },
            options: {
                elements: {
                    line: {
                        tension: .4
                    }
                },
                responsive: true,
                title:      {
                    display: true,
                    text:    "Chart.js Time Scale"
                },
                scales:     {
                    xAxes: [{
                        type:       "time",
                        time:       {
                            format: timeFormat,
                            tooltipFormat: 'll'
                        },
                        scaleLabel: {
                            display:     true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display:     true,
                            labelString: 'value'
                        }
                    }]
                }
            }
        };
        new Chart(ctx, config);
    }
        
}