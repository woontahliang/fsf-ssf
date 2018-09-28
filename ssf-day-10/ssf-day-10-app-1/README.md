# SsfDay10App1

This project was generated with NPM with NodeJS and Express.

## Build

Run `npm install` to build the project.

## Run Application

Run `node index.js` to start server. Navigate to `http://localhost:3000/` to access the homepage.

## Using API
Search books by title and author. Order by title and sort by ASC/DESC and author ASC/DESC.
Use GET Method:
Eg. `http://localhost:3000/api/books?searchtitle=&searchauthor=&sorttitle=asc&sortauthor=desc=&limit=10&offset=0`
- searchtitle is optional. Will include search by title if searchtitle is not undefined and not empty.
- searchauthor is optional. Will include search by author if searchauthor is not undefined and not empty.
- sorttitle is optional. Value is either 'asc' or 'desc'. Default is order by title and sort by ASC. Will include order by title if sorttitle is not undefined and not empty. Will sort by ASC or DESC if sorttitle is not undefined and not empty.
- sortauthor is optional. Value is either 'asc' or 'desc'. Will include order by author if sortauthor is not undefined and not empty. Will sort by ASC or DESC if sortauthor is not undefined and not empty.
- limit is optional. Default is 10. Will include limit if limit is not undefined and not empty.
- offset is optional. Default is 0. Will include offset if offset is not undefined and not empty.

Find a book by ID
Use GET Method:
Eg. `http://localhost:3000/api/book/1`
Pass in the id of the book.