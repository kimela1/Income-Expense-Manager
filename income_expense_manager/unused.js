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

// input = document.createElement("select");
            // var option = document.createElement("option");
            // option.innerText = "Income";
            // input.append(option);
            // if (type == "Income")
            //     option.setAttribute("selected", "True")
            // option = document.createElement("option");
            // option.innerText = "Expense";
            // if (type == "Expense")
            //     option.setAttribute("selected", "True");
            // input.append(option);
            // type_td.append(input);