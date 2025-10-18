import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;

        // Basic presence validation (model will further validate)
        if (!name || !email || !password) {
            const error = new Error('Name, email, and password are required');
            error.statusCode = 400;
            throw error;
        }

        // Check if email already exists
        const existing = await User.findOne({email});

        if (existing) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({name, email, password: hashedPassword});
        const sanitized = user.toObject();

        delete sanitized.password;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: sanitized
        });
    } catch (error) {
        // Handle duplicate key error from unique index
        if (error && error.code === 11000) {
            const handledError = new Error('Email already in use');
            handledError.statusCode = 409;
            return next(handledError);
        }
        next(error);
    }
};

export const updateUserById = async (req, res, next) => {
    try {
        const {password, ...rest} = req.body || {};
        const update = {...rest};

        if (password) {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            update,
            {new: true, runValidators: true}
        ).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        if (error && error.code === 11000) {
            const handledError = new Error('Email already in use');
            handledError.statusCode = 409;
            return next(handledError);
        }
        next(error);
    }
};

export const deleteUserById = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};