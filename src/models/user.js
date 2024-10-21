const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validate = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true, minlength: 3,maxlength: 20,
        validate(value) {
            if (!/^[a-zA-Z]+$/.test(value)) {
                throw new Error('First name must contain only letters and cannot be empty');
            }
        }
    },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true, lowercase: true, trim: true,
        validate(value) {
            if (!validate.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: { type: String, required: true, validate(){
        if (validate.isStrongPassword(this.password) === false) {
            throw new Error('Password is not strong enough');
        }
    } },
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String,
        validate(value) {
            if (!['male', 'female', 'other', 'prefer not to say'].includes(value)) {
                throw new Error('Invalid gender');
            }
        }
    },
    profileUrl: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        validate(value) {
            if (!validate.isURL(value)) {
                throw new Error('Invalid URL');
            }
        }
    },
    skills: { type: Array, default: [] },
    about: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// JWT token
userSchema.methods.getJwtToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATEKEY);
    return token;
};

// Compare password
userSchema.methods.comparePassword = async function (passwordEnterByUser) {
    const passwordHash = this.password;
    const isMatch = await bcrypt.compare(passwordEnterByUser, passwordHash);
    return isMatch;
};

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
});

module.exports = mongoose.model('User', userSchema);