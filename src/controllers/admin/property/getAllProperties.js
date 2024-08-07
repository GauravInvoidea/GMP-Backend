const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Property = require("../../../models/propertyModel");

const getAllProperties = async (req, res, next) => {
	// console.log('getAllProperties', req.query);

	try {
		let { page, limit } = req.query;
		page = page ? parseInt(page) : 1;
		limit = limit ? parseInt(limit) : 10;

		let conditionObj = { is_deleted: false };

		let aggregateData = await Property.aggregate([
			{ $match: conditionObj },
			{ $sort: { created_at: -1 } },
			{
				$lookup: {
					from: 'normal_user',
					localField: 'user_id',
					foreignField: '_id',
					as: 'user',
				}
			},
			{ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'property_type',
					localField: 'type_id',
					foreignField: '_id',
					as: 'type',
				}
			},
			{ $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'property_purpose',
					localField: 'purpose_id',
					foreignField: '_id',
					as: 'purpose',
				}
			},
			{ $unwind: { path: "$purpose", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'property_listing_package',
					localField: 'listing_package_id',
					foreignField: '_id',
					as: 'listing_package',
				},
			},
			{ $unwind: { path: "$listing_package", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'property_category',
					localField: 'category_id',
					foreignField: '_id',
					as: 'category',
				},
			},
			{ $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'property_amenity',
					localField: 'amenity_id',
					foreignField: '_id',
					as: 'amenity',
				},
			},
			{
				$lookup: {
					from: 'property_image',
					localField: 'display_image',
					foreignField: '_id',
					as: 'display_image'
				}
			},
			{ $unwind: { path: "$display_image", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'property_image',
					localField: 'gallery_images',
					foreignField: '_id',
					as: 'gallery_images'
				}
			},
			{
				$lookup: {
					from: 'state',
					localField: 'state_id',
					foreignField: '_id',
					as: 'state'
				}
			},
			{ $unwind: { path: "$state", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'city',
					localField: 'city_id',
					foreignField: '_id',
					as: 'city'
				}
			},
			{ $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'locality',
					localField: 'locality_id',
					foreignField: '_id',
					as: 'locality'
				}
			},
			{ $unwind: { path: "$locality", preserveNullAndEmptyArrays: true } },
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
						unique_id: 1,
						user_type: 1,
						slug: 1,
						title: 1,
						description: 1,
						meta_title: 1,
						meta_description: 1,
						address: 1,
						views: 1,
						unit: 1,
						file: 1,
						video_link: 1,
						room: 1,
						space: 1,
						bedroom: 1,
						bathroom: 1,
						floor: 1,
						kitchen: 1,
						built_year: 1,
						area: 1,
						price: 1,
						market_price: 1,
						is_featured: 1,
						top_property: 1,
						expiry_date: 1,
						status: 1,
						created_at: 1,
						type: { _id: 1, name: 1 },
						purpose: { _id: 1, name: 1 },
						listing_package: { _id: 1, name: 1 },
						category: { _id: 1, name: 1 },
						display_image: { _id: 1, image: 1 },
						gallery_images: { _id: 1, image: 1 },
						state: { _id: 1, name: 1 },
						city: { _id: 1, name: 1 },
						locality: { _id: 1, name: 1 },
						amenity: { _id: 1, name: 1 },
						user: { _id: 1, name: 1, user_type: 1 },
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
			message: 'all property listing',
			data,
			meta_data,
		});

	} catch (error) {
		next(error);
	}
}

module.exports = getAllProperties;