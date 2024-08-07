const mongoose = require('mongoose');

const propertyAmenitySchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'role name is required'] },
		image: { type: String, default: '' },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'property_amenity'
	},
)

const PropertyAmenity = mongoose.model('PropertyAmenity', propertyAmenitySchema);
module.exports = PropertyAmenity;