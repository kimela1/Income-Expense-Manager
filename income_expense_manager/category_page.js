module.exports = function(app) {
    var mysql = require('./localdb.js');
    var express = require('express')
    var app = express()

    app.get('/', function(req, res, next) {
        var user_id = req.user.user_id;
        var query_str = `SELECT category_id, category_name 
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

    /* ORIGINAL
    app.get('/get_categories_json', function(req, res, next) {
        var user_id = req.user.user_id;
        var query_str = `SELECT category_id, category_name 
        FROM inex_category WHERE inex_category.user_id = ${user_id}`;
    
        mysql.pool.query(query_str, function(err, result){
            if(err){
                next(err);
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        });
    }); */

    // Adds a category 
    app.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO inex_category (category_name) VALUES (?)";
        var inserts = [req.body.cateogry_name];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error)
            {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else
            {
                res.redirect('/categories');
            }
        });
    });
}
