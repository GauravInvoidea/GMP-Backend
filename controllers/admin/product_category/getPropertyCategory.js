const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyCategory = require("../../../models/propertCategoryModel");

const getPropertyCategory = async (req, res, next) => {
	try {
		let { id } = req.params;
		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId) throw new ApiError('invalid id format', 400);

		let record = await PropertyCategory.findById(id)
			.lean()
			.select('_id name slug status created_at')

		if (!record) throw new ApiError('property category does not exist', 404);
		res.status(200).json({ status: true, message: 'property category detail', data: record });

	} catch (error) {
		next(error);
	}
}

module.exports = getPropertyCategory;