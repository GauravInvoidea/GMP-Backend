const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, default: '', trim: true, },
        email: { type: String, unique: [true, '{PATH} should be unique'], index: true, sparse: true, trim: true, lowercase: true, },
        phone_number: { type: Number, trim: true, default: null },
        profile_image: { type: String, default: '' },
        password: { type: String, default: '' },

        user_type: { type: String, default: 'user' },
        role_id: { type: mongoose.Types.ObjectId, ref: 'Role', default: null },

        // otp: { type: Number, default: 1234 },
        // otp_expiry: { type: Date, default: null },

        // role: { type: String, default: 'user' },
        // permissions: { type: [mongoose.Types.ObjectId], default: [] },

        status: { type: String, default: 'active', enum: ['active', 'inactive'] },
        is_deleted: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'user',
    }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcrypt');
        const saltRounds = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;