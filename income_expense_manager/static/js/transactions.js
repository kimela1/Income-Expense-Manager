var ttable = new Transaction_Table("transactions-tbody")
    addtransform = new AddTransactionForm();

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
});
