const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyPurpose = require("../../../models/propertyPurposeModel");

const deletePropertyPurpose = async (req, res, next) => {
	// console.log('deletePropertyPurpose', req.body);
	try {
		let {id} = req.params;
		if(!id) throw new ApiError('id is required', 400);
		if(!isValidObjectId) throw new ApiError('invalid id format', 400);

		let deletedRecord = await PropertyPurpose.findByIdAndUpdate(id, {is_deleted: true});
		if(!deletedRecord) throw new ApiError('record does not exist', 404);
		if (deletedRecord.is_deleted === true) throw new ApiError('record does not exist', 400);

		res.status(200).json({status: true, message: 'property purpose deleted successfully'});
	} catch (error) {
		next(error);
	}
}

module.exports = deletePropertyPurpose;