const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const session = require('express-session');

const bcrypt = require("bcrypt");
// const nodemon = require("nodemon");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const app = express()

// testing this
// app.set("trust proxy", 1);
app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
}));
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  key: "userId",
  secret: "isThisProblem",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60,
    sameSite: "lax",
    // secure: tru,
  }

}))

// console.log(session);

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]
  if (!token) {
    res.send({ auth: false, message: "No token" })
  } else {
    jwt.verify(token, "jSecret", (err, decoded) => {
      if (err) res.send({ auth: false, message: "Authentication failed" });
      else {
        req.userId = decoded.id;
        next();
      }
    })
  }
}

app.get("/api/isUserAuth", verifyJWT, (req, res) => {
  res.send({ auth: true, message: "Authentication success" });
})


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "shopping_app",
  port: 3305,
})


app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM user_info"
  db.query(sqlSelect, (err, result) => {

    //Changes all dates to local 
    for (let i = 0; i < result.length; i++) {
      result[i].date_of_birth = result[i].date_of_birth.toLocaleDateString();
    }
    res.send(result);
  });
})

app.delete("/api/delete/:last_name/:date_of_birth", (req, res) => {
  const last_name = req.params.last_name;
  const date_of_birth = (req.params.date_of_birth).split("-").reverse().join("/");
  console.log(date_of_birth);

  // console.log(lname);
  const sqlDelete = "DELETE FROM user_info WHERE last_name = ? AND date_of_birth = ?";
  db.query(sqlDelete, [last_name, date_of_birth], (err, result) => {
    if (err) console.log(err);
    else res.send(result.status)
  });
})

app.put("/api/update", (req, res) => {
  const last_name = req.body.last_name;
  const date_of_birth = (req.body.date_of_birth).split("/").reverse().join("");
  const tableToUpdate = req.body.tableName;
  const newEntry = req.body.newEntry;
  let sqlUpdate = "";

  if (tableToUpdate == "first_name") sqlUpdate = "UPDATE user_info SET first_name = ?  WHERE last_name = ? AND date_of_birth = ?"
  else if (tableToUpdate == "last_name") sqlUpdate = "UPDATE user_info SET last_name = ?  WHERE last_name = ? AND date_of_birth = ?"
  else if (tableToUpdate == "date_of_birth") sqlUpdate = "UPDATE user_info SET date_of_birth = ?  WHERE last_name = ? AND date_of_birth = ?"
  else if (tableToUpdate == "email") sqlUpdate = "UPDATE user_info SET email = ?  WHERE last_name = ? AND date_of_birth = ?"
  else if (tableToUpdate == "mobile") sqlUpdate = "UPDATE user_info SET mobile = ?  WHERE last_name = ? AND date_of_birth = ?"

  const update = sqlUpdate;
  console.log(last_name + " " + date_of_birth + " " + newEntry);
  console.log(sqlUpdate);
  db.query(update, [newEntry, last_name, date_of_birth], (err, result) => {
    if (!err) res.send(result.status)

  });
})

//Register
app.post("/api/register", (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {

    const sqlGet = "SELECT * FROM users WHERE email = ?";
    db.query(sqlGet, [email], (err, result) => {
      if (result.length > 0) {
        //If email found
        res.send("userExist");

      } else if (err == null) {
        const sqlInsert = "INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?)"
        db.query(sqlInsert, [first_name, last_name, email, hash], (error, result) => {
          if (result) res.send("success");
          // console.log("InsertError" + " " + error);
        });

      } else {
        res.send("connectionError");
      }
      // console.log("CheckError" + " " + err);
    });
  })



});

app.get("/api/login", (req, res) => {
  // req.session.destroy();
  console.log("testing")
  console.log(req.session)
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
    // console.log("Refresh: Exist ");
    // console.log(req.session);
  } else {
    res.send({ loggedIn: false });
    // console.log("Refresh: Failed");
    // console.log(req.session);
  }
})

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sqlGet = "Select * FROM users WHERE email = ?;";
  db.query(sqlGet, email, (error, result) => {
    if (error) {
      res.send({ err: err });
    }

    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (response) {
          const id = result[0].user_id;
          const token = jwt.sign({ id }, "jSecret", {
            expiresIn: 100,
          })

          delete result[0].user_id;
          delete result[0].password;

          req.session.user = result[0];
          console.log("Login: Sending session cookie");
          console.log(req.session.user);

          res.json({ auth: true, token: token, result: result[0] });
        } else res.json({ auth: false, message: "Wrong password/username" });
      })
    } else res.json({ auth: false, message: "Wrong password/username" });

  });
})


app.get("/api/products", (req, res) => {

  const sqlGet = "Select * FROM products;";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ message: "error" });
    } else {
      // console.log(result)
      res.send(result)
    }
  })
})

app.get("/api/productbyid/:product_id", (req, res) => {
  let productID = req.params.product_id

  const sqlGet = `Select * FROM products where product_id = ${productID} ;`;
  db.query(sqlGet, (error, result) => {
    if (error) {
      // console.log(error);
      res.send({ message: "error" });
    } else {
      // console.log(result)
      res.send(result)
    }
  })
})

app.get("/api/categories", (req, res) => {

  const sqlGet = "select * from products group by category;";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ message: "error" });
    } else {
      // console.log(result)
      res.send(result)
    }
  })
})

app.listen(3001, () => {
  console.log("Running on port 3001");

});