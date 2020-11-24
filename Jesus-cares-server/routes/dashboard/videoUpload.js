const express = require('express');
const db = require('./db');
const video = express.Router();
const uuid = require('uuid').v1;


// video.use(fileUpload())

video.post('/video_upload', (req, res)=>{
    const video = req.files.video;
    if(video !== null){
        const {header, content} = req.body;
        const genName = uuid();
        const videoType = video.mimetype.split('/')[1];
        const date = new Date().toString();
        const document = req.files.document;
        const documentType = document !== undefined ? document.mimetype.split('/')[1] : undefined;

        //async storage of document
        const storeDocument = async ()=>{
            document.mv(`${__dirname}/../../uploads/docs/${genName}.${documentType}`, (err)=>{
                if(err)throw err;
                console.log('document stored')
            })
        }
        //ends here*****
        res.status(200).send();
        document !== undefined && storeDocument();
        video.mv(`${__dirname}/../../uploads/videos/${genName}.${videoType}`, async (err)=>{
            if(err)throw err;
            console.log('moved..')
            //insert names and content to db;
            const withDoc = {
                sql: `insert into video_upload (heading, content, video_name, document_name, date) values (?,?,?,?,?)`,
                values: [header, content, `${genName}.${videoType}`,`${genName}.${documentType}`, new Date().toString() ]
            }
            const withoutDoc = {
                sql: `insert into video_upload (heading, content, video_name, date) values (?,?,?,?)`,
                values: [header, content, `${genName}.${videoType}`, new Date().toString() ]
            }
            const sql = document !== undefined ? withDoc.sql : withoutDoc.sql;
            const value = document !== undefined ? withDoc.values : withoutDoc.values;


            db.query(sql, value, (err, result)=>{
                if(err)throw err;
                console.log('pushed to database');
            })
        })
    }
})

module.exports = video;