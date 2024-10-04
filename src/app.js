var express = require("express");
var app = express();

app.get('/', (req, res) => {
    res.send("Dashboard");
})
app.get('/profile', (req, res) => {
    res.send("This is profile page");
})
app.use((req, res) => {
    res.status(404).send("Page not found");
});

app.listen(3000, function () {
    console.log("Server started");
});
