var express = require("express");
const bcrypt = require('bcrypt');
var { apiAuth, userAuth, errorHandler, IsUserLoggedIn } = require("./middleware/handleAuthrequest");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

// error handler middleware function
app.use('/', errorHandler);

//  Page not found if no route matches
app.use((req, res) => {
    res.status(404).send("Page not found");
});

connectDB().then(() => {
    console.log("Database connected");
    app.listen(PORT, function () {
        console.log(`Server started on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Database connection Failed: ' + err);
});
