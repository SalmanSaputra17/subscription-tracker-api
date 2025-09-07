import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minLength: [3, 'User Name must be at least 3 characters long'],
        maxLength: [50, 'User Name must be at most 50 characters long']
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: [6, 'User Password must be at least 6 characters long']
    }
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

export default User;