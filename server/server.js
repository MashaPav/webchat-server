const express = require("express");
const mongoose = require("mongoose"); // a package for communicating with MongoDB
const cookieParser = require("cookie-parser");
const cors = require("cors");

const Users = require("./users.js");
const Messages = require("./messages.js")
const Chats = require("./chats.js")

// Initializing Server
const app = express(); // express is a function that returns an instance
app.use(express.json()); // this makes it easier to process JSON requests

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(cookieParser()); //  Middleware that enable working with cookies

app.listen(process.env.PORT || 8080, () => console.log("Our server is listening....")); // Now we're live!

// connecting to MongoDB
const mongoURL =
  "mongodb+srv://LinMengShi101:LinMengShi@cluster0.0musx.mongodb.net/Web-Chat"; // connection string

mongoose.set("useUnifiedTopology", true); // use Mongo's new connection drivers

mongoose
  .connect(mongoURL, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.error(err));

// *********
// Users
// *********
app.get("/", (req, res) => {
  res.write("<h1>Welcome to the NetApp server!</h1>");
  res.end();
});

app.get("/api/users", Users.getAll);

app.get("/api/users/:id", Users.getById);

app.get("/api/me", Users.getLoggedUserByCookie);

app.post("/api/users", Users.createNew);

app.put("/api/users/:id", Users.update);

app.delete("/api/users/:id", Users.delete);

// *********
// Messages
// *********

app.get("/api/messages", Messages.getAll);

app.get("/api/messages/:id", Messages.getById);

app.put("/api/messages/:id", Messages.update);

app.delete("/api/messages/:id", Messages.delete);

// *********
// Chats
// *********

app.get("/api/chats", Chats.getAll);

// get chat by id
app.get("/api/chats/:id", Chats.getById);

// get all messages from a specific chat
app.get("/api/chats/:id/messages", Messages.getByChat);

// get all chats for a specific user
//app.get("/api/contacts/:id", Chats.getContacts);

// create a new chat
app.post("/api/chats", Chats.createNew);

// create a new message in a specific chat
app.post("/api/chats/:id/messages", Messages.createNew);