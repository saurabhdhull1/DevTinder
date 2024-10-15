var express = require("express");
var app = express();

app.get('/', (req, res) => {
    res.send("Dashboard");
})
app.get('/profile', (req, res) => {
    res.send("This is profile page");
})

// dynamic route
app.get('/user/:id', (req, res) => {
    res.send("User " + req.params.id);  
})

// multiple dynamic route
app.get('/user/:id/:name', (req, res) => {
    res.send("User " + req.params.id + " " + req.params.name);  
})

// get quert parameters
// if url has query parameters like ?name=abc 
app.get('/user', (req, res) => {
    console.log(req.query.name);
    res.send('User ' + req.query.name);  
})

// Advanced patterns

// Advanced route patterns using ? (c is optional)
app.get('/abc?d', (req, res) => {
    // The '?' makes the preceding character 'c' optional. This route will match both '/abcd' and '/abd'.
    res.send("In this route, 'c' is optional, so both '/abcd' and '/abd' will match.");
});

// Advanced route patterns using * (wildcard pattern)
app.get('/ab*cd', (req, res) => {
    // The '*' allows any characters (including none) to come between 'ab' and 'cd'. 
    // For example, '/abcd', '/ab123cd', and '/abXYZcd' will all match this route.
    res.send("This route allows any characters between 'ab' and 'cd', e.g., '/abcd', '/abXYZcd'.");
});

// Advanced route patterns using + (one or more occurrences)
app.get('/ab+c', (req, res) => { 
    // The '+' allows one or more 'b's in the route. This will match '/abc', '/abbc', '/abbbc', etc.
    res.send("This route requires at least one 'b', and can have more, e.g., '/abc', '/abbc', etc.");
});

// Advanced route patterns using ()? (group is optional)
app.get('/(ab)?cd', (req, res) => {
    // The '(ab)?' makes the whole group 'ab' optional. This route will match both '/abcd' and '/cd'.
    res.send("The 'ab' part is optional, so both '/abcd' and '/cd' will match this route.");
});

// Advanced route patterns using {n} (exactly n occurrences)
app.get('/ab{2}c', (req, res) => {
    // This pattern matches exactly two 'b's. 
    // For example, '/abbc' will match, but '/abc' and '/abbbc' will not.
    res.send("This route requires exactly two 'b's, so '/abbc' will match, but '/abc' and '/abbbc' will not.");
});

// Advanced route patterns using {n,} (n or more occurrences)
app.get('/ab{2,}c', (req, res) => {
    // This pattern matches two or more 'b's. 
    // For example, '/abbc', '/abbbc', and '/abbbbc' will match.
    res.send("This route requires at least two 'b's, so '/abbc', '/abbbc', and '/abbbbc' will match.");
});

// Advanced route patterns using {n,m} (between n and m occurrences)
app.get('/ab{1,3}c', (req, res) => {
    // This pattern matches between one and three 'b's. 
    // For example, '/abc', '/abbc', and '/abbbc' will match, but '/abbbbcc' will not.
    res.send("This route requires between one and three 'b's, so '/abc', '/abbc', and '/abbbc' will match.");
});

// Advanced route patterns using ^ (starts with)
app.get('/^ab', (req, res) => {
    // This pattern matches any string that starts with 'ab'.
    // For example, '/abc', '/abxyz', and '/ab123' will match, but '/cab' will not.
    res.send("This route matches any string that starts with 'ab', so '/abc', '/abxyz' will match.");
});

// Advanced route patterns using $ (ends with)
app.get('/cd$', (req, res) => {
    // This pattern matches any string that ends with 'cd'.
    // For example, '/abcd', '/xyzcd', and '/123cd' will match, but '/cde' will not.
    res.send("This route matches any string that ends with 'cd', so '/abcd', '/xyzcd' will match.");
});

// Advanced route patterns | |
app.get( /a/, (req, res) => {
    // if a exist in path then it will work for example: /aabcd, /abcd, /a123cd
    // if a does not exist in path then it will not work for example: /bcd, /xyzcd
    res.send("This route matches any string that ends with 'cd', so '/abcd', '/xyzcd' will match.");
});

// Advanced route patterns | |
app.get( /.*fly$/, (req, res) => {
    // if fly exist in end of path then it will work for exapmle : /abcdfly, /xyzcdfly
    // if fly doen not exist in end of path then it will not work for example: /bcd, /xyzcd
    res.send("This route matches any string that ends with 'cd', so '/abcd', '/xyzcd' will match.");
});


//  Page not found if no route matches
app.use((req, res) => {
    res.status(404).send("Page not found");
});
app.listen(3000, function () {
    console.log("Server started");
});
