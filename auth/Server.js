const express = require('express');
const fs = require("fs");
const app = express();         //instance
const db = require("./models/db");
const UserModel = require("./models/User");
const uuid = require("uuid");     //generate unique identifiers (UUIDs)
const session = require('express-session');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


app.set("view engine", "ejs");
app.use(session({
    secret: 'dont know',
    resave: false,
    saveUninitialized: true,
}));
//middleware, automatically parses the JSON data sent in the request body and attaches it to the req.body object
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //without this, getting form data is undefined
app.use(upload.single("image"));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + "/"));

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.get("/", function (req, res) {
    if (!req.session.isLoggedIn) {         //session in get request
        res.redirect("login");
        return;
    }
    res.render("index", { username: req.session.username, image: req.session.image });
});
app.get("/contact", function (req, res) {
    res.render("contact", { username: req.session.username, image: req.session.image });
});
app.get("/about", function (req, res) {
    res.render("about", { username: req.session.username, image: req.session.image });
});
app.get("/Script.js", function (req, res) {
    res.sendFile(__dirname + "/Script.js");
});
app.get("/login", function (req, res) {
    //res.sendFile(__dirname + "/public/login.html");
    res.render("login", { error: null });
});
app.get("/signup", function (req, res) {
    //res.render("signup",{successmsg: null});
    res.render("signup");
});


app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const image = req.file;
    const imagePath = `/uploads/${image.filename}`;
    console.log(username, password, email, image, imagePath);

    const userDetails = {
        username,
        password,
        email,
        imagePath, 
    }
    //for db
    UserModel.create(userDetails)
    .then(function (){
        res.redirect("/login");
    })
    .catch(function(err){
        res.render("signup",{error: err});
    });
    //for file  
    // saveUserData(userDetails, function (err) {
    //     if (err) {
    //         res.status(500).send("error");
    //         return;
    //     }
    //     res.status(200).json("success");   
    // });
});
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);     //data when user login
    
    //for db
    UserModel.findOne({username: username, password: password})
    .then(function(user){
        if(user){
            req.session.isLoggedIn = true;
            req.session.username = username;
            req.session.image = user.imagePath;
            res.redirect("/");
            return;
        }
        res.render("login", { error: "invalid username or password" });
    }).catch(function(err){
        res.render("login", { error: "something wrong" });
    });
    //for file
    // readUsers(function (err, data) {
    //     if (err) {
    //         res.status(500).send("error");
    //         return;
    //     }
    //     const user = data.find((user) => user.username === username && user.password === password);
    //     if (user) {
    //         req.session.isLoggedIn = true;
    //         //res.render("index", { username: user.username });
    //         req.session.username = username;
    //         req.session.image = user.imagePath;
    //         res.status(200).redirect("/");
    //     }
    //     else if (data.some((user) => user.username === username && user.password != password)) {
    //         //res.status(401).json({ error: "Incorrect password." });
    //         res.render("login", { error: "invalid password" })
    //     }
    //     else {
    //         res.render("login", { error: "plz register" });
    //     }
    // });
});


db.init().then(function() {
    console.log("db connected");

    app.listen(4000, function () {
        console.log("Server on port 4000");
    });
}).catch(function (err){
    console.log(err);
});



//when using file

// function saveUserData(userDetails, callback) {
//     readUsers(function (err, data) {
//         if (err) {
//             callback(err);
//             return;
//         }
//         const userExist = data.find((user) => user.email === userDetails.email);
//         if (userExist) {
//             callback("user already exist");
//             return;
//         }
//         data.push(userDetails);
//         fs.writeFile("userdata.json", JSON.stringify(data, null, 2), function (err) {
//             if (err) {
//                 callback(err);
//                 return;
//             } else {
//                 callback(null);
//             }
//         });

//     });
// }

// function readUsers(callback) {
//     fs.readFile("userdata.json", "utf-8", function (err, data) {
//         if (err) {
//             callback(err);
//             return;
//         }
//         if (data.length === 0) {
//             data = "[]";                // represents an empty JSON array
//         }
//         try {
//             data = JSON.parse(data);    //convert string to object
//             callback(null, data);
//         }
//         catch (err) {
//             callback(err);
//         }
//     });
// }

app.get("/logout", function (req, res) {
    req.session.isLoggedIn = false;
    res.render("/");
});
