var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    port            : '3306',
    password        : '',
    database        : 'inex'
  });

pool.getConnection(function(err) {
    if (err) throw err;

    console.log('DB Connection Successful');
});
  
module.exports.pool = pool;

// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: ''    
// });