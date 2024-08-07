const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyType = require("../../../models/propertyTypeModel");

let statusEnum = ['active', 'inactive'];

const updatePropertyType = async (req, res, next) => {
	// console.log('updatePropertyType', req.body);
	try {
		let { id, name, status } = req.body;

		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId(id)) throw new ApiError('invalid id format', 400);

		let updateObj = {}
		if (name) updateObj.name = name;
		if (slug) {
			let existingRecord = await PropertyType.findOne({ _id: { $ne: id }, slug });
			if (existingRecord) throw new ApiError('slug already exist', 400);
			updateObj.slug = slug;
		}
		if (status) {
			if (!statusEnum.includes(status)) throw new ApiError('provide valid status field', 400);
			updateObj.status = status;
		}

		let updatedRecord = await PropertyType.findByIdAndUpdate(id, updateObj, { new: true });
		if (!updatedRecord) throw new ApiError('property type does not exist', 404);

		res.status(200).json({ status: true, message: 'property type updated successfully', data: updatedRecord });
	} catch (error) {
		next(error)
	}
}

module.exports = updatePropertyType;