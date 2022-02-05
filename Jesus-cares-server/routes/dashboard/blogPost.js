const express = require("express");
const { blog_post: db } = require("../../models");
const blogPost = express.Router();
const uuid = require("uuid").v1;

blogPost.post("/blog_post", async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const { coverPhoto } = req.files;
  const imageType = coverPhoto.mimetype.split("/")[1];
  const imageName = `${uuid()}.${imageType}`;
  const content = req.body.content;
  const author = req.body.author;
  const heading = req.body.header;
  // const sql = `insert into blog_post (heading, content, author, date, image_name) values (?,?,?,?,?)`;

  try {
    await db.create({
      heading,
      content,
      author,
      date: new Date().toString(),
      image_name: imageName,
    });
    coverPhoto.mv(
      `${__dirname}/../../public/uploads/coverPhotos/${imageName}`,
      (err) => {
        if (err) throw err;
        else console.log("image uploaded");
      }
    );
    res.status(200).send({ message: "uploaded" });
  } catch {
    throw {
      error: "an error occurred while uploading content!",
    };
  }

  //   db.query(
  //     sql,
  //     [header, content, author, new Date().toString(), imageName],
  //     (err, result) => {
  //       if (err) throw err;
  //       console.log("inserted..");
  //     }
  //   );
});
// console.log(new Date().toString())

module.exports = blogPost;
