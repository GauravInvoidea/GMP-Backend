const mongoose = require('mongoose');

const normalUserSchema = new mongoose.Schema(
    {
        name: { type: String, default: '', trim: true, },
        phone_number: { type: Number, default: null },
        email: { type: String, default: null },
        password: { type: String, default: '' },
        user_type: { type: String, required: [true, '{PATH} is required'], enum: ['vender', 'customer'] },
        otp: { type: Number, default: 1234 },
        otp_expiry: { type: Date, default: null },

        profile_image: { type: String, default: '' },
        address: { type: String, default: '' },
        state_id: { type: mongoose.Types.ObjectId, ref: 'State' },
        city_id: { type: mongoose.Types.ObjectId, ref: 'City' },
        pincode: { type: Number, default: null },

        username: { type: String, },
        website_url: { type: String },

        status: { type: String, default: 'active', enum: ['active', 'inactive'] },
        is_deleted: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'normal_user',
    }
);

normalUserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcrypt');
        const saltRounds = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

const NormalUser = mongoose.model('NormalUser', normalUserSchema);
module.exports = NormalUser;