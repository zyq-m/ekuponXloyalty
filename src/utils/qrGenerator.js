const qr = require("qr-image");
const fs = require("fs");
const path = require("path");

exports.createQR = (url, name) => {
  const qrImg = qr.image(url, { type: "png" });
  qrImg.pipe(fs.createWriteStream(path.join(`uploads/qr/${name}.png`)));
};
