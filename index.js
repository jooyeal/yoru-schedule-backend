const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./routes/auth");
const taskRouter = require("./routes/tasks");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("DB connection success"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.listen(process.env.PORT || 8000, () => {
  console.log(`server is listening ${process.env.PORT || 8000}`);
});
