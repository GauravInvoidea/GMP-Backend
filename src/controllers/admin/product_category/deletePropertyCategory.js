const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyCategory = require("../../../models/propertCategoryModel");

const deletePropertyCategory = async (req, res, next) => {
	// console.log('deletePropertyCategory', req.body);
	try {
		let { id } = req.params;
		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId) throw new ApiError('invalid id format', 400);

		let deletedRecord = await PropertyCategory.findByIdAndUpdate(id, { is_deleted: true });
		if (!deletedRecord) throw new ApiError('property category does not exist', 404);
		if (deletedRecord.is_deleted === true) throw new ApiError('property category does not exist', 400);

		res.status(200).json({ status: true, message: 'property category deleted successfully' });
	} catch (error) {
		next(error);
	}
}

module.exports = deletePropertyCategory;