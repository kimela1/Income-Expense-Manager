var express = require('express');
var exphbs = require('express-handlebars');
exphbs.create({defaultLayout:'main'});

var app = express();

app.engine('handlebars', exphbs());

var session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.set('view engine', 'handlebars');
app.set('port', 58878);

// Main Page: Running index
app.get('/', function(res, res, next) {
  var context = {title: "Income and Expense Manager"};
  res.render('dashboard', context);
});

app.get('/dashboard', function(res, res, next) {
  var context = {title: "Dashboard"};
  res.render('dashboard', context);
});

app.get('/reports', function(res, res, next) {
  var context = {title: "Reports"};
  res.render('reports', context);
});

app.get('/signUp', function(res, res, next) {
  var context = {title: "sign up"};
  res.render('signUp', context);
});

app.get('/transactions', function(res, res, next) {
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
// })

app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost: ' + app.get('port'));
});