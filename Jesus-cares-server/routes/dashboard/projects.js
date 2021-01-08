const express = require('express');
const projects = express.Router();
const uuid = require('uuid').v1;
const db = require('./db');

projects.post('/projects_upload', (req, res)=>{
    const {content} = req.body;
    console.log(content)
    const image = req.files.image;
    const newName = uuid() + '.jpg';
    image.mv(`${__dirname}/../../public/uploads/coverPhotos/${newName}`, (err, result)=>{
        if(err) throw err;
        const sql = `insert into projects (name, content, date) values (?,?,?)`;
        db.query(sql, [newName, content, new Date()], async (err)=>{
            if(err) throw err;
            console.log('added project file name to db');
            res.status(200).send();
        })
        // console.log(result);
    })
})

// console.log(new Date())

module.exports = projects