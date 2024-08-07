const fs = require("fs");
const multer = require("multer");
const { ApiError } = require("../errorHandler/apiErrorHandler");

const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", 'image/gif', 'application/pdf'];
const storage = multer.diskStorage({
	destination: (req, res, cb) => {
		if (!fs.existsSync("public/property_files")) fs.mkdirSync("public/property_files", { recursive: true });
		cb(null, "public/property_files");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + file.originalname);
	},
});

const productFileUpload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, //10mb
	fileFilter: (req, file, cb) => {
		allowedMimeTypes.includes(file.mimetype)
			? cb(null, true)
			: cb(new ApiError("Invalid multimedia type!", 400))
	},
}).fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'property_display_image', maxCount: 1 },
	{ name: 'gallery_images', maxCount: 30 },
	{ name: 'property_file', maxCount: 1 },
]);

module.exports = productFileUpload;