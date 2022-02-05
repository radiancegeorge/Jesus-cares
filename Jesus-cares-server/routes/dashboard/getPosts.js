const express = require("express");
// const { get, post } = require('../front end/blog');
const { blog_post, video_upload, projects } = require("../../models");
const getPosts = express.Router();

getPosts.get("/get_recent", (req, res) => {
  const recentPosts = [];
  //   const sql = `select id, heading, date from blog_post order by id desc limit 10`;
  blog_post
    .findAll({
      limit: 10,
      order: [["id", "desc"]],
      raw: true,
    })

    .then((result) => {
      recentPosts.push(result);
      //   const sql = `select id, heading, date from video_upload order by id desc limit 10`;
      video_upload
        .findAll({
          raw: true,
          limit: 10,
          order: [["id", "desc"]],
        })
        .then((result) => {
          recentPosts.push(result);
          //   const sql = `select * from projects order by id limit 10`;
          projects
            .query({
              limit: 10,
              order: [["id", "desc"]],
            })
            .then((result) => {
              // console.log(result);
              recentPosts.push(result);
              res.status(200).send(recentPosts);
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch((error) => {
          throw error;
        });
    })
    .catch((err) => {
      throw err;
    });
});

getPosts.post("/get_recent", (req, res) => {
  eval(req.body.name)
    .destroy({ where: { id: req.body.id } })
    .then((result) => {
      res.status(200).send();
    })
    .catch((error) => {
      throw error;
    });
});

getPosts.post("/edit", (req, res) => {
  const { id, type } = req.body;
  console.log(type);
  //   const sql = `select * from ${type} where id = ?`;
  eval(type)
    .findOne({
      where: {
        id,
      },
      raw: true,
    })
    .then((result) => {
      result.type = type;
      res.send(result);
    })
    .catch((error) => {
      throw error;
    });
});

//update

getPosts.post("/update_post", (req, res) => {
  const { type, content, header: heading, id } = req.body;
  eval(type)
    .update(
      {
        content,
        heading,
      },
      {
        where: {
          id,
        },
      }
    )
    .then((result) => {
      res.status(200).send();
    })
    .catch((error) => {
      throw error;
    });
});

module.exports = getPosts;
