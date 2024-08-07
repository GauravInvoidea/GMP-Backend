const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema(
    {
        id: { type: Number, },
        country_id: { type: mongoose.Types.ObjectId, ref: 'Country' },
        name: { type: String },
        slug: { type: String, required: [true, '{PATH} is required'] },
        latitude: { type: Number },
        longitude: { type: Number },
        status: { type: String, default: 'active', enum: ['active', 'inactive'] },
        is_deleted: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'state',
    }
);




const State = mongoose.model('State', stateSchema);
module.exports = State;