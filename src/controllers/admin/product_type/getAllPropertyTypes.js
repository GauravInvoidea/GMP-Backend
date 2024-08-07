const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const PropertyType = require("../../../models/propertyTypeModel");

const getAllPropertyTypes = async (req, res, next) => {
	// console.log('getAllPropertyTypes', req.query);

	try {
		let { page, limit } = req.query;
		page = page ? parseInt(page) : 1;
		limit = limit ? parseInt(limit) : 10;

		let conditionObj = { is_deleted: false };

		let aggregateData = await PropertyType.aggregate([
			{ $match: conditionObj },
			{ $sort: { created_at: -1 } },
			{
				$facet: {
					data: [{ $skip: (page * limit) - limit }, { $limit: limit }],
					total_data: [{ $count: 'total_data' },]
				}
			},
			{
				$addFields: {
					total_data: { $first: "$total_data.total_data" },
				}
			},
			{
				$project: {
					data: {
						_id: 1,
						name: 1,
						slug: 1,
						status: 1,
						created_at: 1,
					},
					meta_data: {
						current_page: { $literal: page },
						data_limit: { $literal: limit },
						total_data: { $ifNull: ["$total_data", 0] },
						total_pages: { $ifNull: [{ $ceil: { $divide: ["$total_data", limit] } }, 0] },
					},
				}
			}
		])

		let { data = [], meta_data = {} } = aggregateData[0];

		res.status(200).json({
			status: true,
			message: 'all property types listing',
			data,
			meta_data,
		});

	} catch (error) {
		next(error);
	}
}

module.exports = getAllPropertyTypes;