const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    description: String,
    role: String,
    permissions: [String],
    events: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Event'
    }
});

// JSON serialization of the User model
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});


const User = mongoose.model('User', userSchema);
module.exports = User