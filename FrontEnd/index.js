const express = require("express");
const { config } = require("dotenv");
config({ path: "./config.env" });
require("./connection");

const userRouter = require("./routers/user");
const codeRouter = require("./routers/code");
const meetingRouter = require("./routers/meeting");
const messageRouter = require("./routers/message");
const teamRouter = require("./routers/team");
const bodyParser = require("body-parser");
const passport = require("./middleware/auth");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: "GET,POST,PUT,DELETE", // Specify allowed methods
    allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
    credentials: true, // Enable cookies and credentials if needed
  })
)

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello From Server...!");
});

app.use(passport.initialize());

app.use("/users", userRouter);
app.use("/code", codeRouter);
app.use("/meeting", meetingRouter);
app.use("/message", messageRouter);
app.use("/team", teamRouter);

app.listen(process.env.PORT, () => {
  console.log(`The Server is Started at http://localhost:${process.env.PORT}`);
});


