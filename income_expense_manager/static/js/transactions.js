var ttable = new Transaction_Table("transactions-tbody");

window.addEventListener("load", function(e) {
    
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
                date_string: t["date"],
                amount: t["amount"],
                id: t["id"]
            }
            
            ttable.add_transaction(o);
        }
    }

    xhr.send();

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

        ttable.add_transaction(id, name, amount, date_string, income_status);
        
        document.getElementById("trans-form").reset();
    });

    var show_transactions_btn = document.getElementById("add-trans-btn");
    show_transactions_btn.addEventListener("click", function(e){
        var add_form = document.getElementById("trans-form");
        add_form.removeAttribute("hidden");

        show_transactions_btn.style.display = "none";
    });
});
