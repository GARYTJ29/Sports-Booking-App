const express = require('express');
const cors = require("cors");
const app = express();
require('dotenv').config();

const dbConfig = require("./config/dbConfig");
const userRoute = require("./routes/userRoute");

app.use(express.json());
app.use(cors());
app.use('/api/user', userRoute);
const port = process.env.PORT || 5000;


app.listen(port, () => console.log(`Node Server started at ${port}`));