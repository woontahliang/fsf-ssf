// Step 1: Load required libraries.
require('dotenv').config();
const express = require("express");
const mysql = require("mysql");
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");

// Step 2: Create an instance of the application.
var app = express();

// Step 2.1: Allow Cross-Origin Resource Sharing.
app.use(cors());

// Step 3: Setup Database connection.
var pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONLIMIT,
    debug: true
});

// Step 4: Define closures.
var makeQuery = (sql, pool) => {
    console.log("makeQuery SQL: ", sql);

    return (args) => {
        let queryPromise = new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(args);

                connection.query(sql, args || [], (err, results) => {
                    connection.release();
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log(">>> " + results);
                    resolve(results);
                });
            });
        });
        return queryPromise;
    }
}

// Step 5: Define SQL.
const sqlGetOneBookById = "SELECT id, author_lastname, author_firstname, title, cover_thumbnail, modified_date, created_date, is_deleted FROM books WHERE id = ?";

// Step 6: Define call backs.
var getOneItemById = makeQuery(sqlGetOneBookById, pool);

// Step 7: Define routes.
const API_URI = "/api";

// GET /api/book/1
app.get(API_URI + "/book/:id", (req, res) => {
    console.log("GET /book/:id");
    let id = parseInt(req.params.id);
    console.log("id: ", id);
    let finalCriteriaFromType = [id];
    getOneItemById(finalCriteriaFromType).then((results) => {
        res.json(results);
    }).catch((error) => {
        console.error(error);
        res.status(500).json(error);
    });
});

// GET /api/books?searchtitle=&searchauthor=&sorttitle=asc&sortauthor=desc=&limit=10&offset=0
// searchtitle is optional. Will include search by title if searchtitle is not undefined and not empty.
// searchauthor is optional. Will include search by author if searchauthor is not undefined and not empty.
// sorttitle is optional. Value is either 'asc' or 'desc'. Default is order by title and sort by ASC. Will include order by title if sorttitle is not undefined and not empty. Will sort by ASC or DESC if sorttitle is not undefined and not empty.
// sortauthor is optional. Value is either 'asc' or 'desc'. Will include order by author if sortauthor is not undefined and not empty. Will sort by ASC or DESC if sortauthor is not undefined and not empty.
// limit is optional. Default is 10. Will include limit if limit is not undefined and not empty.
// offset is optional. Default is 0. Will include offset if offset is not undefined and not empty.
app.get(API_URI + "/books", (req, res) => {
    console.log("GET /books");
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json(error);
        }

        let finalCriteriaFromType = [];

        let searchCriteriaString = "";
        let searchCriteria = [];
        let orderbysortString = "";
        let orderbysort = [];

        // WHERE title LIKE '%?%'
        console.log("req.query.searchtitle: ", req.query.searchtitle);
        console.log("(req.query.searchtitle != undefined): ", (req.query.searchtitle != undefined));
        console.log("(req.query.searchtitle != ''): ", (req.query.searchtitle != ""));
        if (req.query.searchtitle != undefined && req.query.searchtitle != "") {
            let searchby = "title LIKE ?";
            searchCriteria.push(searchby);
            finalCriteriaFromType.push("%" + req.query.searchtitle + "%");
        }

        // WHERE author LIKE '%?%'
        console.log("req.query.searchauthor: ", req.query.searchauthor);
        console.log("(req.query.searchauthor != undefined): ", (req.query.searchauthor != undefined));
        console.log("(req.query.searchauthor != ''): ", (req.query.searchauthor != ""));
        if (req.query.searchauthor != undefined && req.query.searchauthor != "") {
            let searchby = "CONCAT_WS( ' ', author_lastname, author_firstname ) LIKE ?";
            searchCriteria.push(searchby);
            finalCriteriaFromType.push("%" + req.query.searchauthor + "%");
        }

        console.log("searchCriteria: ", searchCriteria);
        for (var index = 0; index < searchCriteria.length; index++) {
            if (index > 0) {
                searchCriteriaString += (' || ' + searchCriteria[index]);
            } else {
                searchCriteriaString += (" WHERE ( " + searchCriteria[index]);
            }
        }

        if (searchCriteriaString != "") {
            searchCriteriaString += " )";
        }
        console.log("searchCriteriaString: ", searchCriteriaString);

        // ORDER BY title ASC or DESC
        console.log("req.query.sorttitle: ", req.query.sorttitle);
        console.log("(req.query.sorttitle != undefined): ", (req.query.sorttitle != undefined));
        console.log("(req.query.sorttitle != ''): ", (req.query.sorttitle != ""));
        if (req.query.sorttitle != undefined && req.query.sorttitle != "") {
            let orderbytype = "title";
            if (req.query.sorttitle == "asc") {
                orderbytype += " ASC";
                orderbysort.push(orderbytype);
            } else if (req.query.sorttitle == "desc") {
                orderbytype += " DESC";
                orderbysort.push(orderbytype);
            }
        }

        // ORDER BY author ASC or DESC
        console.log("req.query.sortauthor: ", req.query.sortauthor);
        console.log("(req.query.sortauthor != undefined): ", (req.query.sortauthor != undefined));
        console.log("(req.query.sortauthor != ''): ", (req.query.sortauthor != ""));
        if (req.query.sortauthor != undefined && req.query.sortauthor != "") {
            let orderbytype = "CONCAT_WS( ' ', author_lastname,  author_firstname )";
            if (req.query.sortauthor == "asc") {
                orderbytype += " ASC";
                orderbysort.push(orderbytype);
            } else if (req.query.sortauthor == "desc") {
                orderbytype += " DESC";
                orderbysort.push(orderbytype);
            }
        }

        console.log("orderbysort: ", orderbysort);
        for (var index = 0; index < orderbysort.length; index++) {
            if (index > 0) {
                orderbysortString += (', ' + orderbysort[index]);
            } else {
                orderbysortString += (" ORDER BY " + orderbysort[index]);
            }
        }

        if (orderbysortString == "") {
            orderbysortString = " ORDER BY title ASC";
        }
        console.log("orderbysortString: ", orderbysortString);

        let currentLimit = parseInt(req.query.limit) || 10;
        let currentOffset = parseInt(req.query.offset) || 0;
        console.log("currentLimit: ", currentLimit);
        console.log("currentOffset: ", currentOffset);
        finalCriteriaFromType.push(currentLimit);
        finalCriteriaFromType.push(currentOffset);

        sqlGetBooks = "SELECT cover_thumbnail, title, CONCAT_WS( ' ', author_lastname,  author_firstname ) AS author FROM books";
        pagination = " LIMIT ? OFFSET ?";
        connection.query(sqlGetBooks + searchCriteriaString + orderbysortString + pagination, finalCriteriaFromType, (err, results) => {
            connection.release();
            if (err) {
                res.status(500).json(error);
            }
            console.log(">>> " + results);
            let finalResult = [];
            results.forEach((element) => {
                let value = { cover_thumbnail: "", title: "", author: "" };
                value.cover_thumbnail = element.cover_thumbnail;
                value.title = element.title;
                value.author = element.author;
                finalResult.push(value);
            });
            res.json(finalResult);
        });
    });
});

// Step 7.1: Serve static resources
app.use(express.static(path.join(__dirname, 'public')));

// Step 7.2: Redirect to default page if no match.
app.use((req, resp) => {
    resp.redirect('/');
});

// Step 8: Start the server.
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT}`);
});