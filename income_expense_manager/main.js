var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);
const key = "keyencrypter";

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,key)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

// Authenticate to MySQL Server
// var mysql = require('./db.js');

// Local Connection to MySQL
var mysql = require('./localdb.js');

exphbs.create({defaultLayout:'main'});

var app = express();

var bodyParser = require('body-parser');


var passport = require('passport'),
    // Strategy (?) to authenticate requires
    LocalStrategy = require('passport-local').Strategy;

/***********************************************
 * Local Login / Authentication
 ************************************************/
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username, password);
        mysql.pool.query("SELECT * FROM `user` WHERE `username` = '" + username + "'", function(err, result){
            console.log(result[0])
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
    console.log(user, user.user_id);
    done(null, user.user_id);
});

passport.deserializeUser(function(id, done) {
    mysql.pool.query("SELECT * FROM `user` WHERE `user_id` = '" + id + "'", function(err, result){
        return done(null, result[0]);
    });
});

app.use(express.static('static'));
app.use(session({secret: 'secret password'}));
app.use(passport.initialize());
app.use(passport.session());

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

// app.get('/test', function(req, res, next) {
//     mysql.pool.query("show tables", function(err, result){
//         if(err){
//           next(err);
//           return;
//         }


//         res.send(result);
//       });
    
// });

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);
// app.post('/login',
//     passport.authenticate('local', { failureRedirect: '/error' }),
//     function(req, res) {
//         res.redirect('/success?username='+req.user.username);
// });

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