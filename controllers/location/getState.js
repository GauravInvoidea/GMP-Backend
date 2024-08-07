const { ObjectId } = require('bson');
const State = require('../../models/stateModel');
const { isValidObjectId } = require('mongoose');
const { ApiError } = require('../../errorHandler/apiErrorHandler');

const getState = async (req, res, next) => {
	try {
		let { page, limit, id, country_id, name } = req.query;
		page = page && parseInt(page);
		limit = limit && parseInt(limit);

		let conditionObj = { is_deleted: false };
		if (id) {
			if (!isValidObjectId(id)) throw new ApiError('invalid id format', 400);
			conditionObj._id = new ObjectId(id);
		}
		if (country_id) {
			if (!isValidObjectId(country_id)) throw new ApiError('invalid id format', 400);
			conditionObj.country_id = new ObjectId(country_id);
		}
		if (name) conditionObj.name = { $regex: new RegExp(name) }

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

		// return res.send(pipeline)
		let aggregateData = await State.aggregate(pipeline)

		let data, meta_data;
		if (page && limit) {
			data = aggregateData[0].data;
			meta_data = aggregateData[0].meta_data;
		} else {
			data = aggregateData
		}

		res.status(200).json({
			status: true,
			message: 'all state listing',
			data,
			meta_data,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = getState;