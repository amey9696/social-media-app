const express = require('express');
require('dotenv').config();
const connection = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const app = express();
connection();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
app.use('/', router);
app.use('/', postRouter);
app.use('/', userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is running on port no ${PORT}`);
});