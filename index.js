const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const cors = require("cors");

// LOCAL DB
// mongoose.connect("mongodb://127.0.0.1:27017/b5b6");

// ONLINE DB
mongoose.connect(
    "mongodb+srv://quanshenjoelmichael21s:joelmichael94@jms-fs.ofi9vbd.mongodb.net/Blog?retryWrites=true&w=majority"
);

app.use(express.json());
app.use(cors());

app.use("/users", require("./api/users"));
app.use("/posts", require("./api/posts"));
app.use("/likes", require("./api/likes"));
app.use("/comments", require("./api/comments"));

app.listen(PORT, () => console.log("Server is swimming on PORT " + PORT));
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));
