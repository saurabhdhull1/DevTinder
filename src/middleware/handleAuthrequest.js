const User = require("../models/User");
const jwt = require('jsonwebtoken');

// Api Authentication middleware function
function apiAuth(req, res, next) {
    // const token = req.headers['authorization'] || req.query.token;
    const token = 'validTokenExample';
    // const token = 'NotvalidTokenExample';

    // If no token is provided, return unauthorized
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    if (token === 'validTokenExample') { 
        next(); // Token is valid, proceed with the request
    } else {
        return res.status(403).json({ error: "Invalid token" });
    }
}

// User Authentication middleware function
function userAuth(req, res, next) {
    // const token = req.headers['authorization'] || req.query.token;
    const token = 'validTokenExample';
    // const token = 'NotvalidTokenExample';

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    if (token === 'validTokenExample') { 
        next(); // Token is valid, proceed with the request
    } else {
        return res.status(403).json({ error: "Invalid token" });
    }
}

// handle jwt token
async function IsUserLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error('please login first');
        }
        const decoded = await jwt.verify(token, process.env.JWT_PRIVATEKEY);
        if (!decoded) {
            throw new Error('please login first');
        }
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new Error('please login first');
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
}

// error handler middleware function
function errorHandler(err, req, res, next) {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { apiAuth, userAuth, errorHandler, IsUserLoggedIn };
