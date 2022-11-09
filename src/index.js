const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const app = express();

app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://IndrashishRoy:windows10@radon-cohort-cluster.gtmdsvp.mongodb.net/Mock-Assignment-I-Roy-DB?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));
app.use("/", route);
app.listen(3000,()=>console.log("Express App listening on port 3000"));
