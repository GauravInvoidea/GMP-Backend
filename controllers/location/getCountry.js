const Country = require("../../models/countryModel");
const { ObjectId } = require('bson')

const getCountry = async (req, res, next) => {
	try {
		let { page, limit, id } = req.query;
		page = page && parseInt(page);
		limit = limit && parseInt(limit);

		let conditionObj = { is_deleted: false };
		if (id) conditionObj._id = new ObjectId(id);

		let pipeline = [
			{ $match: conditionObj },
			{ $sort: { name: 1 } },
		]

		if (page && limit) {
			pipeline.push(
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
			)
		} else {
			pipeline.push(
				{
					$project: {
						_id: 1,
						name: 1,
						status: 1,
						created_at: 1,
					}
				})
		}

		let aggregateData = await Country.aggregate(pipeline)

		let data, meta_data;
		if (page && limit) {
			data = aggregateData[0].data;
			meta_data = aggregateData[0].meta_data;
		} else {
			data = aggregateData
		}

		res.status(200).json({
			status: true,
			message: 'all country listing',
			data,
			meta_data,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = getCountry;