const express = require("express");

const fileUpload = require("express-fileupload");
const path = require("path");
const fsPromises = require("fs").promises;

const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 3500;

const app = express();
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files;
    console.log(files);
    Object.keys(files).forEach((key) => {
      const filePath = path.join(__dirname, "files", files[key].name);
      files[key].mv(filePath, (err) => {
        if (err) return res.status(500).json({ status: "error", message: err });
      });
    });

    return res
      .status(200)
      .json({ status: "success", message: Object.keys(files).toString() });
  }
);

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
