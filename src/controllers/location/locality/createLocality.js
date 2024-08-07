const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Locality = require("../../../models/localityModel");

const createLocality = async (req, res, next) => {
	// console.log('createLocality', req.body);

	try {
		let { name, slug } = req.body;
		if (!name) throw new ApiError('name is required', 400);
		if (!slug) throw new ApiError('slug is required', 400);

		let existingRecord = await Locality.findOne({ slug });
		if (existingRecord) throw new ApiError('locality already exist', 400);

		slug = String(slug).toLowerCase();
		await Locality.create({ name, slug });
		res.status(201).json({ status: true, message: 'locality created' });

	} catch (error) {
		next(error);
	}
}

module.exports = createLocality;