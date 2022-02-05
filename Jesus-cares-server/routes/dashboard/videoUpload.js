const express = require("express");
const { video_upload: db } = require("../../models");
const video = express.Router();
const uuid = require("uuid").v1;

// video.use(fileUpload())

video.post("/video_upload", (req, res) => {
  const video = req.files.video;
  if (video !== null) {
    const { header, content } = req.body;
    const genName = uuid();
    const videoType = video.mimetype.split("/")[1];
    const date = new Date().toString();
    const document = req.files.document;
    const documentType =
      document !== undefined ? document.mimetype.split("/")[1] : undefined;

    //async storage of document
    const storeDocument = async () => {
      document.mv(
        `${__dirname}/../../public/uploads/docs/${genName}.${documentType}`,
        (err) => {
          if (err) throw err;
          console.log("document stored");
        }
      );
    };
    //ends here*****
    res.status(200).send();
    document !== undefined && storeDocument();
    video.mv(
      `${__dirname}/../../public/uploads/videos/${genName}.${videoType}`,
      async (err) => {
        if (err) throw err;
        console.log("moved..");
        //insert names and content to db;

        db.create({
          heading,
          content,
          date,
          video_name: `${genName}.${videoType}`,
          ...(document && { document_name: `${genName}.${documentType}` }),
        })
          .then((result) => {
            console.log("pushed to database");
          })
          .catch((error) => {
            throw error;
          });
      }
    );
  }
});

// db.create({
//   heading,
//   content,
//   date,
//   video_name: `${genName}.${videoType}`,
//   ...(document && { document_name: `${genName}.${documentType}` }),
// })
//   .then((result) => {
//     console.log("pushed to database");
//   })
//   .catch((error) => {
//     throw error;
//   });
module.exports = video;
