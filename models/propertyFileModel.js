const mongoose = require('mongoose');

const propertyFileSchema = new mongoose.Schema(
	{
		value: { type: String, required: [true, '{PATH} is required'] },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'property_file',
	}
);

const PropertyFile = new mongoose.model('PropertyFile', propertyFileSchema);
module.exports = PropertyFile;