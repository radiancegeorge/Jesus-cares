const { request } = require('express');
const express = require('express');
const db = require('../dashboard/db');
const blog = express.Router();


blog.use((req, res, next)=>{
    let totalPost = 0;
    const sql = `select * from blog_post`;
    db.query(sql, (err, result)=>{
        if(err)throw err;
        totalPost += result.length;
        const sql = `select * from video_upload`;
        db.query(sql, (err, result)=>{
            if(err)throw err;
            totalPost += result.length;
            req.totalPost = totalPost;
            next()
        })
    })
})

blog.get('/', (req, res)=>{
    const {totalPost} = req;
    const promise = new Promise((resolve, reject)=>{
        const data = [];
        const latestPost = [];
        let sql = `select * from blog_post order by id desc limit 3`;
        db.query(sql).on('result', result=>{
            const trunc = result.content.split('</p>');
            // console.log(trunc)
            if(trunc.length > 1){
                const index = result.content.indexOf(trunc[1]);
                const content = result.content.substr(0,index -4)+'......</p>';
                result.content = content;
                // console.log(content)
                // console.log()
            }
            data.push(result);
            if(latestPost.length < 2){
                if(result.heading.length > 18){
                    const heading = result.heading.substr(0, 18) + '...';
                    result.heading = heading
                }
                latestPost.push(result)
            }
        }).on('end', end =>{
            sql = `select * from video_upload order by id desc limit 3`;
            console.log('first done')
            db.query(sql).on('result', result=>{
                const trunc = result.content.split('</p>');
                if(trunc.length > 1){
                    const index = result.content.indexOf(trunc[1]);
                    const content = result.content.substr(0,index - 4) + '.......</p>';
                    result.content = content;
                    // console.log()
                }
                data.push(result);
                if(latestPost.length < 4){
                    if(result.heading.length > 18){
                        const heading = result.heading.substr(0, 18) + '...';
                        result.heading = heading
                    }
                    latestPost.push(result)
                }
            }).on('end', end=>{
                console.log('second done');
                resolve({data, latestPost, totalPost});
            }).on('error', err=>{
                reject(err)
            })
        })
    });
    
    
    promise.then(result=>{
        const data = result.data;
        const latestPost = result.latestPost
        
        res.render('blog', {data, latestPost});
    })
})
// console.log(new Date().toString().split(' ')[1])

module.exports = blog;