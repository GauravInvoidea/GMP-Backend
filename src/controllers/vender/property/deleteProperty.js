const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Property = require("../../../models/propertyModel");

const deleteProperty = async (req, res, next) => {
	// console.log('deleteProperty', req.body);

	try {
		let { id } = req.params;
		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId) throw new ApiError('invalid id format', 400);

		let property = await Property.findById(id);
		if (!property) throw new ApiError('property does not exist', 404);
		if (property.is_deleted === true) throw new ApiError('property does not exist', 400);
		if (property.user_id.toString() !== req.user._id.toString()) throw new ApiError('not allowed', 400);

		property.is_deleted = true;
		await property.save();

		res.status(200).json({ status: true, message: 'property deleted successfully' });
	} catch (error) {
		next(error);
	}
}

module.exports = deleteProperty;