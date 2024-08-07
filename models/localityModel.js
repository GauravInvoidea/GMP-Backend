const mongoose = require('mongoose');

const localitySchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, `{PATH} is required`] },
		slug: { type: String, required: [true, `{PATH} is required`] },
		latitude: { type: Number, default: null },
		longitude: { type: Number, default: null },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'locality',
	}
);

const Locality = new mongoose.model('Locality', localitySchema);
module.exports = Locality;