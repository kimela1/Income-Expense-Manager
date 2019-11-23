module.exports = function(app) {
    var mysql = require('./localdb.js');

    app.get('/get_categories_json', function(req, res, next) {
        var user_id = req.user.user_id;
        var query_str = `SELECT  category_id, category_name 
            FROM inex_category WHERE inex_category.user_id = ${user_id}`;
        mysql.pool.query(query_str, function(err, result){
            if(err){
                next(err);
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        });
    });

    app.get('/get_transactions_json', function(req, res, next) {
        var user_id = req.user.user_id;
        var query_str = `SELECT  *
            FROM 
                (
                    SELECT 'inex_income' as type, i.income_name as name, 
                        i.income_id as id, i.amount, i.date_received as date, 
                        c.category_name as category_name,
                        c.category_id as category_id
                    FROM inex_income as i
                inner join inex_user as u on i.user_id = u.user_id and u.user_id = ${user_id}
                    left join inex_income_category as ic on ic.income_id = i.income_id
                    left join inex_category as c on c.category_id = ic.category_id
                    UNION ALL
                    SELECT 'inex_expense' as type, e.expense_name as name, 
                        e.expense_id as id, e.amount, 
                        e.date_spent as date, 
                        c.category_name as category_name,
                        c.category_id as category_id
                    FROM inex_expense as e
                inner join inex_user as u on e.user_id = u.user_id and u.user_id = ${user_id}
                    left join inex_expense_category as ec on ec.expense_id = e.expense_id
                    left join inex_category as c on c.category_id = ec.category_id
                ) transactions;`;
        mysql.pool.query(query_str, function(err, result){
            if(err){
                next(err);
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        });
    });

    app.post('/ajax-add-transaction', function(req, res, next) {
        var user_id = req.user.user_id;

        if (user_id) {
            var transaction_info = req.body;
        
            var name = transaction_info["name"],
                date = transaction_info["date"],
                type = transaction_info["type"],
                amount = transaction_info["amount"],
                categories = transaction_info["category_id"];
            if (type == "income")
                date_parameter = 'date_received'
            else if (type == "expense")
                date_parameter = 'date_spent'
            else
                res.status(500).send("income was not correct");

            var values = [name, amount, date, user_id];

            var query_str = `INSERT INTO inex_${type} (${type}_name, amount, ${date_parameter}, user_id) 
                VALUES (?, ?, ?, ?)`;

            // Insert Transaction
            mysql.pool.query(query_str, values, function(err, result){
                if(err){
                    next(err);
                    return;
                }

                var get_id_str = `
                    SELECT max(${type}_id) FROM inex_${type}
                    WHERE inex_${type}.user_id = ${user_id}
                `;
                // GET Transaction ID
                mysql.pool.query(get_id_str, function(err, result){
                    var transaction_id = result[0][`max(${type}_id)`];

                    // Insert Cartegories relationships if any
                    if (categories.length > 0) {
                        var category_id;

                        var cat_query = `INSERT INTO inex_${type}_category (${type}_id, category_id) VALUES `;
                        for (var i = 0; i < categories.length; i++) {
                            category_id = categories[i]
                            cat_query += `(${transaction_id}, ${category_id}),`
                        }
                        cat_query = cat_query.slice(0,-1);
                        cat_query += ";"

                        mysql.pool.query(cat_query, function(err, result){
                            res.setHeader('Content-Type', 'application/json');
                            res.send({
                                "transaction": transaction_id});
                        });
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send({"transaction": transaction_id});
                    }
                });
            });
        }
          
    });

    app.post('/ajax_delete_transaction', function(req, res, next) {
        var user_id = req.user.user_id;

        if (user_id) {
            var type = req.body.type,
                id = req.body.id,
                id_attr = (type == "inex_income") ? "income_id" : "expense_id";

            // Confirm that type is correct
            if (type != "inex_income" && type != "inex_expense")
                res.status(500).send("income was not correct");

            var query_string = `
                DELETE FROM ${type} WHERE ${id_attr} = ?;
            `;
            var values = [id,];
            // GET Transaction ID
            mysql.pool.query(query_string, values, function(err, result){
                if(err){
                    next(err);
                    return;
                }
                res.setHeader('Content-Type', 'application/json');
                    res.send({});
            });
        }
    });
}