const mongoose = require('mongoose');

const propertyCategorySchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, '{PATH} is required'] },
		slug: { type: String, required: [true, '{PATH} is required'] },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'property_category',
	}
);

const PropertyCategory = new mongoose.model('PropertyCategory', propertyCategorySchema);
module.exports = PropertyCategory;