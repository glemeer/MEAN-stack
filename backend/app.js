const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const postroutes = require('./routes/posts');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGODB_ATLAS_USERNAME}:${process.env.MONGODB_ATLAS_PASSWORD}@mean-stack.t40qorj.mongodb.net/node-angular-database?retryWrites=true&w=majority&appName=MEAN-Stack`)
.then(() => {
  console.log("Connected to database");
})
.catch(() => {
  console.log("Connection failed");
})

app.use(bodyparser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use('/api/posts', postroutes);

module.exports = app;