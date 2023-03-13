const express = require("express");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const connection = require("./server");
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));
// app.use(express.json());
app.use(cors({
    origin: "*" ,
    credentials: true,
    optionSuccessStatus: 200
}));
// app.use(cors());
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
app.get("/api/user-list", (req, res) => {
  const sql = "SELECT * from users";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users from database: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(result);
  });
});
app.post("/api/user-form", (req, res) => {
  const { name, email, dob, phone } = req.body;
  const sql = "INSERT INTO users(name,email,dob,phone) VALUES (?,?,?,?)";
  const values = [name, email, dob, phone];
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Failed to save user data");
      return
    }
    res.json(results)    
  });
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
