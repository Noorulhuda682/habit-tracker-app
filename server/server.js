var express = require("express");
const Users = require("./models/Users");
const app = express();

let cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();
const db = require("./models/db");

db.connection
  .once("open", () => {
    console.log("db connected");
  })
  .on("error", (error) => {
    console.log("Error =>", error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/', require('./routes/index.js'))


app.post("/signup", async (req, res) => {
  let { userName, email, password } = req.body;

  let checkUser = await Users.findOne({ email });
  if (checkUser) res.send({ status: "failed", message: "user already exists with this email" });
  
  var user = {
    userName,
    email,
    password,
  };
  const newUser = new Users(user);
    newUser.save()
    .then(() => {
      res.send({ status: "success", message: "User created Successfully" });
    })
    .catch((e) => {
      res.send({ status: "failed", message: e });
    });
});

app.post("/login", async (req, res) => {
  let { userName, password } = req.body;
  let user = await Users.findOne({ userName,password });
  console.log("USER", user);
  if (!user) {
    res.send({ status: "failed", message: "No user found" });
  }
  res.send({ status: "Success", data: user })
});

app.get("/", (req,res) => {
    res.send("This is Habit Tracker Server")
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is running...${port}`));
