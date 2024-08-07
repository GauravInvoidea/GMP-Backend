const fs = require("fs");

const propertyFileDeleteHandler = (image) => {
    console.log("image", image);

    if (!image) return;
    if (fs.existsSync(`public/property_files/${image.split("image/")[1]}`)) {
        fs.unlink(`public/property_files/${image.split("image/")[1]}`, (err) => {
            if (err) return console.log("Error in deleting image!");
            console.log("Image deleted successfully.");
        });
    }
}

module.exports = propertyFileDeleteHandler;