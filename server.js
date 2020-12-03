var express = require('express')
var app= express()
var fs = require('fs')
var session = require('express-session');


const engines = require('consolidate');
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({secret: 'yoursecrete',saveUninitialized: true,resave: true}));

app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/doLogin',(req,res)=>{
    let nameF = req.body.txtName;
    let passwordF= req.body.txtPassword;
    var userJson = readDataFromFile();
    let indexToFind =-1;
    for (let index = 0; index < userJson.length; index++) {
        const userFile = userJson[index];
        if(nameF== userFile.name && passwordF == userFile.password){
            indexToFind =  index;
            break;
        }
    }
    if(indexToFind != -1){
        req.session.user = userJson[indexToFind].name;
        req.session.role = userJson[indexToFind].role;
        res.render('index',{user:userJson[indexToFind]})
    }else{
        res.end('Login failed!')
    }
})
app.get('/adminPage',(req,res)=>{
    let name = req.session.name;
    let role = req.session.role;
    if(role == 'admin'){
        res.end("Hello Admin!")
    }else{
        res.end("Only admin can access this page!")
    }
})
var fileName = 'user.txt';
function readDataFromFile() {
    let fileContent = fs.readFileSync(fileName, "utf8");
    let userText = fileContent.split('/');
    //remove the first because it's empty
    userText.shift();
    let userJson = [];
    userText.forEach(user => {
        let eachU = {
            'name': user.split(':')[0],
            'password': user.split(':')[1],
            'role' : user.split(':')[2]
        };
        userJson.push(eachU);
    });
    return userJson;
}
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log('server is running!')
