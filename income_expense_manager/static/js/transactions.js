window.addEventListener("load", function(e) {
    var submit_button = document.getElementById("trans-submit");

    submit_button.addEventListener("click", function(e) {
        e.preventDefault();

        var tbody = document.getElementById("transactions-tbody");
        var amount_input = document.getElementById("amount-input"),
            date_input = document.getElementById("date-input"),
            income_radio = document.getElementById("income-radio");
            //edit_button = document.getElementById("edit_button"),
            //delete_button = document.getElementById("delete_button");

            
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var btn = document.createElement("button");
        
        // Add # Rows
        var num_rows = tbody.childElementCount;
        td.innerText = num_rows+1;
        tr.appendChild(td);

        // Add Amount
        td = document.createElement("td");
        td.innerText = amount_input.value;
        tr.appendChild(td);
        
        // Date
        td = document.createElement("td");
        td.innerText = date_input.value;
        tr.appendChild(td);

        // Income / Expense
        td = document.createElement("td");
        if (income_radio.checked) {
            td.innerText = "Income";
        } else {
            td.innerText = "Expense";
        }
        tr.appendChild(td);

        // Option buttons
        btn = document.createElement("button");
        btn.innerText = "📝"; 
        btn.setAttribute("type", "button");                  
        tr.appendChild(button);     

        btn = document.createElement("button");
        btn.innerText = "❌";         
        btn.setAttribute("type", "button");                  
        tr.appendChild(button);    
        
        tbody.append(tr);

        document.getElementById("trans-form").reset();
    });
});