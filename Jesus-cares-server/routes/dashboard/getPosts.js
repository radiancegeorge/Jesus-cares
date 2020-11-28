const express = require('express');
const db = require('./db');
const getPosts = express.Router();


getPosts.get('/get_recent', (req, res)=>{
    const recentPosts = []
    const sql= `select id, heading, date from blog_post order by id desc limit 10`;
    db.query(sql, (err, result)=>{
        if(err)throw err;
        recentPosts.push(result);
        const sql = `select id, heading, date from video_upload order by id desc limit 10`;
        db.query(sql, (err, result)=>{
            if(err)throw err;
            recentPosts.push(result);
            res.status(200).send(recentPosts);
        })
    })
})

getPosts.post('/get_recent', (req, res)=>{
    console.log(req.body)
    const sql = `delete from ${req.body.name} where id = ?`;
    db.query(sql, req.body.id, (err, result)=>{
        if(err)throw err;
        res.status(200).send();
    })
})

module.exports = getPosts;