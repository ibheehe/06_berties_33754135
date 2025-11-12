// Create a new router
const express = require("express")
const router = express.Router()

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/books/search', function(req, res, next){
    res.render('search', { shopData: { shopName: "Bertie's Books" } });
});


router.post('/books/bookadded', function (req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This book is added to the database, name: ' + req.body.name + ', price: ' + req.body.price);
        }
    });
});


router.get('/books/search-result', function(req, res, next){
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



// Export the router object so index.js can access it
module.exports = router