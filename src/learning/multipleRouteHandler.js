var express = require("express");
var app = express();

app.use('/', (req, res, next) => {
    // res.send("Dashboard");
    next();
}, (req, res, next) => {
    // res.send("This is profile page");
    next();
}, (req, res) => {
    res.send("Page not found");
})

// We can also add the route handlers inside array or add 
// some particular route handler in the middle of the array it works the same way

// we can also create multiple route with same route 

//  Page not found if no route matches
app.use((req, res) => {
    res.status(404).send("Page not found");
});
app.listen(3000, function () {
    console.log("Server started");
});

