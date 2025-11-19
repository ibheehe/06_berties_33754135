const bcrypt = require('bcrypt');
const saltRounds = 10;


// Create a new router
const express = require("express")
const router = express.Router()

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {

    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {

        let result = 'Hello ' + req.body.first + ' ' + req.body.last +
        ' you are now registered! We will send an email to you at ' + req.body.email;

        result += ' Your password is: ' + req.body.password +
        ' and your hashed password is: ' + hashedPassword;

        res.send(result);
    });


    
});



// Export the router object so index.js can access it
module.exports = router
