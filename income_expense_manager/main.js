var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
// var session = require('express-session');
// var bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 58878);

// Main Page: Running index
app.get('/', function(res, res, next) {
  var context = {title: "Income and Expense Manager"};
  res.render('index', context);
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