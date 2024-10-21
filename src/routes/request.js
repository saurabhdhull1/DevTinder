const express = require('express');
const requestRouter = express.Router();
const User = require('../models/User');
const { IsUserLoggedIn } = require('../middleware/handleAuthrequest');

// profile route
requestRouter.get('/request', IsUserLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.send("welcome " + user.firstName);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting profile: " + error);
    }
})

module.exports = requestRouter;