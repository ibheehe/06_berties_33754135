const express = require('express');
const router = express.Router();

// GET /api/books
// search, minprice, maxprice, sort
router.get('/books', function (req, res, next) {

    let sqlquery = "SELECT * FROM books";
    let params = [];
    const { search, minprice, maxprice, sort } = req.query;

    //  search filter
    if (search) {
        sqlquery += " WHERE name LIKE ?";
        params.push(`%${search}%`);
    }

    //  price filters
    if (minprice && maxprice) {
        if (params.length > 0) {
            sqlquery += " AND PRICE BETWEEN ? AND ?";
        } else {
            sqlquery += " WHERE PRICE BETWEEN ? AND ?";
        }
        params.push(minprice, maxprice);
    } else if (minprice) {
        if (params.length > 0) {
            sqlquery += " AND PRICE >= ?";
        } else {
            sqlquery += " WHERE PRICE >= ?";
        }
        params.push(minprice);
    } else if (maxprice) {
        if (params.length > 0) {
            sqlquery += " AND PRICE <= ?";
        } else {
            sqlquery += " WHERE PRICE <= ?";
        }
        params.push(maxprice);
    }

    // Add sorting if provided
    if (sort) {
        if (sort.toLowerCase() === 'name') {
            sqlquery += " ORDER BY name";
        } else if (sort.toLowerCase() === 'price') {
            sqlquery += " ORDER BY PRICE";
        }
    }

    // Execute query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err);
            next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
