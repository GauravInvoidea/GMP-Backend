const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyAmenity = require("../../../models/propertyAmenityModel");


const getPropertyAmenity = async (req, res, next) => {
	try {
		let { id } = req.params;
		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId) throw new ApiError('invalid id format', 400);

		let propertyAmenity = await PropertyAmenity.findById(id)
			.lean()
			.select('_id image name status created_at')

		if (!propertyAmenity) throw new ApiError('property amenity does not exist', 404);
		res.status(200).json({ status: true, message: 'property amenity detail', data: propertyAmenity });

	} catch (error) {
		next(error);
	}
}

module.exports = getPropertyAmenity;