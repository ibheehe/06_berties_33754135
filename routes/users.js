const bcrypt = require('bcrypt');
const saltRounds = 10;

const express = require("express");
const router = express.Router();



const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // relative redirect works if router is mounted at root
    } else {
        next();
    }
};



// GET registration page
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

// POST registration
router.post('/registered', function (req, res, next) {

    const username = req.body.username;
    const firstName = req.body.first; // matches 'firstName' in DB
    const lastName = req.body.last;   // matches 'lastName' in DB
    const email = req.body.email;
    const plainPassword = req.body.password;

    // Hash the password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) return next(err);

        // Insert into database
        const sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        const values = [username, firstName, lastName, email, hashedPassword];

        global.db.query(sqlquery, values, function(err, result) {
            if (err) return next(err);

            // Send confirmation message
            let message = `Hello ${firstName} ${lastName} you are now registered! We will send an email to you at ${email}. `;
            message += `Your password is: ${plainPassword} and your hashed password is: ${hashedPassword}`;

            res.send(message);
        });
    });
});




router.post('/login', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    const sqlquery = "SELECT username, hashedPassword FROM users WHERE username = ?";
    global.db.query(sqlquery, [username], function(err, results) {
        if (err) return next(err);

        if (results.length === 0) {
            // No user found — log failed attempt
            const insertAudit = "INSERT INTO login_audit (username, success) VALUES (?, ?)";
            global.db.query(insertAudit, [username, false]);
            
            return res.send('Login failed: user not found');
        }

        const hashedPassword = results[0].hashedPassword;

        bcrypt.compare(password, hashedPassword, function(err, result) {
            if (err) return next(err);

            // Log success or failure
            const insertAudit = "INSERT INTO login_audit (username, success) VALUES (?, ?)";
            global.db.query(insertAudit, [username, result]);

            if (result) {
    // Store the user in the session
    req.session.userId = req.body.username;

    res.render('loggedin.ejs', { message: 'Login successful' });
} else {
    res.send('Login failed: incorrect password');

}

        });
    });
});

//list users
router.get('/listusers', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT id, username, firstName, lastName, email FROM users"; // no password

    global.db.query(sqlquery, function(err, results) {
        if (err) return next(err);

        // Pass users to the template
        res.render('listusers.ejs', { users: results });
    });
});









module.exports = router;
