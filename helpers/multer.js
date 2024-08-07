const multer = require('multer')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
		if (!fs.existsSync("public/images")) fs.mkdirSync("public/images", { recursive: true });
        cb(null, 'public/images') 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 100000000} })

module.exports = { upload }