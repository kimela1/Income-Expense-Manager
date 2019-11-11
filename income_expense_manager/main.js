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

var passport_module = require('./passport_module.js');

app.use(express.static('static'));
app.use(session({secret: 'secret password'}));
app.use(passport_module.passport.initialize());
app.use(passport_module.passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs());

app.set('view engine', 'handlebars');
app.set('port', 56786);

// Main Page: Running index
app.get('/', function(req, res, next) {
    var context = {title: "Income and Expense Manager"};
    console.log(req.user);
    res.render('dashboard', context);
});

app.get('/dashboard', function(req, res, next) {
    var context = {title: "Dashboard"};
    res.render('dashboard', context);
});

app.get('/reports', function(req, res, next) {
    var context = {title: "Reports"};
    res.render('reports', context);
});

app.get('/categories', function(req, res, next) {
    var context = {title: "Categories"};
    res.render('categories', context);
});

app.get('/signUp', function(req, res, next) {
    var context = {title: "sign up"};
    res.render('signUp', context);
});

app.get('/transactions', function(req, res, next) {
    var context = {title: "transactions"};
    res.render('transactions', context);
});

app.get('/login', function(req, res, next) {
    console.log(req.user)
    var context = {title: "login"}
    res.render('login', context);
});


app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

app.post('/login',
    passport_module.passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        // failureFlash: true
    })
);
// app.post('/login',
//     passport.authenticate('local', { failureRedirect: '/error' }),
//     function(req, res) {
//         res.redirect('/success?username='+req.user.username);
// });

// app.get('/test', function(req, res, next) {
//     mysql.pool.query("show tables", function(err, result){
//         if(err){
//           next(err);
//           return;
//         }
//         res.send(result);
//       });
    
// });

app.use(function(req, res){
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next) {
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost: ' + app.get('port'));
});