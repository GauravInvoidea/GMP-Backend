const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        property: { type: mongoose.Types.ObjectId, ref: 'Property' },
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        broker: { type: mongoose.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
        confirmation_date: { type: Date, default: '' },
        total_price: {type: Number, required: [true, `{PATH} is required`] },
        status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled'] },
        is_deleted: {type: Boolean, default: false},  
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'booking',
    }
)

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;