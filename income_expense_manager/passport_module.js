var passport = require('passport');
    // Strategy (?) to authenticate requires
var LocalStrategy = require('passport-local').Strategy;

/***********************************************
 * Local Login / Authentication
 ************************************************/
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username, password);
        mysql.pool.query("SELECT * FROM `inex_user` WHERE `username` = '" + username + "'", function(err, result){
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
    mysql.pool.query("SELECT * FROM `inex_user` WHERE `user_id` = '" + id + "'", function(err, result){
        return done(null, result[0]);
    });
});

module.exports.passport = passport;