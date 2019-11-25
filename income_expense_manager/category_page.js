module.exports = function(app) {
    var mysql = require('./localdb.js');

    function check_user(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    // Display all categories
    app.get('/categories', check_user, function(req, res, next) {
        var user_id = req.user.user_id;
        var query_str = `SELECT category_id, category_name 
        FROM inex_category WHERE inex_category.user_id = ${user_id}`;

        mysql.pool.query(query_str, function(err, result){
            if(err){
                next(err);
                return;
            }
            var context = {title: "Categories", categories: result};
            res.render('categories', context)
        });
    });

    // Adds a category 
    app.post('/add_categories', check_user, function(req, res){
        var user_id = req.user.user_id;
        var sql = "INSERT INTO inex_category (category_name, user_id) VALUES (?, ?)";
        var inserts = [req.body.category_name, user_id];

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error)
            {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            else
            {
                res.redirect('/categories');
            }
        });
    });

    // Updates a category

    // Deletes a category
    app.delete('/categories/:category_id', function(req, res){
        var sql = "DELETE FROM inex_category WHERE category_id = ?";
        var inserts = [req.params.category_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })


}