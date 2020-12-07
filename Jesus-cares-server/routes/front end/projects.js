const express = require('express');


const projects = express.Router();


projects.get('/projects/:project', (req, res)=>{
    let {project} = req.params;
    console.log(project)
    let data = project;
    if(project.includes('_')) data = data.replace('_', ' ')

    res.render(project, {project: data});
});


module.exports = projects;