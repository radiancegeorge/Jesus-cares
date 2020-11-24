const express = require('express');
const db = require('./db');
const blogPost = express.Router();
const uuid = require('uuid').v1;

blogPost.post('/blog_post', (req, res)=>{
    console.log(req.body)
    console.log(req.files)
    const {coverPhoto} = req.files;
    const imageType = coverPhoto.mimetype.split('/')[1];
    const imageName = `${uuid()}.${imageType}`
    const content = req.body.content;
    const author =  req.body.author;
    const header = req.body.header;
    const sql = `insert into blog_post (heading, content, author, date, image_name) values (?,?,?,?,?)`;
    db.query(sql, [header, content, author, new Date().toString(), imageName], (err, result)=>{
        if(err)throw err;
        console.log('inserted..');
        coverPhoto.mv(`${__dirname}/../../uploads/coverPhotos/${imageName}`, (err)=>{
            if(err)throw err;
            else console.log('image uploaded')
        })
        res.status(200).send();
    })
})
// console.log(new Date().toString())




module.exports = blogPost;