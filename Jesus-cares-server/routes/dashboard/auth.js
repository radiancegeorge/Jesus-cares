const express = require('express');
const auth = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db');
const nodeMailer = require('nodemailer');
const uuid = require('uuid').v1
const url = 'http://localhost:4000/reset'

auth.post('/auth', (req, res)=>{

    const sql = `select password from admin`;
    db.query(sql)
    .on('result', (hashedPassword)=>{
        hashedPassword = hashedPassword.password;
        bcrypt.compare(req.body.password, hashedPassword)
        .then(result=>{
            if(result){
                //do some token and send back
                res.status(200).send('some token');  
            }else{
                res.status(404).send();
            }
        })
    })

});


//req for password change

auth.get('/change_password', (req, res)=>{
    const transporter = nodeMailer.createTransport({
        host: process.env.email_host,
        port: process.env.email_port,
        secure: true,
        auth:{
            user: process.env.email_username,
            pass: process.env.email_password
        }
    });
    const token = uuid();
    const exp = Date.now() + (60 * 60 * 1000 + 0.2)
    // console.log(token)
    const sql = `update admin set mail_token = ?, exp = ? where email = ?`;
    db.query(sql, [token, new Date(exp).toISOString(), process.env.EMAIL ], async (err, result)=>{
        if(err)throw err;
        console.log('updated token and exp');
        const info = await transporter.sendMail({
            from: process.env.email_username,
            to: 'radiancegeorge@gmail.com',
            subject: 'Password Reset',
            html: `<div>
            <p>You have requested to change your password <br> 
            Please use the link below to continue</p>
            <a href = '${url}' style = 'display:block; width: fit-content; padding: 0.8rem 2rem; text-decoration: none;
            background-color: purple; color: white;'>Click Here</a>
            </div>`
        });
        console.log('message sent ::: ', info.messageId );
        res.send();
    })

})
// console.log(new Date(Date.now() + (60 * 60 * 1000 * 0.17)).toISOString() )

// const encryptDefault = ()=>{
//     bcrypt.hash(password, 10).then(hashed=>{
//         const query = `insert into admin (email, password) values (?, ?)`;
//         const email = process.env.EMAIL
//         db.query(query, [email, hashed], (err, result)=>{
//             if(err)throw err;
//             console.log('inserted')
//         })
//     })
// }
// encryptDefault()


// const create =()=>{
//     const sql = `create table admin (id int auto_increment primary key, email varchar(100), password varchar(255), mail_token varchar(255), exp varchar(300) )`
//     db.query(sql, (err, result)=>{
//         if(err)throw err;
//         console.log('table created')
//     })
// } 
// create()
module.exports = auth;