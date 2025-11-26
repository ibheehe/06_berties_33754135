const bcrypt = require('bcrypt');
const saltRounds = 10;

const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');



const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // relative redirect works if router is mounted at root
    } else {
        next();
    }
};

//test to see if it still works


// GET registration page
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

// POST registration with validation
router.post('/registered', 
    [
        check('email').isEmail().withMessage('Please enter a valid email'),
        check('username').isLength({ min: 5, max: 20 }).withMessage('Username must be 5-20 characters')
    ], 
    function (req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Validation errors
            return res.render('./register', { errors: errors.array() });
        }

        const username = req.body.username;
        const firstName = req.body.first;
        const lastName = req.body.last;
        const email = req.body.email;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            if (err) return next(err);

            const sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
            const values = [username, firstName, lastName, email, hashedPassword];

            global.db.query(sqlquery, values, function(err, result) {
                if (err) {
                    // Check if it's a duplicate email error
                    if (err.code === 'ER_DUP_ENTRY') {
                        // Render register page with error message
                        return res.render('./register', { 
                            errors: [{ msg: 'This email is already registered' }] 
                        });
                    }
                    return next(err); // Other errors
                }

                // Success
                let message = `Hello ${firstName} ${lastName}, you are now registered! `;
                message += `We will send an email to you at ${email}.`;
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
router.get('/users/list', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT id, username, firstName, lastName, email FROM users"; // no password

    global.db.query(sqlquery, function(err, results) {
        if (err) return next(err);

        // Pass users to the template
        res.render('listusers.ejs', { users: results });
    });
});

//login
router.get('/login',function(req, res, next){
    res.render('login.ejs')
});

//logout



router.get('/audit', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT username, success, timestamp FROM login_audit ORDER BY timestamp DESC";

    global.db.query(sqlquery, function(err, results) {
        if (err) return next(err);

        res.render('audit.ejs', { auditLogs: results });
    });
});










module.exports = router;
