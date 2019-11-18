module.exports = function(app) {
    var mysql = require('./localdb.js');

    app.get('/get_transactions_json', function(req, res, next) {
        var user_id = req.user.user_id;
        var query_str = `SELECT  *
            FROM 
                (
                    SELECT 'inex_income' as type, i.income_name as name, i.income_id as id, i.amount, i.date_received as date, c.category_name as category_name
                    FROM inex_income as i
                inner join inex_user as u on i.user_id = u.user_id and u.user_id = ${user_id}
                    left join inex_income_category as ic on ic.income_id = i.income_id
                    left join inex_category as c on c.category_id = ic.category_id
                    UNION ALL
                    SELECT 'inex_expense' as type, e.expense_name as name, e.expense_id as id, e.amount, e.date_spent as date, c.category_name as category_name
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
}