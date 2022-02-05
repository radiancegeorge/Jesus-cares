const express = require("express");
const nodeMailer = require("nodemailer");
const { projects: db } = require("../../models");
const limit = 8;
const projects = express.Router();

projects.get("/projects/:project", (req, res) => {
  let { project } = req.params;
  console.log(project);
  let data = project;
  if (project.includes("_")) data = data.replace("_", " ");

  res.render(project, { project: data });
});

projects.get("/contact", (req, res) => {
  const data = {};
  res.render("contact", { data });
});
projects.post("/contact", async (req, res) => {
  data = {};
  const { name, email, subject, message, phone, address } = req.body;
  if (
    name.trim() !== "" &&
    email.trim() !== "" &&
    subject.trim() !== "" &&
    message.trim() !== ""
  ) {
    //send message
    const transporter = nodeMailer.createTransport({
      host: process.env.email_host,
      port: process.env.email_port,
      secure: true,
      auth: {
        user: process.env.contact_username,
        pass: process.env.contact_password,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.contact_username,
      to: process.env.EMAIL,
      subject: subject,
      text: `
                Name: ${name}
                Email: ${email}
            
                Message: ${message}
            `,
    });
    console.log("message sent ::: ", info.messageId);
    data.success = "Email sent.";
    res.render("mail success", { data });
  } else {
    data.error = "Input fields cannot be left empty!";
    res.render("contact", { data });
  }
});

projects.get("/our_projects/:num?", (req, res) => {
  let { num } = req.params;
  console.log(num);
  num === undefined && (num = 1);
  const query = `select * from projects`;

  db.findAll({ raw: true })
    .then((result) => {
      const page = Math.ceil(result.length / limit);
      const data = {};
      if (page <= 1) {
        data.data = result;
        res.render("our_projects", { data });
      } else {
        const max = num * limit;
        const min = max - limit;
        const toRender = result.slice(min, max);
        data.totalLength = result.length;
        data.data = toRender;
        data.page = page;
        data.currentPage = num;
        console.log(data.currentPage);
        res.render("our_projects", { data });
      }
    })
    .catch((err) => {
      throw err;
    });
});
// console.log(Math.ceil(1.125))
module.exports = projects;
