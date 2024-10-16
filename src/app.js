var express = require("express");
const bcrypt = require('bcrypt');
var { apiAuth, userAuth, errorHandler } = require("./middleware/handleAuthrequest");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignup } = require("./utils/validation");
require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        validateSignup(req);
        const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : hashedPassword,  // The password will be hashed before saving in the pre-save hook
            age: req.body.age || null,
            gender: req.body.gender || null
        });
        await user.save();
        res.status(201).send("User created");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user: " + error.message);
    }
});


app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Compare the entered password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error(400).send('Invalid password or email');
        }

        // Send a success response
        res.status(200).send('Login successful');

    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in: " + error.message);
    }

    
});

// GET all users
app.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting users: " + error);
    }
})

//  update user by ID
app.patch('/user/:id', async (req, res) => {
    try {
        const id = req.params?.id;
        const updates = req.body;
        const {firstName, lastName, password, age, gender, skills, about, profileUrl} = req.body;

        let USER_UPDATE_ALLOWED = ['firstName', 'lastName', 'password', 'age', 'gender', 'skills', 'about', 'profileUrl'];
        let invalidUpdates = Object.keys(updates).filter(update => !USER_UPDATE_ALLOWED.includes(update));

        // Basic validation
        if (invalidUpdates.length > 0) {
            throw new Error('Invalid updates: ' + invalidUpdates.join(', '));
        }
        if (skills && !Array.isArray(skills) && skills.length > 6) {
            throw new Error('Skills must be an array and can only be 6 or less');
        }
        if (password && password.length < 5) {
            throw new Error('Password must be at least 5 characters long');
        }
        if (profileUrl && !profileUrl.startsWith('https://')) {
            throw new Error('Invalid url');
        }
        if (age && age < 16) {
            throw new Error('Age must be greater than 16');
        }

        const options = { new: true };
        // const user = await User.findByIdAndUpdate({_id: id}, updates, options);
        const user = await User.findByIdAndUpdate(id, updates, options);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send("user updated successfully");
    } catch (error) {
        res.status(500).send(error.message);
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
