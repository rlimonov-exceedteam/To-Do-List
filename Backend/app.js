const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();

const apiRoutes = require('./src/modules/routes/routes');

const url = "mongodb+srv://romanphilimon95:695v89eqbhh4hy9FTK2S@to-do-list.ebsb2.mongodb.net/To-Do-list?retryWrites=true&w=majority";
mongoose.connect(url, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                      });

app.use(bodyParser.json());
app.use(cors());
app.use("/", apiRoutes);


app.listen(8000, () => {
  console.log('App listening');
});