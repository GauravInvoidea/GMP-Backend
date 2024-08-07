const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyType = require("../../../models/propertyTypeModel");

const getPropertyType = async (req, res, next) => {
	try {
		let { id } = req.params;
		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId) throw new ApiError('invalid id format', 400);

		let record = await PropertyType.findById(id)
			.lean()
			.select('_id name slug status created_at')

		if (!record) throw new ApiError('property type does not exist', 404);
		res.status(200).json({ status: true, message: 'property type detail', data: record });

	} catch (error) {
		next(error);
	}
}

module.exports = getPropertyType;