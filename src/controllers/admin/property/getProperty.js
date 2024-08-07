const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Property = require("../../../models/propertyModel");

const getProperty = async (req, res, next) => {
	try {
		let { id } = req.params;
		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId(id)) throw new ApiError('invalid id format', 400);

		let property = await Property.findById(id)
			.lean()
			.populate({ path: 'user_id', select: 'name profile_image user_type' })
			.populate({ path: 'type_id', select: 'name' })
			.populate({ path: 'purpose_id', select: 'name' })
			.populate({ path: 'listing_package_id', select: 'name' })
			.populate({ path: 'amenity_id', select: 'name' })
			.populate({ path: 'category_id', select: 'name' })
			.populate({ path: 'file_id', select: 'value' })
			.populate({ path: 'display_image_id', select: 'image' })
			.populate({ path: 'gallery_images', select: 'image' })
			.populate({ path: 'state_id', select: 'name' })
			.populate({ path: 'city_id', select: 'name' })
			.populate({ path: 'locality_id', select: 'name' })
			.populate({ path: 'user_id', model: 'NormalUser', select: 'name profile_image phone_number user_type' })
			.select('-location -updated_at -__v')

		if (!property) throw new ApiError('no property found with this id', 404);

		res.status(200).json({ status: true, message: 'property details', data: property });

	} catch (error) {
		next(error);
	}
}

module.exports = getProperty;