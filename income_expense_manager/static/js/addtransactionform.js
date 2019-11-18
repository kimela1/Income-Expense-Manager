class AddTransactionForm {
    constructor() {
        this.set_date();
        this.hide_handler();
        this.submit_handler();
        this.set_categories();

        this.hidden = false;
        this.toggle_hide();
    }

    set_date() {
        // Set Amount Date Input to Today
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

    set_categories() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/get_categories_json", true);

        xhr.onload = function() {
            var categories = JSON.parse(xhr.response);

            var select = document.getElementById("categories-select"),
                option;

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
        }

        xhr.send();
    }

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

    submit_handler() {
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
            
            var categories = [];
            var select = document.getElementById("categories-select");
            var option;
            for (var i = 0; i < select.length; i++) {
                option = select[i];
                if (option.selected) {
                    categories.push(option.value);
                }
            }
    
    
            // ID for now. Needs to be replaced later with real ID.
            var num_rows = tbody.childElementCount;
            var id = num_rows+1;
            
            var new_transaction = {
                name: name_input.value,
                amount: amount_input.value,
                date: date_input.value,
                type:  document.querySelector('input[name=type]:checked').value,
                categories: categories,
            };

            console.log(new_transaction);
    
            // ttable.add_transaction(id, name, amount, date_string, income_status);
            
            document.getElementById("trans-form").reset();
        });
    }


}