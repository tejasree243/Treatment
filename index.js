var express = require("express");
var app = express();
var mongoose = require("mongoose");
var request = require("request");
const _ = require('underscore');
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
//const uri = 'mongodb://localhost:27017';
// Connection URL
const uri = "mongodb+srv://teja:kaush46@treatment.lmrp3ck.mongodb.net/test";
//const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//const client = new MongoClient(url);


const dbName = 'Hos';
var ObjectId = require('mongodb').ObjectID;
const mongoDB = require('mongodb');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("universe").collection("coll");
  // perform actions on the collection object
  //client.close();
});

var topicSchema =new mongoose.Schema({
    name : String,
	location : String,
    state : String,
    website : String,
    speciality : []
});


var Details = mongoose.model("Details",topicSchema);

app.get("/",(req,res)=>{
    res.render('home');
})

app.get('/explore',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('details');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('explore',{'top':docs})
    });
})

app.get('/search/:id', (req, res)=>{
    const db = client.db(dbName);
    const collection = db.collection('details');
    var id = req.params.id;
    var hex = /[0-9A-Fa-f]{6}/g;
    id = (hex.test(id))? ObjectId(id) : id;

    collection.findOne({_id : new mongoDB.ObjectID(id)})
    .then(found =>{
        if(!found){
            return res.status(404).end();
        }
        res.render('alldet',{data: found});
    })
    .catch(err => console.log(err));
})

app.get('/search',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('details');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('searchbyname',{'top':docs})
    });
})

app.get('/about',(req,res)=>{
    res.render('about');
})

app.get("*",function(req,res){
    res.send("some thing went wrong");
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Hey boi i'm waiting come!");
})