const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const productFileUpload = require("../../../utils/productFileUpload");
const propertyFileDeleteHandler = require("../../../utils/propertyFileDeleteHandler");
const Property = require("../../../models/propertyModel");
const Country = require("../../../models/countryModel");
const City = require("../../../models/cityModel");
const State = require("../../../models/stateModel");
const PropertyImage = require("../../../models/propertyImageModel");
const PropertyFile = require("../../../models/propertyFileModel");
const PropertyType = require("../../../models/propertyTypeModel");
const PropertyPurpose = require("../../../models/propertyPurposeModel");
const PropertyListingPackage = require("../../../models/propertyListingPackageModel");
const PropertyCategory = require("../../../models/propertCategoryModel");
const Locality = require("../../../models/localityModel");

const statusEnum = ['active', 'inactive'];

const updateProperty = async (req, res, next) => {
	// console.log("updateProperty")
	productFileUpload(req, res, async (error) => {
		try {
			let { id, type_id, purpose_id, listing_package_id, category_id, amenity_id,
				slug, title, description, meta_title, meta_description, address, unit,
				video_link, room, space, bedroom, bathroom, floor, kitchen, built_year, area,
				price, market_price, is_featured, top_property, expiry_date,
				country_id, state_id, city_id, locality_id, latitude, longitude, status
			} = req.body;

			if (!id) throw new ApiError('id is requied', 400);
			if (!isValidObjectId(id)) throw new ApiError("Invalid ID format", 400);

			let property = await Property.findById(id).populate('file_id display_image_id')
			if (!property) throw new ApiError('property does not exist', 404);
			if (property.user_id.toString() !== req.user._id.toString()) throw new ApiError('property does not belong to this user', 400)

			if (type_id) {
				if (!isValidObjectId(type_id)) throw new ApiError('invalid type_id format', 400);
				let typeData = await PropertyType.findById(type_id);
				if (!typeData) throw new ApiError('no property type exist with this id', 404);
				property.type_id = type_id;
			}

			if (purpose_id) {
				if (!isValidObjectId(purpose_id)) throw new ApiError('invalid purpose_id format', 400);
				let purposeData = await PropertyPurpose.findById(purpose_id);
				if (!purposeData) throw new ApiError('no property purpose exist with this id', 404);
				property.purpose_id = purpose_id;
			}

			if (listing_package_id) {
				if (!isValidObjectId(listing_package_id)) throw new ApiError('invalid listing_package_id format', 400);
				let packageData = await PropertyListingPackage.findById(listing_package_id);
				if (!packageData) throw new ApiError('no property package exist with this id', 404);
				property.listing_package_id = listing_package_id;
			}

			if (category_id) {
				if (!isValidObjectId(category_id)) throw new ApiError('invalid category_id format', 400);
				let categoryData = await PropertyCategory.findById(category_id);
				if (!categoryData) throw new ApiError('no property category exist with this id', 404);
				property.category_id = category_id;
			}

			if (amenity_id) {
				amenity_id = [...new Set(JSON.parse(amenity_id))];
				let invalidAmetiyID = amenity_id.some(id => !isValidObjectId(id))
				if (invalidAmetiyID) throw new ApiError('invalid id format of property amenities', 400);
				property.amenity_id = amenity_id;
			}

			if (slug) {
				let existingProperty = await Property.findOne({ _id: { $ne: id }, slug });
				if (existingProperty) throw new ApiError('property already exist', 400);
				property.slug = slug;
			}

			if (title) property.title = title
			if (description) property.description = description
			if (meta_title) property.meta_title = meta_title
			if (meta_description) property.meta_description = meta_description
			if (address) property.address = address
			if (unit) property.unit = unit
			if (video_link) property.video_link = video_link
			if (room) property.room = room
			if (bedroom) property.bedroom = bedroom
			if (bathroom) property.bathroom = bathroom
			if (floor) property.floor = floor
			if (kitchen) property.kitchen = kitchen
			if (built_year) property.built_year = built_year
			if (is_featured) property.is_featured = is_featured
			if (top_property) property.top_property = top_property
			if (expiry_date) property.expiry_date = expiry_date
			if (expiry_date) property.expiry_date = expiry_date
			if (space) property.space = space
			if (area) property.area = area
			if (price) property.price = price
			if (market_price) property.market_price = market_price
			if (status) {
				if (!statusEnum.includes(status)) throw new ApiError('please provide valid status enum', 400);
				if (property.status === 'unverified') throw new ApiError('not allowed', 400);
				property.status = status;
			}
			if (latitude) {
				property.latitude = latitude
				property.location.coordinates[0] = latitude
			}
			if (longitude) {
				property.longitude = longitude
				property.location.coordinates[1] = longitude
			}

			if (country_id) {
				if (!isValidObjectId(country_id)) throw new ApiError('invalid country_id format', 400);
				let country = await Country.findById(country_id).lean();
				if (!country) throw new ApiError('country not found', 404);
				property.country_id = country_id;
			}

			if (state_id) {
				if (!isValidObjectId(state_id)) throw new ApiError('invalid state_id format', 400);
				let state = await State.findById(state_id).lean();
				if (!state) throw new ApiError('state does not exist', 404);
				property.state_id = state_id;
			}

			if (city_id) {
				if (!isValidObjectId(city_id)) throw new ApiError('invalid city_id format', 400);
				let city = await City.findById(city_id);
				if (!city) throw new ApiError('city does not exist', 404);
				if (city.state_id.toString() !== property.state_id.toString()) throw new ApiError('city does not belong to property state', 400);
				property.city_id = city_id;
			}

			if (locality_id) {
				locality_id = [...new Set(JSON.parse(locality_id))];
				let invalidLocalityID = locality_id.some(id => !isValidObjectId(id))
				if (invalidLocalityID) throw new ApiError('invalid id format of locality', 400);
			}

			if (req.files?.property_display_image) {
				let oldImage = property.display_image_id.image;
				let display_image_id = req.files?.property_display_image?.[0]?.filename;
				await PropertyImage.findByIdAndUpdate(property.display_image_id, { image: display_image_id })
				propertyFileDeleteHandler(oldImage)
			}

			if (req.files?.property_file) {
				let oldFile = property.file_id.value;
				let file_id = req.files?.property_file?.[0]?.filename;
				await PropertyFile.findByIdAndUpdate(property.file_id, { value: file_id })
				propertyFileDeleteHandler(oldFile)
			}

			await property.save();
			res.status(200).json({ status: true, message: 'property updated' })
		} catch (error) {
			next(error);
		}
	})
}

module.exports = updateProperty;