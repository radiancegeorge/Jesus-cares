const express = require('express');
const cors = require('cors');
// const db = require('./routes/dashboard/db');
const blogPost = require('./routes/dashboard/blogPost')
const fileUpload = require('express-fileupload');
const video = require('./routes/dashboard/videoUpload')
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload());
//begin

app.use('/', video);
app.use('/', blogPost);
//end
app.listen(4000, () => {
    console.log(`Server started on 4000`);
});