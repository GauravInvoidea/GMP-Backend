const mongoose = require('mongoose');

const propertyImageSchema = new mongoose.Schema(
	{
		image: { type: String, required: [true, 'image is required'] },
		priority: { type: Number, default: null },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'property_image',
	}
);

const PropertyImage = new mongoose.model('PropertyImage', propertyImageSchema);
module.exports = PropertyImage;