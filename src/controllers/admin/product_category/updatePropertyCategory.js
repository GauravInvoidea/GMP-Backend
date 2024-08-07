const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyCategory = require("../../../models/propertCategoryModel");

let statusEnum = ['active', 'inactive'];

const updatePropertyCategory = async (req, res, next) => {
	// console.log('updatePropertyCategory', req.body);
	try {
		let { id, name, slug, status } = req.body;

		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId(id)) throw new ApiError('invalid id format', 400);

		let updateObj = {}
		if (name) updateObj.name = name;
		if (slug) {
			let oldRecord = await PropertyCategory.findOne({ _id: { $ne: id }, slug });
			if (oldRecord) throw new ApiError('slug already exist', 400);
			updateObj.slug = slug;
		}
		if (status) {
			if (!statusEnum.includes(status)) throw new ApiError('provide valid status field', 400);
			updateObj.status = status;
		}

		let updatedRecord = await PropertyCategory.findByIdAndUpdate(id, updateObj, { new: true });
		if (!updatedRecord) throw new ApiError('property category does not exist', 404);

		res.status(200).json({ status: true, message: 'property category updated successfully', data: updatedRecord });
	} catch (error) {
		next(error)
	}
}

module.exports = updatePropertyCategory;