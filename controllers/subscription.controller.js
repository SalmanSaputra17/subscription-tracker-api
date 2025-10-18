import Subscription from "../models/subscription.model.js";
import {workflowClient} from "../config/upstash.js";
import {SERVER_URL} from "../config/env.js";

export const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();

        res.status(200).json({
            success: true,
            message: 'Subscriptions retrieved successfully',
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Subscription retrieved successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        const {workflowRunId} = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            },
            headers: {
                'content-type': 'application/json'
            },
            retries: 0
        });

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: {
                subscription,
                workflowRunId
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not authorized to view this user\'s subscriptions');
            error.statusCode = 403;
            throw error;
        }

        const subscription = await Subscription.find({user: req.params.id});

        res.status(200).json({
            success: true,
            message: 'User subscriptions retrieved successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

export const cancelSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        subscription.status = 'cancelled';

        await subscription.save();

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const now = new Date();
        const subscriptions = await Subscription.find({
            status: 'active',
            renewalDate: {$gte: now}
        }).sort({renewalDate: 1});

        res.status(200).json({
            success: true,
            message: 'Upcoming renewals retrieved successfully',
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};