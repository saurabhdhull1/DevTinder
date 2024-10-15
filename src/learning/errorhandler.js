var express = require("express");
var { apiAuth, userAuth, errorHandler } = require("../middleware/handleAuthrequest");
require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Dashboard");
})
app.get('/profile', (req, res) => {
    res.send("This is profile page");
})

app.get('/user', userAuth, (req, res) => {
    res.send("User route");
})

// Applying apiAuth to all routes
app.use('/api', apiAuth);

app.get('/api/data', (req, res) => {
    res.json({ message: 'You accessed private data', data: 'someData' });
});
app.post('/api/post', (req, res) => {
    res.json({ message: 'Your data was posted!', posted: req.body });
});

// demo error route
app.get('/error', (req, res) => {
    throw new Error('Something went wrong!');
})
// error handler middleware function
app.use('/', errorHandler);

//  Page not found if no route matches
app.use((req, res) => {
    res.status(404).send("Page not found");
});
app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});
