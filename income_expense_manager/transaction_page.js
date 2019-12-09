module.exports = function(app) {
    function check_user(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    // Transactions Page
    // Browse Income, Expense, & their M:M relationship with category
    app.get('/transactions', check_user, function(req, res, next) {
        var context = {title: "Transactions Page for Income and Expense Manager"};
        res.render('transactions', context);
    });

    // Gets Categories for ajax
    app.get('/get_categories_json', function(req, res, next) {
        var mysql = req.app.get('mysql');
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

    // Gets Income, Expense, & their category relationship for ajax
    app.get('/get_transactions_json', function(req, res, next) {
        var mysql = req.app.get('mysql');
        var user_id = req.user.user_id;

        var start_date = req.query.start_date,
            end_date = req.query.end_date;

        var search_term = req.query.search_term,
            search_option = req.query.search_option;

        var income_search_query = "",
            expense_search_query = "";
        var insert = [start_date, end_date, start_date, end_date];

        if (search_term && search_option 
            && search_term.length > 0 && search_option == "name") {
            income_search_query = "AND i.income_name LIKE CONCAT('%', ?, '%')"
            expense_search_query = "AND e.expense_name LIKE CONCAT('%', ?, '%')"

            insert = [start_date, end_date, search_term, 
                start_date, end_date, search_term];
        }

        var query_str = `
            SELECT 'inex_income' as type, i.income_name as name, 
                i.income_id as id, i.amount, i.date_received as date, 
                c.category_name as category_name,
                c.category_id as category_id
            FROM inex_income as i
            inner join inex_user as u on i.user_id = u.user_id AND u.user_id = ${user_id}
            left join inex_income_category as ic ON ic.income_id = i.income_id
            left join inex_category as c ON c.category_id = ic.category_id
            WHERE (i.date_received >= ? AND i.date_received <= ? ${income_search_query})
            UNION ALL
            SELECT 'inex_expense' as type, e.expense_name as name, 
                e.expense_id as id, e.amount, 
                e.date_spent as date, 
                c.category_name as category_name,
                c.category_id as category_id
            FROM inex_expense as e
            inner join inex_user as u on e.user_id = u.user_id AND u.user_id = ${user_id}
            left join inex_expense_category as ec ON ec.expense_id = e.expense_id
            left join inex_category as c on c.category_id = ec.category_id
            WHERE (e.date_spent >= ? AND e.date_spent <= ? ${expense_search_query});`;
        

        mysql.pool.query(query_str, insert, function(err, result){
            if(err){
                next(err);
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        });
    });

    // Gets Expense, Income & their category relationships for ajax
    //  by first matching those expense & income that have that category
    //  and then retrieving all the other categories that they have.
    app.get('/transactions_by_category_name_json', function(req, res, next) {
        var mysql = req.app.get('mysql');
        var user_id = req.user.user_id;

        var start_date = req.query.start_date,
            end_date = req.query.end_date;

        var search_term = req.query.search_term;

        var insert = [search_term, start_date, end_date, 
                        search_term, start_date, end_date];

        var query_str = `
            SELECT 'inex_income' as type, i.income_name as name, 
                i.income_id as id, i.amount, i.date_received as date, 
                c.category_name as category_name,
                c.category_id as category_id
                FROM 
                    (SELECT i.income_id, i.income_name, i.amount, i.date_received, i.user_id
                        FROM inex_category AS c
                        INNER JOIN inex_income_category AS ic ON ic.category_id = c.category_id
                        INNER JOIN inex_income AS i on i.income_id = ic.income_id
                        WHERE c.category_name = ?)as i
                inner join inex_user as u on i.user_id = u.user_id and u.user_id = ${user_id}
                left join inex_income_category as ic on ic.income_id = i.income_id
                left join inex_category as c on c.category_id = ic.category_id
                WHERE (i.date_received >= ? AND i.date_received <= ?)
            UNION ALL
            SELECT 'inex_expense' as type, e.expense_name as name, 
                e.expense_id as id, e.amount, 
                e.date_spent as date, 
                c.category_name as category_name,
                c.category_id as category_id
                FROM 
                    (SELECT e.expense_id, e.expense_name, e.amount, e.date_spent, e.user_id
                        FROM inex_category AS c
                        INNER JOIN inex_expense_category AS ec ON ec.category_id = c.category_id
                        INNER JOIN inex_expense AS e on e.expense_id = ec.expense_id
                        WHERE c.category_name = ?) as e
                inner join inex_user as u on e.user_id = u.user_id and u.user_id = ${user_id}
                left join inex_expense_category as ec on ec.expense_id = e.expense_id
                left join inex_category as c on c.category_id = ec.category_id
                WHERE (e.date_spent >= ? AND e.date_spent <= ?);
            `;

        mysql.pool.query(query_str, insert, function(err, result){
            if(err){
                next(err);
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        });
    });

    // Add Expense, Income via ajax
    app.post('/ajax-add-transaction', function(req, res, next) {
        var mysql = req.app.get('mysql');
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
                                "transaction_id": transaction_id});
                        });
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send({"transaction": transaction_id});
                    }
                });
            });
        }
          
    });

    // Delete Income, Expense via ajax
    app.post('/ajax_delete_transaction', function(req, res, next) {
        var mysql = req.app.get('mysql');
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

    // Delete income_category & expense_category entity/ relationship via ajax
    app.post('/ajax_remove_transaction_category_relationship', function(req, res, next) {
        var mysql = req.app.get('mysql');
        var user_id = req.user.user_id;
        
        if (user_id) {
            var category_id = req.body.category_id,
                type = req.body.type,
                transaction_id = req.body.transaction_id;

            var type_wo_inex;


            // Confirm that type is correct
            if (type === "inex_income") {
                type_wo_inex = "income";
            } else if (type === "inex_expense") {
                type_wo_inex = "expense";
            } else {
                res.status(500).send("Type was not correct");
            }

            var query_string = `
                DELETE FROM ${type}_category 
                    WHERE ${type_wo_inex}_id = ? 
                    AND category_id = ?;
            `;
            var values = [transaction_id,category_id];
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

    // Create Income_Category & Expense_Category Relationship/ Entity via ajax
    app.post('/ajax_set_transaction_category_relationship', function(req, res, next) {
        var mysql = req.app.get('mysql');
        var user_id = req.user.user_id;
        
        if (user_id) {
            var category_id = req.body.category_id,
                type = req.body.type,
                transaction_id = req.body.transaction_id;

            var type_wo_inex;


            // Confirm that type is correct
            if (type === "inex_income") {
                type_wo_inex = "income";
            } else if (type === "inex_expense") {
                type_wo_inex = "expense";
            } else {
                res.status(500).send("Type was not correct");
            }

            var query_string = `
                INSERT INTO ${type}_category 
                    (${type_wo_inex}_id, category_id)
                    VALUES (?, ?);
            `;
            var values = [transaction_id,category_id];
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

    // Update Income & Expense via ajax
    app.post('/ajax_update_transaction', function(req, res, next) {
        var mysql = req.app.get('mysql');
        var user_id = req.user.user_id;
        
        if (user_id) {
            var type = req.body.type,
                transaction_id = req.body.transaction_id,
                name = req.body.name,
                date = req.body.date,
                amount = req.body.amount;

            var type_wo_inex,
                date_parameter;

            // Confirm that type is correct
            if (type === "inex_income") {
                type_wo_inex = "income";
                date_parameter = 'date_received';
            } else if (type === "inex_expense") {
                type_wo_inex = "expense";
                date_parameter = 'date_spent';
            } else {
                res.status(500).send("Type was not correct");
            }

            var query_string = `
                UPDATE ${type}
                    SET 
                        ${type_wo_inex}_name = ?,
                        ${date_parameter} = ?,
                        amount = ?
                    where ${type_wo_inex}_id = ?;
            `;
            var values = [name, date, amount, transaction_id];
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