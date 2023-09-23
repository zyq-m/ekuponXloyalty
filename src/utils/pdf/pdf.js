const { create } = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");

// Read HTML Template
const html = fs.readFileSync(
  path.join(__dirname, "../../views/template.html"),
  "utf8"
);

const options = {
  format: "A4",
  orientation: "landscape",
  border: "10mm",
  // header: {
  //   height: "45mm",
  //   contents: '<div style="text-align: center;">Author: Shyam Hajare</div>',
  // },
  // footer: {
  //   height: "28mm",
  //   contents: {
  //     first: "Cover page",
  //     2: "Second page", // Any page number is working. 1-based index
  //     default:
  //       '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
  //     last: "Last Page",
  //   },
  // },
};

const users = [
  {
    name: "Shyam",
    age: "26",
  },
  {
    name: "Navjot",
    age: "26",
  },
  {
    name: "Vitthal",
    age: "26",
  },
];

const document = {
  html: html,
  data: {
    users: users,
  },
  path: "./uploads/docs/output.pdf",
  type: "",
};
// By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.

exports.generatePDF = async function (data, template) {
  return create(document, options);
};
