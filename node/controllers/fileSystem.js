const fs = require("fs");
const path = require("path");

const saveFile = (file, directory, callback) => {
  const filename = `${Date.now()}-${file.originalname}`;
  const filepath = path.join(__dirname, "../public", directory, filename);

  fs.mkdir(path.dirname(filepath), { recursive: true }, (err) => {
    if (err) {
      return callback(err);
    }

    const writeStream = fs.createWriteStream(filepath);
    writeStream.on("finish", () => {
      callback(null, `/public/${directory}/${filename}`);
    });
    writeStream.on("error", (err) => {
      callback(err);
    });

    file.stream.pipe(writeStream);
  });
};

const deleteFile = (filePath, callback) => {
  if (filePath) {
    const fullPath = path.join(__dirname, "../public", filePath);
    fs.unlink(fullPath, callback);
  } else {
    callback();
  }
};

module.exports = {
  saveFile,
  deleteFile,
};
