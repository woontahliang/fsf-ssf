// Step 1: Load required libraries. Eg. Load path and express.
const path = require('path');
const express = require('express');

// Step 2: Create an instance of the application.
const app = express();

// Step 3: Define routes
// Define route - rules to handle requests

/*
// Serve resources from public
app.use(
    express.static( // Middleware to serve static files
        path.join(__dirname, 'public')
    )
);
*/

// Assuming application folder is:
//    /myapp/dist/myapp/index.html
app.use(
    express.static( // Middleware to serve static files
        path.join(__dirname, 'myapp', 'dist', 'myapp')
    )
);

/*
// If you have a "images" folder that is outside the "public" folder route declared above, then you need to declare it here, otherwise it cannot be accessed.
// Assuming application folder is:
//    /images/dog.jpg
//    /images/404.gif
//    /public/index.html
app.use(
    express.static( // Middleware to serve static files
        path.join(__dirname, 'images')
    )
);

// Assuming application folder is:
//  /images/404.gif
app.use(
    (req, resp) => {    // Middleware
        resp.status(404);
        resp.sendfile(path.join(__dirname, 'images', '404.gif'));
    }
);
*/

// Assuming application folder is:
//  /public/images/404.gif
app.use(
    (req, resp) => {    // Middleware
        resp.status(404);
        resp.sendfile(path.join(__dirname, 'public', 'images', '404.gif'));
    }
);

/*
// Use redirection
// Assuming application folder is:
//  /public/404.html
app.use(
    (req, resp) => {    // Middleware
        resp.redirect('404.html');
    }
);
*/

// Assuming application folder is:
//  /public/404.html
app.use(
    (req, resp) => {    // Middleware
        resp.status(404);
        resp.sendfile(path.join(__dirname, 'public', '404.html'));
    }
);

// Step 4: Start the server
// Start Express and listen to a port
// app.listen(3000, function() {    // Alternative to "() => { }"
// Evaluation order: cmd arguments, env variable, default
// parseInt("non-number") will return NAN which is false.
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
// "process.argv" gets the cmd line
console.log(process.argv);
console.log('>>>> process.argv[2]:', process.argv[2]);
// "process.env.APP_PORT)" gets the value of "APP_PORT" from the environment that is running this application.
console.log('>>>> APP_PORT:', process.env.APP_PORT);

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`);
    console.info('\tRunning directory is ', __dirname);
    // console.info('\tPublic directory is ', path.join(__dirname, 'public'));
    console.info('\tPublic directory is ', path.join(__dirname, 'myapp', 'dist', 'myapp'));
});