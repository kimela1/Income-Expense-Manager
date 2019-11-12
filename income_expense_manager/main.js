var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');

// Authenticate to MySQL Server
// var mysql = require('./db.js');

// Local Connection to MySQL
var mysql = require('./localdb.js');

exphbs.create({defaultLayout:'main'});

var app = express();

var bodyParser = require('body-parser');

var passport = require('passport');
    // Strategy (?) to authenticate requires
var LocalStrategy = require('passport-local').Strategy;

/***********************************************
 * Local Login / Authentication
 ************************************************/
passport.use(new LocalStrategy(
    function(username, password, done) {
        mysql.pool.query("SELECT * FROM `inex_user` WHERE `username` = '" + username + "'", function(err, result){
            if (err) {return done(err); }
            if (!result) {
                return done(null, false, { message: 'Incorrect username.'});
            }
            if (!result.length) {
                return done(null, false, { message: 'No user found.'});
            }

            if (result[0].password != password) {
                return done(null, false, { message: 'Incorrect password.'});
            }
            return done(null, result[0]);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(function(id, done) {
    mysql.pool.query("SELECT * FROM `inex_user` WHERE `user_id` = '" + id + "'", function(err, result){
        return done(null, result[0]);
    });
});

module.exports.passport = passport;

app.use(express.static('static'));
app.use(session({secret: 'secret password'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs());

app.set('view engine', 'handlebars');
app.set('port', 56786);

// Checks if user is logged in. If not, redirect to /login
function check_user(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Main Page: Running index
app.get('/', check_user, function(req, res, next) {
    var context = {title: "Income and Expense Manager"};
    
    res.redirect('/transactions');
});

app.get('/dashboard', check_user, function(req, res, next) {
    var context = {title: "Dashboard"};
    res.render('dashboard', context);
});

app.get('/reports', check_user, function(req, res, next) {
    var context = {title: "Reports"};
    res.render('reports', context);
});

app.get('/categories', check_user, function(req, res, next) {
    var context = {title: "Categories"};
    res.render('categories', context);
});

app.get('/signUp', function(req, res, next) {
    var context = {title: "sign up"};
    context["logged_out_status"] = true;
    res.render('signUp', context);
});

app.get('/transactions', check_user, function(req, res, next) {
    var context = {title: "transactions"};
    res.render('transactions', context);
});

app.get('/login', function(req, res, next) {
    var context = {title: "login"}
    context["logged_out_status"] = true;
    res.render('login', context);
});

app.get('/get_transactions_json', function(req, res, next) {
    var user_id = req.user.user_id;
    var query_str = `SELECT  * \
        FROM \
            ( \
                SELECT 'inex_income' as type, i.name, i.income_id as id, i.amount, i.date_received as date, c.name as category_name \
                FROM inex_income as i \
            inner join inex_user as u on i.user_id = u.user_id and u.user_id = ${user_id} \
                left join inex_income_category as ic on ic.income_id = i.income_id \
                left join inex_category as c on c.category_id = ic.category_id \
                UNION ALL \
                SELECT 'inex_expense' as type, e.name, e.expense_id as id, e.amount, e.date_spent as date, c.name as category_name \
                FROM inex_expense as e \
            inner join inex_user as u on e.user_id = u.user_id and u.user_id = ${user_id} \
                left join inex_expense_category as ec on ec.expense_id = e.expense_id \
                left join inex_category as c on c.category_id = ec.category_id \
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

app.get('/get_categories_json', function(req, res, next) {
    var user_id = req.user.user_id;
    var query_str = `select c.name as "category_name", c.category_id, table1.name as "transaction_name", table1.table_name as "type"
    from inex_category as c
    left join
    ((select i.name, 'inex_income' as table_name, i.income_id  as id, ic.category_id
        from inex_income as i
        inner join inex_income_category as ic on ic.income_id = i.income_id
        where i.user_id = ${user_id})
    union
    ( select e.name, 'inex_expense' as table_name, e.expense_id as id, ec.category_id 
        from inex_expense as e
        inner join inex_expense_category as ec on ec.expense_id = e.expense_id 
        where e.user_id = ${user_id})) as table1
    on c.category_id = table1.category_id;`;

    mysql.pool.query(query_str, function(err, result){
        if(err){
            next(err);
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(result);
    });
});

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        // failureFlash: true
    })
);

app.get('/logout', function(req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

app.use(function(req, res){
    res.status(404);
    res.render('404');
});
  
// app.use(function(err, req, res, next) {
//     res.status(500);
//     res.render('500');
// });

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost: ' + app.get('port'));
});