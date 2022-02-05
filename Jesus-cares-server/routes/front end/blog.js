const { request } = require("express");
const express = require("express");
// const { end } = require("../dashboard/db");
// const db = require("../dashboard/db");
const { blog_post } = require("../../models");

const blog = express.Router();

blog.use((req, res, next) => {
  let totalPost = [];
  //   const sql = `select * from blog_post`;
  blog_post
    .findAll({ raw: true })
    .then((result) => {
      //   console.log(result);
      totalPost.push(0);
      for (const i of result) {
        totalPost.push(result.indexOf(i) + 1);
      }
      //must add 0 to the array to avoid crashing things;

      req.totalPost = totalPost;
      //   console.log(totalPost);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

blog.get("/", (req, res) => {
  const { totalPost } = req;
  const currentPage = 1;
  const promise = new Promise((resolve, reject) => {
    const data = [];
    const latestPost = [];
    let sql = `select * from blog_post order by id desc limit 3`;
    blog_post
      .findAll({
        order: [["id", "desc"]],
        limit: 3,
        raw: true,
      })
      .then((results) => {
        // console.log(results, result.content);
        results.forEach((result) => {
          const trunc = result.content.split("</p>");
          if (trunc.length > 1) {
            const index = result.content.indexOf(trunc[1]);
            const content = result.content.substr(0, index - 4) + "......</p>";
            result.content = content;
          }
          data.push(result);
          if (latestPost.length < 5) {
            latestPost.push(result);
          }

          results.length - 1 === results.indexOf(result) &&
            // console.log(data, latestPost, totalPost) &&
            resolve({ data, latestPost, totalPost });
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
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

  //   console.log(promise);
  promise
    .then((result) => {
      //   console.log(result);
      //   const { data, latestPost, totalPost } = result;
      res.render("blog", result);
    })
    .catch((err) => {
      console.log(err);
    });
});

//to see next and previous posts::

blog.get("/posts/:num", (req, res) => {
  const { num } = req.params;
  const promise = new Promise((resolve, reject) => {
    const data = [];
    const latestPost = [];
    const { totalPost } = req;
    const startingPoint = num * 3 - 3;
    const endingPoint = num * 3;
    // const sql = `select * from blog_post order by id desc`;
    blog_post
      .findAll({
        order: [["id", "desc"]],
        raw: true,
      })
      .then((result) => {
        //push latest post

        if (result.length > 0) {
          result.forEach((item) => {
            // console.log(latestPost.length)
            if (latestPost.length < 5) latestPost.push(item);
          });
        }

        //ends here
        if (result.length > (num - 1) * 3) {
          result = result.slice(startingPoint, endingPoint);
          if (result.length > 0) {
            result.forEach((item) => {
              const trunc = item.content.split("</p>");
              if (trunc.length > 1) {
                const index = item.content.indexOf(trunc[1]);
                const content =
                  item.content.substr(0, index - 4) + "......</p>";
                item.content = content;
              }

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
    // console.log(result);
    const { latestPost, totalPost, data } = result;
    res.render("blog", { latestPost, totalPost, data, currentPage: num });
  });
});

//fetch latest using middleware;
blog.use((req, res, next) => {
  const latestPost = [];
  //   const sql = "select * from blog_post order by id desc limit 6";
  blog_post
    .findAll({
      raw: true,
      order: [["id", "desc"]],
      limit: 6,
    })
    .then((result) => {
      latestPost.push(result);
      req.latestPost = latestPost;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

blog.get("/post/:postId", (req, res) => {
  const { postId } = req.params;
  const { latestPost } = req;
  const sql = `select * from blog_post where id = ?`;
  blog_post
    .findAll({
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

// console.log(new Date().toString().split(' ')[1])

module.exports = blog;
