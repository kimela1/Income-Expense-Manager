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
    var user = req.user;
    
    res.render('dashboard', context);
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
    var query_str = "Select * from `inex_income`";
    mysql.pool.query(query_str, function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send(result);
    });

    // res.setHeader('Content-Type', 'application/json');
    // var json = JSON.stringify({});
    // res.send(json);
});

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        // failureFlash: true
    })
);

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