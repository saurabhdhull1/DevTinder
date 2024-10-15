var express = require("express");
const bcrypt = require('bcrypt');
var { apiAuth, userAuth, errorHandler } = require("./middleware/handleAuthrequest");
const { connectDB } = require("./config/database");
const User = require("./models/user");
require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/signup', async (req, res) => {
    const { firstName, lastName, emailId, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !emailId || !password) {
        return res.status(400).send('All fields are required');
    }
    if (password.length < 5) {
        return res.status(400).send('Password must be at least 5 characters long');
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
        return res.status(400).send('Email already exists');
    }

    // Create the user object
    const userObj = {
        firstName,
        lastName,
        emailId,
        password,  // The password will be hashed before saving in the pre-save hook
        age: req.body.age || null,
        gender: req.body.gender || null
    };

    try {
        const user = new User(userObj);
        await user.save();
        res.status(201).send("User created");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user: " + error.message);
    }
});


app.post('/login', async (req, res) => {
    const { emailId, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ emailId });
    if (!user) {
        return res.status(400).send('Invalid email or password');
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Invalid email or password');
    }

    res.status(200).send('Login successful');
});

// GET all users
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting users: " + error);
    }
})

//  update user by ID
app.patch('/user', async (req, res) => {
    try {
        const id = req.body.id;
        const updates = req.body;
        const options = { new: true };
        const user = await User.findByIdAndUpdate(id, updates, options);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("Error updating user: " + error);
    }
});

// Delete user by ID
app.delete('/user', async (req, res) => {
    try {
        const id = req.body.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted');
    } catch (error) {
        res.status(500).send("Error deleting user: " + error);
    }
});

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
