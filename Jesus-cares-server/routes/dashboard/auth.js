const express = require('express');
const auth = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db');
const nodeMailer = require('nodemailer');
const uuid = require('uuid').v1
const url = 'http://localhost:4000/reset/';
const dashboardUrl = 'http://localhost:3000'

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
        // console.log('updated token and exp');
        const info = await transporter.sendMail({
            from: process.env.email_username,
            to: process.env.EMAIL,
            subject: 'Password Reset',
            html: `<div>
            <p>You have requested to change your password <br> 
            Please use the link below to continue</p>
            <a href = '${url+token}' style = 'display:block; width: fit-content; padding: 1rem 2rem; text-decoration: none;
            background-color: purple; color: white;'>Click Here</a>
            </div>`
        });
        console.log('message sent ::: ', info.messageId );
        res.send();
    })

})

auth.get('/reset/:token', (req, res)=>{
    const {token} = req.params;
    if(token){
        const sql = `select mail_token from admin where mail_token = ?`;
        db.query(sql, token).on('result', (result)=>{
            // console.log(result)
            if(result.mail_token === token){
                // console.log('correct');
                let err;
                res.render('auth', {err});
            }else{
    
            }
        })
        .on('error', (err)=>{
            throw err;
        })
    }
    
})
auth.post('/reset', (req, res)=>{
    const {password, re_password} = req.body;
    if(password.trim() === '' || re_password.trim() === ''){
        //re render page saying cannot be empty
        let err = 'Password cannot be empty'
        res.render('auth', {err});
    }else if(password !== re_password){
        //re render saying not the same;
        let err = 'Password must be a match';
        res.render('auth', {err});
    }else if(password.length < 8){
        // re render page saying password must be longer than 8 characters
        let err = 'Password must be longer than 8 characters';
        res.render('auth', {err});
    }else{
        bcrypt.hash(password, 10).then(hashed=>{
            const sql = `update admin set password = ? where email = ?`;
            db.query(sql, [hashed, process.env.EMAIL], (err, result)=>{
                if(err)throw err;
                console.log('password changed')
                 res.redirect(dashboardUrl);
            })
        })
    }
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