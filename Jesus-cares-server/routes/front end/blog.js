const { request } = require('express');
const express = require('express');
const { end } = require('../dashboard/db');
const db = require('../dashboard/db');
const blog = express.Router();


blog.use((req, res, next)=>{
    let totalPost = [];
    const sql = `select * from blog_post`;
    db.query(sql, (err, result)=>{
        if(err)throw err;
        totalPost.push(result.length);
        const sql = `select * from video_upload`;
        db.query(sql, (err, result)=>{
            if(err)throw err;
            totalPost.push(result.length);
            req.totalPost = totalPost;
            next()
        })
    })
})

blog.get('/', (req, res)=>{
    const {totalPost} = req;
    const currentPage = 1
    const promise = new Promise((resolve, reject)=>{
        const data = [];
        const latestPost = [];
        let sql = `select * from blog_post order by id desc limit 3`;
        db.query(sql).on('result', result=>{
            const trunc = result.content.split('</p>');
            if(trunc.length > 1){
                const index = result.content.indexOf(trunc[1]);
                const content = result.content.substr(0,index -4)+'......</p>';
                result.content = content;
            }
            data.push(result);
            if(latestPost.length < 2){
                
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
        const {data, latestPost, totalPost} = result;

        
        res.render('blog', {data, latestPost, totalPost, currentPage});
    })
})



//to see next and previous posts::

blog.get('/posts/:num', (req, res)=>{
    const {num} = req.params;
    const promise = new Promise((resolve, reject)=>{
        const data = [];
        const latestPost = [];
        const {totalPost} = req;
        const startingPoint = num * 3 - 3;
        const endingPoint = num * 3
        const sql = `select * from blog_post order by id desc`;
        db.query(sql, (err, result)=>{
            if(err)throw err;
            //push latest post
           
                if(result.length > 0){
                    result.forEach(item=>{
                        // console.log(latestPost.length)
                        if(latestPost.length < 3) latestPost.push(item);
                    })
                }
                
           
            //ends here
            if(result.length > (num - 1) * 3){
                result = result.slice(startingPoint, endingPoint);
                if(result.length > 0){
                    result.forEach(item=>{
                        const trunc = item.content.split('</p>');
                        if(trunc.length > 1){
                            const index = item.content.indexOf(trunc[1]);
                            const content = item.content.substr(0,index -4)+'......</p>';
                            item.content = content;
                        }
            
                        data.push(item)
                    });
                }
                
            }
            const sql = `select * from video_upload order by id desc`;
            db.query(sql, (err, result)=>{
                if(err)throw err;
                //push latest vid up
                
                    if(result.length > 0){
                        result.forEach(item=>{
                            if(latestPost.length <= 6) latestPost.push(item);
                            
                        })
                    }
                
                //ends here
                if(result.length > (num - 1) * 3){
                    result = result.slice(startingPoint, endingPoint);
                    if(result.length > 0){
                        result.forEach(item=>{
                            const trunc = item.content.split('</p>');
                            if(trunc.length > 1){
                                const index = item.content.indexOf(trunc[1]);
                                const content = item.content.substr(0,index -4)+'......</p>';
                                item.content = content;
                            }
            
                            data.push(item)
                        });
                    }
                    
                }
                 resolve({data, totalPost, latestPost})  
            })
            
        })
    });
    promise.then(result =>{
        // console.log(result)
        const {latestPost, totalPost, data} = result;
        res.render('blog', {latestPost, totalPost, data, currentPage: num});
    })
})








// console.log(new Date().toString().split(' ')[1])

module.exports = blog;