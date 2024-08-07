const mongoose = require("mongoose");

const propertPurposeSchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, `{PATH} is required`] },
		slug: { type: String, required: [true, `{PATH} is required`] },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		collection: 'property_purpose',
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
	}
)

const PropertyPurpose = mongoose.model('PropertyPurpose', propertPurposeSchema);
module.exports = PropertyPurpose;