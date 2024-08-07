const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyType = require("../../../models/propertyTypeModel");

const createPropertyType = async (req, res, next) => {
	// console.log('createPropertyType', req.body);

	try {
		let { name, slug } = req.body;
		if (!name) throw new ApiError('name is required', 400);
		if (!slug) throw new ApiError('slug is required', 400);

		let existingRecord = await PropertyType.findOne({ slug });
		if (existingRecord) throw new ApiError('property type already exist', 400);

		slug = String(slug).toLowerCase();
		await PropertyType.create({ name, slug });
		res.status(201).json({ status: true, message: 'property type created' });

	} catch (error) {
		next(error);
	}
}

module.exports = createPropertyType;