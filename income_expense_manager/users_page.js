module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function check_user(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }
    
    router.get('/', check_user, function(req, res, next){
        var mysql = req.app.get('mysql');
        var user_id = req.user.user_id;
        var query_str = `SELECT first_name, last_name, email 
        FROM inex_user WHERE user_id = ${user_id}`;
        var context = {title: "User's Page"};

        mysql.pool.query(query_str, function(err, result){
            if(err){
                next(err);
                return;
            }
            context["first_name"] = result[0]["first_name"];
            context["last_name"] = result[0]["last_name"];
            context["email"] = result[0]["email"];

            res.render('users_page', context)
        });
    });

    router.post('/', check_user, function(req, res, next) {
        var mysql = req.app.get('mysql');
        var user_id = req.user.user_id;

        var first_name = req.body.first_name,
            last_name = req.body.last_name,
            email = req.body.email,
            password = req.body.password;
        
        // Disabled password change
        var query_str = `
            UPDATE inex_user
            SET
                first_name = ?,
                last_name = ?,
                email = ?
            WHERE
                user_id = ${user_id}`;

        var inserts = [first_name, last_name, email];
        mysql.pool.query(query_str, inserts, function(err, result){
            if(err){
                next(err);
                return;
            }
            res.redirect('users_page')
        });
    });

    return router;
}();