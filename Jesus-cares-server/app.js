const express = require('express');
const cors = require('cors');
// const db = require('./routes/dashboard/db');
const blogPost = require('./routes/dashboard/blogPost')
const fileUpload = require('express-fileupload');
const video = require('./routes/dashboard/videoUpload');
const getPosts = require('./routes/dashboard/getPosts');
const auth = require('./routes/dashboard/auth');
const blog = require('./routes/front end/blog');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload());

app.set('view engine', 'ejs');
//begin

app.use('/', video);
app.use('/', blogPost);
app.use('/', getPosts);
app.use('/', auth);
app.use('/blog', blog)
//end
app.use(express.static('public'));

app.listen(4000, () => {
    console.log(`Server started on 4000`);
});