const express = require("express");
const courses = express.Router();
// const db = require('../dashboard/db')
const { video_upload } = require("../../models");

courses.use((req, res, next) => {
  let totalPost = [];
  //   const sql = `select * from video_upload`;
  video_upload
    .findAll({ raw: true })
    .then((result) => {
      console.log(result);
      totalPost.push(result.length);
      // must add 0 to the array to avoid crashing things

      totalPost.push(0);
      req.totalPost = totalPost;
      next();
    })
    .catch((err) => {
      throw err;
    });
});

courses.get("/courses", (req, res) => {
  const { totalPost } = req;
  const currentPage = 1;
  const promise = new Promise((resolve, reject) => {
    const data = [];
    const latestPost = [];
    // let sql = `select * from video_upload order by id desc limit 3`;
    video_upload
      .findAll({ raw: true })
      .then((results) => {
        results.forEach((result) => {
          const trunc = result.content.split("</p>");
          if (trunc.length > 1) {
            const index = result.content.indexOf(trunc[0]);
            const content = result.content.substr(0, index - 4) + "</p>";
            result.content = content;
          }
          result.video = true;
          data.push(result);
          if (latestPost.length < 5) {
            latestPost.push(result);
          }
          //   console.log(data, latestPost, totalPost);
          results.length - 1 === results.indexOf(result) &&
            resolve({ data, latestPost, totalPost });
        });
      })
      .catch((err) => {
        throw err;
        // sql = `select * from video_upload order by id desc limit 3`;
        // console.log('first done')
        // db.query(sql).on('result', result=>{
        //     // console.log(result)
        //     const trunc = result.content.split('</p>');
        //     if(trunc.length >= 1){
        //         const index = result.content.indexOf(trunc[1]);
        //         const content = result.content.substr(0,index - 4) + '.......</p>';
        //         result.content = content;
        //         // console.log()
        //     }
        //     result.video = true;
        //     data.push(result);
        //     if(latestPost.length < 4){
        //         latestPost.push(result)
        //     }
        // }).on('end', end=>{
        //     console.log('second done');
        // }).on('error', err=>{
        //     reject(err)
        // })
      });
  });

  promise.then((result) => {
    const { data, latestPost, totalPost } = result;
    // console.log(result);
    res.render("blog", { data, latestPost, totalPost, currentPage });
  });
});

courses.get("/courses/posts/:num", (req, res) => {
  const { num } = req.params;
  const promise = new Promise((resolve, reject) => {
    const data = [];
    const latestPost = [];
    const { totalPost } = req;
    const startingPoint = num * 3 - 3;
    const endingPoint = num * 3;
    // const sql = `select * from video_upload order by id desc`;
    video_upload.findAll({ raw: true }).then((result) => {
      //push latest post

      if (result.length > 0) {
        result.forEach((item) => {
          // console.log(latestPost.length)
          if (latestPost.length < 5) {
            item.video = true;
            latestPost.push(item);
          }
        });
      }

      //ends here
      if (result.length > (num - 1) * 3) {
        result = result.slice(startingPoint, endingPoint);
        if (result.length > 0) {
          result.forEach((item) => {
            const trunc = item.content.split("</p>");
            if (trunc.length >= 1) {
              const index = item.content.indexOf(trunc[0]);
              const content = item.content.substr(0, index - 4) + "......</p>";
              item.content = content;
            }
            item.video = true;
            data.push(item);
          });
        }
        resolve({ data, totalPost, latestPost });
      }
      // const sql = `select * from video_upload order by id desc`;
      // db.query(sql, (err, result)=>{
      //     if(err)throw err;
      //     //push latest vid up

      //         if(result.length > 0){
      //             result.forEach(item=>{
      //                 if(latestPost.length <= 6) latestPost.push(item);

      //             })
      //         }

      //     //ends here
      //     if(result.length > (num - 1) * 3){
      //         result = result.slice(startingPoint, endingPoint);
      //         if(result.length > 0){
      //             result.forEach(item=>{
      //                 const trunc = item.content.split('</p>');
      //                 if(trunc.length > 1){
      //                     const index = item.content.indexOf(trunc[1]);
      //                     const content = item.content.substr(0,index -4)+'......</p>';
      //                     item.content = content;
      //                 }

      //                 data.push(item)
      //             });
      //         }

      //     }
      // })
    });
  });
  promise.then((result) => {
    console.log(result);
    const { latestPost, totalPost, data } = result;
    res.render("blog", { latestPost, totalPost, data, currentPage: num });
  });
});

//fetch latest using middleware;
courses.use((req, res, next) => {
  const latestPost = [];
  //   const sql = "select * from video_upload order by id desc limit 6";
  video_upload
    .findAll({
      limit: 6,
      order: [["id", "desc"]],
      raw: true,
    })
    .then((result) => {
      result.video = true;
      latestPost.push(result);
      req.latestPost = latestPost;
      next();
    })
    .catch((err) => {
      throw err;
    });
});

courses.get("/courses/post/:postId", (req, res) => {
  let { postId } = req.params;
  postId = postId.replace("x", "");
  postId = Number(postId);
  console.log(postId);
  const { latestPost } = req;
  //   const sql = `select * from video_upload where id = ?`;
  video_upload
    .findOne({
      raw: true,
      where: {
        id: postId,
      },
    })
    .then((result) => {
      res.render("post", { latestPost, data: result[0] });
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = courses;
