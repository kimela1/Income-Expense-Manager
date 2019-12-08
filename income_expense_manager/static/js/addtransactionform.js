class AddTransactionForm {
    constructor() {
        this.set_date();
        this.hide_handler();
        this.submit_handler();
        this.cancel_handler();
        this.set_categories();

        this.hidden = false;
        this.toggle_hide();
    }

    // Set Amount Date Input to Today
    set_date() {
        var date_input = document.getElementById("date-input");
        date_input.valueAsDate = new Date();
    }

    hide_handler() {
        var show_transactions_btn = document.getElementById("add-trans-btn");
    
        show_transactions_btn.addEventListener("click", function(e){
            this.toggle_hide();
        }.bind(this)
        );
    }

    // Fills the categories select menu
    set_categories() {        
        T.fill_categories_option("categories-select");
    }

    // Hides / Shows the Add Transaction Form
    toggle_hide() {
        var show_transactions_btn = document.getElementById("add-trans-btn");
        var add_form = document.getElementById("trans-form");
        if (this.hidden) {
            this.hidden = false;
            add_form.style.display = "block";
            show_transactions_btn.style.display = "none";
        } else {
            this.hidden = true;
            add_form.style.display = "none";

            show_transactions_btn.style.display = "block";
            
        }
    }

    // Method to get the values from the html transaction form
    // Returns the Transactions data as an object
    get_values() {
        var name_input = document.getElementById("name-input"),
            amount_input = document.getElementById("amount-input"),
            date_input = document.getElementById("date-input"),
            income_radio = document.getElementById("income-radio");
            //edit_button = document.getElementById("edit_button"),
            //delete_button = document.getElementById("delete_button");
        
        var categories_id = [],
            categories_name = [];
        var select = document.getElementById("categories-select");
        var option;
        for (var i = 0; i < select.length; i++) {
            option = select[i];
            if (option.selected) {
                categories_id.push(option.value);
                categories_name.push(option.text);
            }
        }

        var new_transaction = {
            name: name_input.value,
            amount: amount_input.value,
            date: date_input.value,
            type:  document.querySelector('input[name=type]:checked').value,
            category_id: categories_id,
            category_name: categories_name
        };

        return new_transaction;
    }

    // When user submits the add form to add a transaction
    submit_handler() {
        var submit_button = document.getElementById("trans-submit");

        submit_button.addEventListener("click", function(e) {
            e.preventDefault();
    
            var tbody = document.getElementById("transactions-tbody");
            
            var new_transaction = this.get_values();
    
            // ttable.add_transaction(id, name, amount, date_string, income_status);
            T.add_transaction_by_form(new_transaction)
            
            this.reset_form();
        }.bind(this));
    }

    // Handler when user presses on cancel button
    cancel_handler() {
        var cancel_button = document.getElementById("trans-cancel");
        cancel_button.addEventListener("click", function(e) {
            this.reset_form();
            this.toggle_hide();
        }.bind(this));
    }

    // Resets the entire form except date input
    reset_form() {
        var date_input = document.getElementById("date-input"),
            value = date_input.value;
        document.getElementById("trans-form").reset();
        date_input.value = value;
    }
}