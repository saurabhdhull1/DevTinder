const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = express.Router();
const { validateSignup, validateLogin } = require('../utils/validation');
const User = require('../models/User');
require('dotenv').config(); 
app.use(cookieParser());

authRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        await validateSignup(req);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password, // Hashing the password before saving
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

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        await validateLogin(emailId, password);
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // creating token
        const token = await user.getJwtToken();

        // setting cookie
        res.cookie('token', token, {
            // httpOnly: true,
            // secure: true,
        });
        res.status(200).send('Login successful');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in: " + error.message);
    }
});
 
module.exports = authRouter;