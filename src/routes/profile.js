const express = require('express');
const profileRouter = express.Router();
const User = require('../models/User');
const { IsUserLoggedIn } = require('../middleware/handleAuthrequest');

// profile route
profileRouter.get('/profile', IsUserLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.send("welcome " + user.firstName);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting profile: " + error);
    }
})

module.exports = profileRouter;