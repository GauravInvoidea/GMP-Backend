const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        unique_id: { type: String, required: [true, `{PATH} is required`], unique: [true, '{PATH} should be unique'] }, // GMP + 001
        user_type: { type: String, required: [true, `{PATH} is required`] }, // admin, vender, user
        user_id: { type: mongoose.Types.ObjectId, required: [true, `{PATH} is required`], },
        type_id: { type: mongoose.Types.ObjectId, ref: 'PropertyType', required: [true, `{PATH} is required`] },
        purpose_id: { type: mongoose.Types.ObjectId, ref: 'PropertyPurpose', required: [true, `{PATH} is required`] },
        listing_package_id: { type: mongoose.Types.ObjectId, ref: 'PropertyListingPackage', default: null },
        category_id: { type: mongoose.Types.ObjectId, ref: 'PropertyCategory', required: [true, `{PATH} is required`] },
        amenity_id: { type: [mongoose.Types.ObjectId], ref: 'PropertyAmenity', default: [] },

        slug: { type: String, required: [true, `{PATH} is required`] },
        title: { type: String, required: [true, `{PATH} is required`] },
        description: { type: String, default: '' },
        meta_title: { type: String, default: '' },
        meta_description: { type: String, default: '' },
        address: { type: String, default: '' },
        views: { type: Number, default: 0 },
        unit: { type: Number, default: 1 },

        file_id: { type: mongoose.Types.ObjectId, ref: 'PropertyFile', default: null },
        display_image_id: { type: mongoose.Types.ObjectId, ref: 'PropertyImage', required: [true, `{PATH} is required`] },
        gallery_images: { type: [mongoose.Types.ObjectId], ref: 'PropertyImage', },
        video_link: { type: String, default: '' },
        room: { type: Number, default: 1 },
        space: { type: String, required: [true, '{PATH} is required'] },
        bedroom: { type: Number, default: 1 },
        bathroom: { type: Number, default: 1 },
        floor: { type: Number, default: 1 },
        kitchen: { type: Number, default: 1 },
        built_year: { type: Number, default: null },
        area: { type: Number, required: [true, `{PATH} is required`] },

        price: { type: Number, required: [true, `{PATH} is required`] },
        market_price: { type: Number, required: [true, `{PATH} is required`] },
        is_featured: { type: Boolean, default: false },
        top_property: { type: Boolean, default: false },
        expiry_date: { type: Date, default: null },

        country_id: { type: mongoose.Types.ObjectId, ref: 'Country' },
        state_id: { type: mongoose.Types.ObjectId, ref: 'State' },
        city_id: { type: mongoose.Types.ObjectId, ref: 'City' },
        locality_id: { type: [mongoose.Types.ObjectId], ref: 'Locality', default: [] },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },

        status: { type: String, default: 'unverified', enum: ['unverified', 'verified', 'rejected', 'active', 'inactive'] },
        is_deleted: { type: Boolean, default: false },

        // for geolocation
        location: {
            type: { type: String, enum: ['Point'], required: true }, // type: "Point",
            coordinates: { type: [Number], required: true }, // coordinates: [-73.856077, 40.848447]
        },
    },
    {
        collection: 'property',
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

propertySchema.index({ location: "2dsphere" })

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;

