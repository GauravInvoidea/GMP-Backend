const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyCategory = require('../../../models/propertCategoryModel')

const createPropertyCategory = async (req, res, next) => {
	// console.log('createPropertyCategory', req.body);

	try {
		let { name, slug } = req.body;
		if (!name) throw new ApiError('name is required', 400);
		if (!slug) throw new ApiError('slug is required', 400);

		let oldRecord = await PropertyCategory.findOne({ slug });
		if (oldRecord) throw new ApiError('property category already exist', 400);

		slug = String(slug).toLowerCase();
		await PropertyCategory.create({ name, slug });
		res.status(201).json({ status: true, message: 'property category created' });

	} catch (error) {
		next(error);
	}
}

module.exports = createPropertyCategory;