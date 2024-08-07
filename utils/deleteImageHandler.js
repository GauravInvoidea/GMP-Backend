const fs = require("fs");

const deleteImageHandler = (image) => {
    console.log("image", image);

    if (!image) return;
    if (fs.existsSync(`public/images`)) {
        fs.unlink(`public/images/${image}`, (err) => {
            if (err) return console.log("Error in deleting image!");
            console.log("Image deleted successfully.");
        });
    }
}

module.exports = deleteImageHandler;