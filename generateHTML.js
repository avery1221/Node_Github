const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const pdf = require('html-pdf');
var options = { format: 'Letter' }
const axios = require('axios');
const writeFileAsync = util.promisify(fs.writeFile);
const colors = {
  green: {
    wrapperBackground: "#E6E1C3",
    headerBackground: "#C1C72C",
    headerColor: "black",
    photoBorderColor: "#black"
  },
  blue: {
    wrapperBackground: "#5F64D3",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  },
  pink: {
    wrapperBackground: "#879CDF",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "#DE9967",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  }
};
function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?"
    },
   
    {
      type: "input",
      name: "color",
      message: "What is your favorite Color?"
    },
   
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username"
    },
    {
      type: "input",
      name: "linkedin",
      message: "Enter your LinkedIn URL."
    }
  ]);
}
function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
  <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
  <title>Document</title>
  <style>
  @page {
    margin: 0;
  }
 *,
 *::after,
 *::before {
 box-sizing: border-box;
 }
 html, body {
 padding: 0;
 margin: 0;
 }
 html, body, .wrapper {
 height: 100%;
 }
 .wrapper {
 background-color: ${colors[answers.color].wrapperBackground};
 padding-top: 70px;
 }
 .wrapper2 {
  background-color: ${colors[answers.color].wrapperBackground};
  padding-top: 100px;
  height: 270px;
  }
 body {
 background-color: white;
 -webkit-print-color-adjust: exact !important;
 font-family: 'Cabin', sans-serif;
 }
 main {
 background-color: #E9EDEE;
 height: auto;
 padding-top: 60px;
 }
 h1, h2, h3, h4, h5, h6 {
 font-family: 'BioRhyme', serif;
 margin: 0;
 }
 h1 {
 font-size: 3em;
 }
 h2 {
 font-size: 2.5em;
 }
 h3 {
 font-size: 2em;
 }
 h4 {
 font-size: 1.5em;
 }
 h5 {
 font-size: 1.3em;
 }
 h6 {
 font-size: 1.2em;
 }
 .photo-header {
 position: relative;
 margin: 0 auto;
 margin-bottom: -50px;
 display: flex;
 justify-content: center;
 flex-wrap: wrap;
 background-color: ${colors[answers.color].headerBackground};
 color: ${colors[answers.color].headerColor};
 padding: 10px;
 width: 95%;
 border-radius: 6px;
 padding-top: 170px;
 }
 img {
   position: absolute;
   left: 390px;
   bottom: 350px;
 }
 .photo-header img {
 width: 250px;
 height: 250px;
 border-radius: 50%;
 object-fit: cover;
 margin-top: -75px;
 border: 6px solid ${colors[answers.color].photoBorderColor};
 box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
 }
 .photo-header h1, .photo-header h2 {
 width: 100%;
 text-align: center;
 }
 .photo-header h1 {
 margin-top: 10px;
 }
 .links-nav {
 width: 100%;
 text-align: center;
 padding: 3px 0;
 font-size: 1.1em;
 }
 .nav-link {
 display: inline-block;
 margin: 5px 10px;
 }
 .workExp-date {
 font-style: italic;
 font-size: .7em;
 text-align: right;
 margin-top: 10px;
 }
 .container {
 }
 .row {
   display: flex;
   flex-wrap: wrap;
   justify-content: space-between;
   margin-top: 20px;
   margin-bottom: 20px;
 }
 .card {
   padding: 20px;
   border-radius: 6px;
   background-color: ${colors[answers.color].headerBackground};
   color: ${colors[answers.color].headerColor};
   margin: 20px;
   width: 36%;
   height: 120px;
 }
 .col {
 flex: 1;
 text-align: center;
 }
 .smallHeader {
   text-align: center;
 }
 .big {
  font-size: 2.0em;
 }
 span {
   line-spacing: 0.5px;
   margin: 0px;
 }
 a, a:hover {
 text-decoration: none;
 color: inherit;
 font-weight: bold;
 }
 @media print { 
  body { 
    zoom: .75; 
  } 
 }
</style>
  </head>
<body>
  <div class="container">
  <div class="wrapper">
  <div class="photo-header">
    <img src="${answers.gitPic}"/>
    <h1> Hi! </h1>
    <h1 class="name">My name is ${answers.name}</h1>
    <h3 class="from smallHeader">Github: ${answers.gitURL}.</h3>
    <span class="nav-link links-nav">
      <a href="${answers.gitURL}"><p class="links-nav">GitHub</p></a>
      <a href="${answers.linkedin}"><p class="links-nav">LinkedIn</p></a>
    </span>
  </div>
  </div>
  </div>
  <main>
  <div class="row">
  <div class="col">
    <p class="smallHeader big">${answers.bio}</p>
    <div class="card nav-link big">Public Repositories <br> ${answers.git.public_repos} </div>
    <div class="card nav-link big">followers <br> ${answers.git.followers} </div>
    <div class="card nav-link big">Hireable? <br> ${answers.git.hireable} </div>
    <div class="card nav-link big">following <br> ${answers.git.following} </div>
  </div>
  </div><br><br>
  </main>
  <div class="wrapper2">
  </div>
  </div>
</body>
</html>`;
}
promptUser()
  .then(function(answers) {
    return axios.get(`https://api.github.com/users/${answers.github}`)
      .then(function (res) {
        console.log(res.data);
        answers.gitPic = res.data.avatar_url
        answers.gitURL = res.data.html_url
        answers.git = res.data
        answers.locations = res.data.location
        answers.bio = res.data.bio
        return generateHTML(answers);
        // writeFileAsync("index.html", html);
        // var html = fs.readFileSync('./index.html', 'utf8');
      })
  })
  .then(function (html) {
    return new Promise((resolve, reject)=>{
      pdf.create(html.toString(), options).toFile('./profile.pdf', function(err, res) {
        if (err) return reject(err);
        resolve(res); // { filename: '/app/businesscard.pdf' }
      })
    });    
  }).then(console.log)
  .catch(function(err) {
    console.log(err);
  });