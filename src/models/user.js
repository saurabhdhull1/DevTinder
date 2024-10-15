const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Number of rounds to generate salt

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, unique: true, trim: true,
        validate(value) {
            if (!/^[a-zA-Z]+$/.test(value)) {
                throw new Error('First name must contain only letters and cannot be empty');
            }
        }
    },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true, lowercase: true, trim: true,
        validate(value) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                throw new Error('Invalid email format');
            }
        }
    },
    password: { type: String, required: true },
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String,
        validate(value) {
            if (!['male', 'female', 'other', 'prefer not to say'].includes(value)) {
                throw new Error('Invalid gender');
            }
        }
    },
    profileUrl: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' },
    skills: { type: String },
    about: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next('Hashing password Error: ' + error);
    }
});

module.exports = mongoose.model('User', userSchema);