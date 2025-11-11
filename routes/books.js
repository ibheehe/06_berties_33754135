// Create a new router
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
});


router.get('/list', (req, res, next) => {
    const sqlQuery = "SELECT * FROM books"; // Query to get all books

    db.query(sqlQuery, (err, result) => {
        if (err) return next(err); // Pass error to Express error handler

        res.json(result); // Send result as JSON
    });
});


// Export the router object so index.js can access it
module.exports = router
