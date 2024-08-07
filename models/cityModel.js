const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
    {
        id: { type: Number, },
        country_id: { type: mongoose.Types.ObjectId, ref: 'Country' },
        state_id: { type: mongoose.Types.ObjectId, ref: 'State' },
        name: { type: String },
        slug: { type: String, required: [true, '{PATH} is required'] },
        latitude: { type: Number },
        longitude: { type: Number },
        status: { type: String, default: 'active', enum: ['active', 'inactive'] },
        is_deleted: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'city',
    }
);




const City = mongoose.model('City', citySchema);
module.exports = City;