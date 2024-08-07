const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyAmenity = require("../../../models/propertyAmenityModel");
const productFileUpload = require("../../../utils/productFileUpload");

const createPropertyAmenity = async (req, res, next) => {
	// console.log('createPropertyAmenity', req.body);

	productFileUpload(req, res, async (error) => {
		try {
			if (error) throw new ApiError(error.message, 400);

			let { name } = req.body;

			if (!name) throw new ApiError('name is required', 400);

			let existingRecord = await PropertyAmenity.findOne({ name });
			if (existingRecord) throw new ApiError('property amenity already exist', 400);

			let image;
			if (req.files.image) image = req.files.image[0].filename;

			await PropertyAmenity.create({ name, image });
			res.status(201).json({ status: true, message: 'property amenity created' });
		} catch (error) {
			next(error)
		}
	})
}

module.exports = createPropertyAmenity;