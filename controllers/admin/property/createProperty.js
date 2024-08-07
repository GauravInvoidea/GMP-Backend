const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../../errorHandler/apiErrorHandler");
const productFileUpload = require("../../../utils/productFileUpload");
const PropertyType = require("../../../models/propertyTypeModel");
const PropertyPurpose = require("../../../models/propertyPurposeModel");
const PropertyCategory = require("../../../models/propertCategoryModel");
const Property = require("../../../models/propertyModel");
const PropertyImage = require("../../../models/propertyImageModel");
const PropertyListingPackage = require("../../../models/propertyListingPackageModel");
const PropertyFile = require("../../../models/propertyFileModel");
const Country = require("../../../models/countryModel");
const State = require("../../../models/stateModel");
const City = require("../../../models/cityModel");
const Locality = require("../../../models/localityModel");
const PropertyAmenity = require("../../../models/propertyAmenityModel");

const createProperty = async (req, res, next) => {
	// console.log('createProperty', req.body);

	productFileUpload(req, res, async (error) => {
		try {
			if (error) throw new ApiError(error, 400);

			let { type_id, purpose_id, listing_package_id, category_id, amenity_id,
				slug, title, description, meta_title, meta_description, address, unit,
				video_link, room, space, bedroom, bathroom, floor, kitchen, built_year, area,
				price, market_price, is_featured, top_property, expiry_date,
				country_id, state_id, city_id, locality_id, latitude, longitude,
			} = req.body;

			if (!type_id) throw new ApiError('type_id is required', 400);
			if (!isValidObjectId(type_id)) throw new ApiError('invalid type_id format', 400);
			let typeData = await PropertyType.findById(type_id);
			if (!typeData) throw new ApiError('no property type exist with this id', 404);

			if (!purpose_id) throw new ApiError('purpose_id is required', 400);
			if (!isValidObjectId(purpose_id)) throw new ApiError('invalid purpose_id format', 400);
			let purposeData = await PropertyPurpose.findById(purpose_id);
			if (!purposeData) throw new ApiError('no property purpose exist with this id', 404);

			if (!category_id) throw new ApiError('category_id is required', 400);
			if (!isValidObjectId(category_id)) throw new ApiError('invalid category_id format', 400);
			let categoryData = await PropertyCategory.findById(category_id);
			if (!categoryData) throw new ApiError('no property category exist with this id', 404);

			if (listing_package_id) {
				if (!isValidObjectId(listing_package_id)) throw new ApiError('invalid listing_package_id format', 400);
				let packageData = await PropertyListingPackage.findById(listing_package_id);
				if (!packageData) throw new ApiError('no property package exist with this id', 404);
			}

			if (amenity_id) {
				amenity_id = [...new Set(JSON.parse(amenity_id))];
				let invalidAmetiyID = amenity_id.some(id => !isValidObjectId(id))
				if (invalidAmetiyID) throw new ApiError('invalid id format of property amenities', 400);
			}

			if (!slug) throw new ApiError('slug is required', 400);
			let existingProperty = await Property.findOne({ slug });
			if (existingProperty) throw new ApiError('property already exist', 400);

			if (!title) throw new ApiError('title is required', 400);
			if (!space) throw new ApiError('space is required', 400);
			if (!area) throw new ApiError('area is required', 400);
			if (!price) throw new ApiError('price is required', 400);
			if (!market_price) throw new ApiError('market_price is required', 400);
			// if (!latitude) throw new ApiError('latitude is required', 400);
			// if (!longitude) throw new ApiError('longitude is required', 400);

			if (!req.files?.property_display_image) throw new ApiError('property display image is required', 400);

			let country = await Country.find({})
			if (country.length === 0) throw new ApiError('country not found', 404);
			country_id = country?.[0]?.name === 'India' ? country?.[0]?._id : '';

			if (!state_id) throw new ApiError('state_id is required', 400);
			if (!isValidObjectId(state_id)) throw new ApiError('invalid state_id format', 400);
			let state = await State.findById(state_id);
			if (!state) throw new ApiError('state does not exist', 404);
			state_id = state?._id;

			if (!city_id) throw new ApiError('city_id is required', 400);
			if (!isValidObjectId(city_id)) throw new ApiError('invalid city_id format', 400);
			let city = await City.findById(city_id);
			if (!city) throw new ApiError('city does not exist', 404);
			city_id = city?._id;

			// if (!locality_id) throw new ApiError('locality_id is required', 400);
			// if (!isValidObjectId(locality_id)) throw new ApiError('invalid locality_id format', 400);
			// let locality = await Locality.findById(locality_id);
			// if (!locality) throw new ApiError('locality does not exist', 404);
			// locality_id = locality?._id;

			if (locality_id) {
				locality_id = [...new Set(JSON.parse(locality_id))];
				let invalidLocalityID = locality_id.some(id => !isValidObjectId(id))
				if (invalidLocalityID) throw new ApiError('invalid id format of locality', 400);
			}

			let rootUser = req.user;
			let unique_id, user_type, user_id, file, display_image, location, status, display_image_id, file_id;

			user_type = rootUser.user_type;
			user_id = rootUser._id;
			location = { type: 'Point', coordinates: [latitude, longitude] };
			status = 'verified';

			display_image = req.files?.property_display_image?.[0]?.filename;
			let propertyImage = await PropertyImage.create({ image: display_image })
			display_image_id = propertyImage._id;

			let imageArr = []
			if (req.files.gallery_images) {
				for (let i = 0; i < req.files.gallery_images.length; i++) {
					const element = req.files.gallery_images[i];
					let propertyImage = await PropertyImage.create({ image: element.filename })
					imageArr.push(propertyImage._id)
				}
			}
			gallery_images = imageArr;

			if (req.files.property_file) {
				file = req.files?.property_file?.[0]?.filename;
				let propertyFile = await PropertyFile.create({ value: file })
				file_id = propertyFile._id;
			}

			let totalProperty = await Property.countDocuments() + 1
			unique_id = 'GMP' + String(totalProperty).padStart(4, 0);

			let newPropertyObj = {
				type_id, purpose_id, listing_package_id, category_id, amenity_id,
				slug, title, description, meta_title, meta_description, address, unit,
				video_link, room, space, bedroom, bathroom, floor, kitchen, built_year, area,
				price, market_price, is_featured, top_property, expiry_date,
				country_id, state_id, city_id, locality_id, latitude, longitude,
				unique_id, user_id, user_type, location, display_image_id, gallery_images, file_id, status: 'active',
			}
			let property = await Property.create(newPropertyObj);
			res.status(201).json({ status: true, message: 'property created', });
		} catch (error) {
			next(error)
		}
	})
}

module.exports = createProperty;