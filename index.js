var express = require("express");
var app = express();
var mongoose = require("mongoose");
var request = require("request");
const _ = require('underscore');
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
//const uri = 'mongodb://localhost:27017';
// Connection URL
const uri = process.env.goodgirl;
//const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//const client = new MongoClient(url);


const dbName = 'universe';
var ObjectId = require('mongodb').ObjectID;
const mongoDB = require('mongodb');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//mongoose.connect('mongodb://localhost:27017/MrCPU');
const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://MrCPU:mrcpu1234@cluster0.tglcx.mongodb.net/MrCPU?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("universe").collection("coll");
  // perform actions on the collection object
  //client.close();
});

var topicSchema =new mongoose.Schema({
    name : String,
	city : String,
    category : String,
    courses : [],
    website : String
});


var Details = mongoose.model("coll",topicSchema);

app.get("/",(req,res)=>{
    res.render('home');
})

app.get('/searchclg/all',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('coll');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('Allcolleges',{'top':docs})
    });
})

app.get('/colleges/:id',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('coll');
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

app.get('/searchunivs/all',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('univs');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('Allunivs',{'top':docs})
    });
})

app.get('/univs/:id',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('univs');
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

app.get('/find',(req,res)=>{
    res.render('sels');
})

app.get('/clgcity',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('coll');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('citysearchclg',{'top':docs})
    });
})

app.get('/univcity',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('univs');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('citysearchuniv',{'top':docs})
    });
})

app.get('/searchclg/:id',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('coll');
    var id = req.params.id;

    collection.find({city : id}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('Allcolleges',{'top':docs})
    });
})

app.get('/searchuniv/:id',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('univs');
    var id = req.params.id;

    collection.find({city : id}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('Allunivs',{'top':docs})
    });
})

app.get("*",function(req,res){
    res.send("some thing went wrong");
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Hey boi i'm waiting come!");
})
