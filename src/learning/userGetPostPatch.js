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
