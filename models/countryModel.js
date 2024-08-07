const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema(
    {
        id: { type: Number, },
        name: { type: String },
        slug: { type: String, required: [true, '{PATH} is required'] },
        latitude: { type: Number },
        longitude: { type: Number },
        status: { type: String, default: 'active', enum: ['active', 'inactive'] },
        is_deleted: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'country',
    }
);




const Country = mongoose.model('Country', countrySchema);
module.exports = Country;