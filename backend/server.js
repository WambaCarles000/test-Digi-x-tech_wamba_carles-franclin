const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require("cors");

// COnnexion to database

connectDB();

//Instantiation of application
const app =  express();

// Middlewares pour traiter les donnees json entrees dans la requete 

app.use(express.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'controllers/public')));
app.use(cookieParser());
//Middleware for handling cors policy
// app.use(cors());

//OPTION 2: personalizing with more control
app.use(cors(
  {

    origin:'http://locahost:5000',
    methods:['POST','GET','PUT','DELETE'],
    allowedHeaders:['content-type']
   
    
    }
));


app.use(session({
  secret: 'votre_secret', // 
  resave: false,
  saveUninitialized: false
}));

//Home//Roads's setting
app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, './controllers/public', 'register.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, './controllers/public', 'index.html'));
});


// USER
app.use("/users",require("./routes/user.routes.js"));



//authentification
app.use("/auth",require("./routes/auth.routes.js"));

const PORT = process.env.PORT;


app.listen(PORT, (err) => {
    if (err) {
      console.error(`Error when loading server : ${err}`);
    } else {
      console.log(`Server running on port ${PORT}`);
    }
  });
  

