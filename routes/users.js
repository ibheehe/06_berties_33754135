const bcrypt = require('bcrypt');
const saltRounds = 10;

const express = require("express");
const router = express.Router();

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

            // 3️⃣ Send confirmation message
            let message = `Hello ${firstName} ${lastName} you are now registered! We will send an email to you at ${email}. `;
            message += `Your password is: ${plainPassword} and your hashed password is: ${hashedPassword}`;

            res.send(message);
        });
    });
});




router.post('/login', function(req, res, next) {

    const username = req.body.username ? req.body.username.trim() : ""; // trim whitespace
    const password = req.body.password;

    console.log("Username submitted:", username); // debug

    //  Find the user in the database by username
    const sqlquery = "SELECT * FROM users WHERE username = ?";
    global.db.query(sqlquery, [username], function(err, results) {
        if (err) return next(err);

        console.log("Database results:", results); // debug

        if (results.length === 0) {
            return res.send("No user found with that username.");
        }

        const user = results[0];
        const hashedPassword = user.hashedPassword;

        // Compare passwords
        bcrypt.compare(password, hashedPassword, function(err, result) {
            if (err) return next(err);

            if (result === true) {
                //succesfull login
                res.render('loggedin.ejs', { user: user });
            } else {
                // failed to login
                res.send("Incorrect password. Try again.");
            }
        });
    });
});








module.exports = router;
