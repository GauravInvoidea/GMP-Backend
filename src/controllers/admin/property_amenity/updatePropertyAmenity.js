const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const productFileUpload = require("../../../utils/productFileUpload");
const PropertyAmenity = require("../../../models/propertyAmenityModel");
const propertyFileDeleteHandler = require("../../../utils/propertyFileDeleteHandler");

const updatePropertyAmenity = async (req, res, next) => {
	// console.log("updatePropertyAmenity")
	productFileUpload(req, res, async (error) => {
		try {
			let { id, name, status } = req.body;

			if (!id) throw new ApiError('id is requied', 400);
			if (!isValidObjectId(id)) throw new ApiError("Invalid ID format", 400);

			let propertyAmenity = await PropertyAmenity.findById(id)
			if (!propertyAmenity) throw new ApiError('property amenity does not exist', 404);


			let oldImage = propertyAmenity.image;

			if (name) propertyAmenity.name = name;
			if (status) propertyAmenity.status = status;
			if (req.files?.image) propertyAmenity.image = req.files?.image?.[0]?.filename;

			await propertyAmenity.save();
			res.status(200).json({ status: true, message: 'property amenity updated' })
			propertyFileDeleteHandler(oldImage)
		} catch (error) {
			next(error);
		}
	})
}

module.exports = updatePropertyAmenity;