const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Locality = require("../../../models/localityModel");

const getLocality = async (req, res, next) => {
	try {
		let { id } = req.params;
		if (!id) throw new ApiError('id is required', 400);
		if (!isValidObjectId(id)) throw new ApiError('invalid id format', 400);

		let record = await Locality.findById(id)
			.lean()
			.select('_id name slug status created_at')

		if (!record) throw new ApiError('locality does not exist', 404);
		res.status(200).json({ status: true, message: 'locality detail', data: record });

	} catch (error) {
		next(error);
	}
}

module.exports = getLocality;