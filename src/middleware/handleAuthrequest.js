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

// error handler middleware function
function errorHandler(err, req, res, next) {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { apiAuth, userAuth, errorHandler }
