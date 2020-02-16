const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser =  require('body-parser');

app.set('view engine', 'ejs');

//app.use(express.static("views"));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://rajat-admin:rajat1999@cluster0-nbxxl.mongodb.net/hackvsit",{useNewUrlParser: true, useUnifiedTopology: true})
.then( () => console.log("Database Connected..."));

app.use('/',require('./routes/index'));


app.listen(process.env.PORT || 3000, function(){
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
