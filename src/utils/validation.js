const validate = require('validator');
const user = require('../models/user');

async function validateSignup(req){
    const { firstName, lastName, emailId, password } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !emailId || !password) { 
        throw new Error('All fields are required'); 
    }
    if (validate.isStrongPassword(password) === false) { 
        throw new Error('Password is not strong enough'); 
    }
    if (validate.isEmail(emailId) === false) { 
        throw new Error('Invalid email'); 
    }
    
    // Check if the user already exists
    try {
        const existingUser = await user.findOne({ emailId });
        if (existingUser) { 
            throw new Error('Email already exists'); 
        }
    } catch (error) {
        console.error(error);
        throw new Error('Database query error: ' + error.message);
    }
}


module.exports = {
    validateSignup
}