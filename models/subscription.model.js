import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minLength: [2, 'Subscription Name must be at least 3 characters long'],
        maxLength: [50, 'Subscription Name must be at most 50 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Subscription Price is required'],
        min: [0, 'Subscription Price must be at least 0']
    },
    currency: {
        type: String,
        enum: ['IDR', 'USD', 'SGD'],
        default: 'IDR'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['Sports', 'Entertainment', 'News', 'Technology', 'Health', 'Business', 'Lifestyle', 'Other'],
        required: [true, 'Subscription Category is required']
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: [true, 'Payment Method is required']
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start Date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal Date must be after Start Date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true
    }
}, {timestamps: true});

// Auto-calculate renewal date if missing
SubscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Auto-update if renewal date is passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;