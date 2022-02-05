const express = require("express");
const projects = express.Router();
const uuid = require("uuid").v1;
const { projects: db } = require("../../models");

projects.post("/projects_upload", (req, res) => {
  const { content } = req.body;
  console.log(content);
  const image = req.files.image;
  const newName = uuid() + ".jpg";
  image.mv(
    `${__dirname}/../../public/uploads/coverPhotos/${newName}`,
    (err, result) => {
      if (err) throw err;
      const sql = `insert into projects (name, content, date) values (?,?,?)`;
      db.create({
        name: newName,
        content,
        date: new Date(),
      })
        .then(async (result) => {
          console.log("added project file name to db");
          res.status(200).send();
        })
        .catch((error) => {
          throw error;
        });
      // console.log(result);
    }
  );
});

// console.log(new Date())

module.exports = projects;
