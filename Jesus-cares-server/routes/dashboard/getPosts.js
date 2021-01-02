const express = require('express');
// const { get, post } = require('../front end/blog');
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


getPosts.post('/edit', (req, res)=>{
    const {id, type} = req.body;
    console.log(type)
    const sql = `select * from ${type} where id = ?`;
    db.query(sql, id).on('result', result=>{
        result.type = type
        res.send(result);
    });
});

//update

getPosts.post('/update_post', (req, res)=>{
    const {type, content, header, id} = req.body;
    const sql = `update ${type} set heading = ?, content = ? where id = ? `;
    db.query(sql, [header, content, id], (err, result)=>{
        if(err){
            console.log(err)
        }else{
            res.status(200).send();
        }
    })
})
module.exports = getPosts;