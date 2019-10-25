var express = require('express');
var exphbs = require('express-handlebars');

// Authenticate to MySQL Server
var mysql = require('./db.js');

// Local Connection to MySQL
// var mysql = require('./localdb.js');

exphbs.create({defaultLayout:'main'});

var app = express();

var passport = require('passport'),
    // Strategy (?) to authenticate requires
    LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        username.findOne( { username: username }, function(err, user) {
            if (err) {return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.'});
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.'});
            }

            // Verify callback-Authenticates User
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.engine('handlebars', exphbs());

var session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.set('view engine', 'handlebars');
app.set('port', 58878);

// Main Page: Running index
app.get('/', function(req, res, next) {
    var context = {title: "Income and Expense Manager"};
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

app.get('/signUp', function(req, res, next) {
    var context = {title: "sign up"};
    res.render('signUp', context);
});

app.get('/transactions', function(req, res, next) {
    var context = {title: "transactions"};
    res.render('transactions', context);
});

// app.use(function(req, res){
//   res.status(404);
//   res.render('404');
// });

// app.use(function(err, req, res, next) {
//   res.status(400);
//   res.render('500');
// });

app.get('/login', function(req, res, next) {
    res.render('login/login');
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost: ' + app.get('port'));
});