// Create a new router
const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');




const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('./login');
    }
    next();
};



router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

// partial match search for search page
router.get('/books/search-result', function(req, res, next) {
    const keyword = req.query.keyword;

    let sqlquery = "SELECT name, price FROM books WHERE name LIKE ?";
    db.query(sqlquery, [`%${keyword}%`], (err, result) => {
        if (err) return next(err);

        res.render('search_result', { 
            books: result,
            keyword: keyword,
            type: 'advanced'
        });
    });
});







// Search form
router.get('/search', (req, res, next) => {
    res.render("search", { shopData: { shopName: "Bertie's Books" } });
});

// Search results
router.get('/search-result', (req, res, next) => {
    const keyword = req.query.keyword;

    let sqlquery = "SELECT name, price FROM books WHERE name LIKE ?";
    db.query(sqlquery, [`%${keyword}%`], (err, result) => {
        if (err) return next(err);

        res.render('search_result', { 
            books: result,
            keyword: keyword
        });
    });
});









// list

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; 
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("list.ejs", { availableBooks: result });
    });
});



// addbooks route
router.get('/books/addbook', function(req, res, next) {
    res.render('addbook'); // renders addbook.ejs
});






router.get('/bargainbooks',function(req, res, next){
    res.render('bargainbooks.ejs')
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




router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        // Render the logout EJS page
        res.render('logout'); 
    });
});








// Export the router object so index.js can access it
module.exports = router
