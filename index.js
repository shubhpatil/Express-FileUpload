const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");
const app = express();

// CORS
app.use(cors());

// EXPRESS FILE-UPLOAD
app.use(fileUpload());

// EXPRESS BODY-PARSER
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

// STATIC FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.get("/", async (req, res) => {
  res.send("Express File Upload");
});

// UPLOAD IMAGE ROUTE
app.post("/upload/image", async (req, res) => {
  let File = req.files.file;

  if (!File) {
    return res.json({
      status: 400,
      message: "No files were uploaded !",
    });
  }

  if (File.mimetype == "image/jpeg" || File.mimetype == "image/png") {
    // Nothing
  } else {
    return res.json({
      status: 400,
      message: "File Type Not Supported",
    });
  }

  // Delete Image
  // fs.unlinkSync(__dirname + "/uploads/file-QW0glSYL8sz3iqsemZo-Y.jpeg");

  let FileName = nanoid() + "-" + File.name;
  File["filename"] = FileName;
  File["path"] = `/uploads/${FileName}`;
  File["url"] = `http://localhost:5000/uploads/${FileName}`;

  File.mv(`${__dirname}/uploads/${FileName}`, (err) => {
    if (err) return res.status(500).send(err);

    res.json({
      status: 200,
      file: File,
      message: "File uploaded successfully",
    });
  });
});

// EXPRESS SERVER
app.listen(5000, async () => console.log(`Server Running on Localhost : 5000`));
