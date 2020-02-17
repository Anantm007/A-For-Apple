const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


app.set('view engine', 'ejs');

//app.use(express.static("views"));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://admin:admin@cluster0-nbxxl.mongodb.net/hackvsit",{useNewUrlParser: true});
// mongoose.connect("mongodb+srv://admin:admin@cluster0-nbxxl.mongodb.net/test?retrywrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})

app.use('/',require('./routes/index'));


app.listen(process.env.PORT || 5000, function(){
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
