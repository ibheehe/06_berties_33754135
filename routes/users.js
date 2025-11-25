const bcrypt = require('bcrypt');
const saltRounds = 10;

const express = require("express");
const router = express.Router();

// ---------------------
// Middleware for login check
// ---------------------
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // redirect to your login page
    }
    next();
};

// ---------------------
// GET registration page
// ---------------------
router.get('/register', (req, res) => {
    res.render('register.ejs');
});

// ---------------------
// POST registration
// ---------------------
router.post('/registered', (req, res, next) => {
    const username = req.body.username;
    const firstName = req.body.first; // matches 'firstName' in DB
    const lastName = req.body.last;   // matches 'lastName' in DB
    const email = req.body.email;
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
        if (err) return next(err);

        const sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        const values = [username, firstName, lastName, email, hashedPassword];

        global.db.query(sqlquery, values, (err, result) => {
            if (err) return next(err);

            let message = `Hello ${firstName} ${lastName} you are now registered! We will send an email to you at ${email}. `;
            message += `Your password is: ${plainPassword} and your hashed password is: ${hashedPassword}`;

            res.send(message);
        });
    });
});

// ---------------------
// GET login page
// ---------------------
router.get('/login', (req, res) => {
    res.render('login.ejs');
});

// ---------------------
// POST login
// ---------------------
router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const sqlquery = "SELECT username, hashedPassword FROM users WHERE username = ?";
    global.db.query(sqlquery, [username], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) {
            global.db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)", [username, false]);
            return res.send('Login failed: user not found');
        }

        const hashedPassword = results[0].hashedPassword;

        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) return next(err);

            global.db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)", [username, result]);

            if (result) {
                // Store the user in the session
                req.session.userId = username;
                res.render('loggedin.ejs', { message: 'Login successful' });
            } else {
                res.send('Login failed: incorrect password');
            }
        });
    });
});

// ---------------------
// Audit page (protected)
// ---------------------
router.get('/audit', redirectLogin, (req, res, next) => {
    const sqlquery = "SELECT username, success, timestamp FROM login_audit ORDER BY timestamp DESC";
    global.db.query(sqlquery, (err, results) => {
        if (err) return next(err);
        res.render('audit.ejs', { auditLogs: results });
    });
});

// ---------------------
// List users (protected)
// ---------------------
router.get('/listusers', redirectLogin, (req, res, next) => {
    const sqlquery = "SELECT id, username, firstName, lastName, email FROM users"; // no password
    global.db.query(sqlquery, (err, results) => {
        if (err) return next(err);
        res.render('listusers.ejs', { users: results });
    });
});

// ---------------------
// Logout (protected)
// ---------------------
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/');
        res.render('logout'); // render logout.ejs
    });
});

module.exports = router;
