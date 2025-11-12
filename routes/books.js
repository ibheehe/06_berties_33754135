// Create a new router
const express = require("express")
const router = express.Router()

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

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; 
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("list.ejs", { availableBooks: result });
    });
});


// addbooks route
router.get('/books/addbook', function(req, res, next) {
    res.render('addbook'); // renders addbook.ejs
});




// Export the router object so index.js can access it
module.exports = router
