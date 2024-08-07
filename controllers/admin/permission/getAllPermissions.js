const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Permission = require('../../../models/permissionModel')

const getAllPermissions = async (req, res, next) => {
	// console.log('getAllPermissions', req.query);
	
	try {
		let { page, limit } = req.query;
		page ? parseInt(page) : 1;
		limit ? parseInt(limit) : 10;
	
		let conditionObj = { is_deleted: false };

		let allData = await Permission.find(conditionObj)
			.lean()
			.skip((page * limit) - limit)
			.limit(limit)
			.sort({ created_at: -1 })
			.select('name status');
		let totalCount = await Permission.countDocuments();

		res.status(200).json({
			status: true,
			message: 'permission listing',
			data: allData,
			total_data: totalCount,
			total_pages: Math.ceil(totalCount / limit),
		});
		
	} catch (error) {
		next(error);
	}
}

module.exports = getAllPermissions;