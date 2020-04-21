const express = require('express');
const routes = require('./routes/api');

const mongoose = require('mongoose');

var cors = require('cors');

const app = express();

app.use(cors());

// connect to mongodb
//mongoose.connect('mongodb://localhost/DSAssignment');
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://127.0.0.1:27017/DSAssignment", { useUnifiedTopology: true   , useFindAndModify: false});


app.use(express.json());  //  useNewUrlParser: true, useFindAndModify: false

app.use(express.urlencoded({extended:true}));

app.use('/',routes);


app.listen(4000,function(){

    console.log('now listening for requests');
});

