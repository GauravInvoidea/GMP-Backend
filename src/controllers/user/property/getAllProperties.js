const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const Property = require("../../../models/propertyModel");
const { ObjectId } = require('bson')


const getAllProperties = async (req, res, next) => {
	// console.log('getAllProperties', req.body);

	try {
		let { lat, long, state_id, city_id, locality_id, purpose_id, category_id, amenity_id, type_id, space, min_price, max_price, sort_by, page, limit } = req.body;
		page = page ? parseInt(page) : 1;
		limit = limit ? parseInt(limit) : 10;

		let conditionObj = { is_deleted: false, $or: [{ status: 'active' }, { status: 'verified' }] }
		let pipeline = []

		if (state_id) conditionObj.state_id = new ObjectId(state_id);
		if (city_id) conditionObj.city_id = new ObjectId(city_id);
		if (purpose_id) conditionObj.purpose_id = new ObjectId(purpose_id);
		if (category_id) conditionObj.category_id = new ObjectId(category_id);
		if (type_id) conditionObj.type_id = new ObjectId(type_id);
		if (amenity_id) {
			amenity_id = amenity_id.split(",").map(id => new ObjectId(id));
			conditionObj.amenity_id = { $in: amenity_id };
		}
		if (locality_id) {
			locality_id = locality_id.split(",").map(id => new ObjectId(id));
			conditionObj.locality_id = { $in: locality_id };
		}
		if (space) conditionObj.space = space;
		if (min_price || max_price) {
			conditionObj.market_price = {}
			if (min_price) conditionObj.market_price["$gt"] = Number(min_price)
			if (max_price) conditionObj.market_price["$lt"] = Number(max_price)
		}

		let sortBy = { created_at: -1 };
		if (sort_by) {
			if (sort_by === 'price_ascending') sortBy = { market_price: 1 };
			else if (sort_by === 'price_descending') sortBy = { market_price: -1 };
		}

		if (lat && long) {
			// {
			// 	$geoNear: {
			// 		near: { type: 'Point', coordinates: [ 28.4075165, 77.0449214 ] },
			// 		distanceField: 'a',
			// 		maxDistance: 200 * 1000,
			// 		spherical: true,
			// 	}
			// }
		}


		let aggregateData = await Property.aggregate([
			{ $match: conditionObj },
			{ $sort: sortBy },
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