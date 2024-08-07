const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyPurpose = require("../../../models/propertyPurposeModel");

const createPropertyPurpose = async (req, res, next) => {
	// console.log('createPropertyPurpose', req.body);

	try {
		let { name, slug } = req.body;
		if (!name) throw new ApiError('name is required', 400);
		if (!slug) throw new ApiError('slug is required', 400);

		let oldRecord = await PropertyPurpose.findOne({ slug });
		if (oldRecord) throw new ApiError('already exist', 400);

		slug = String(slug).toLowerCase();
		await PropertyPurpose.create({ name, slug });
		res.status(201).json({ status: true, message: 'property purpose created' });

	} catch (error) {
		next(error);
	}
}

module.exports = createPropertyPurpose;