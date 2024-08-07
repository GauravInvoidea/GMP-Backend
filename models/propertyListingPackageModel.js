const mongoose = require('mongoose');

const propertyListingPackageSchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'role name is required'] },
		value: { type: String, default: "" },
		status: { type: String, default: 'active', enum: ['active', 'inactive'] },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		collection: 'property_listing_package',
	}
);

const PropertyListingPackage = new mongoose.model('PropertyListingPackage', propertyListingPackageSchema);
module.exports = PropertyListingPackage;