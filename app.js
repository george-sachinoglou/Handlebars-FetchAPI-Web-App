const uuid = require('uuid');
const express = require('express');
const app = express();
var path = require('path');
var Carts = [];
var LoggedIn =[{username: 'George', sessionId:''},{username: 'John', sessionId:''}]

app.use(express.urlencoded({ extended: false}));

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?',(req,res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/category.html',(req,res) => {
  res.sendFile(path.join(__dirname, 'category.html'));
})

app.post("/login",(req,res) => {
  var username = req.body.username;
  var password = req.body.password;
  LS(username,password,res);
})

app.post("/buy",(req,res) => {
  var pid = req.body.pid;
  var ptitle = req.body.ptitle;
  var pcost = req.body.pcost;
  var username = req.body.username;
  var sessionId = req.body.sessionId;
  CIS(pid, ptitle, pcost, username, sessionId, res);
})

app.post("/updatecart",(req,res) => {
  var username = req.body.username;
  CSS(username, res);
})

app.listen(3500, () => {
  console.log("listening to port 3500");
})

async function LS(u, p, r){
    const MongoClient = require('mongodb').MongoClient;
    const uri = 'mongodb+srv://gfalcon:hQRAg51mRCIV4uWd@auebprojectjs.dojr5gk.mongodb.net/test?retryWrites=true&w=majority'
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    client.connect()
    .then(async() => { const collection = client.db("jsp2").collection("login");
      try{
        let query = {username: u, password: p};
        let result = await collection.find(query).toArray();
        if(result.length == 0){
          console.log("cant login")
          return r.send({status: "S404", sessionId: "please refresh"});
        }
        if (result[0].username == u && result[0].password == p){
          console.log("logged in")
          var myuuid = uuid.v4()
          for(var i in LoggedIn){
            if(LoggedIn[i].username == u){
              LoggedIn[i].sessionId = myuuid;
              console.log(LoggedIn[i])
              break;
            }
          }
          
          return r.send(JSON.stringify({status: "S200", sessionId: myuuid}));
        }
      }
      catch(err){
        console.log(err);
      }
    })
    .catch (err => {
        console.log(err)
    })
    }

async function CIS(pid, ptitle, pcost, username, sessionId, r){
  var exists = false;
  var correctlogin = false;
  for(var i in LoggedIn){
    if(LoggedIn[i].username == username && LoggedIn[i].sessionId == sessionId){
      correctlogin = true;
      break;
    }
  }
  if(!correctlogin){
    return r.send({msg: "Expired sessionId"})
  }
  var cartProduct = {}
  cartProduct.pid = pid;
  cartProduct.ptitle = ptitle;
  cartProduct.pcost = pcost;
  cartProduct.username = username;
  if(Carts.length != 0){
    for(var i in Carts){
      if(Carts[i].pid == cartProduct.pid && Carts[i].username == cartProduct.username){
        Carts[i].count++;
        console.log(Carts);
        exists = true;
        break;
      
     }
    }
  if(!exists){
    cartProduct.count = 1;
    Carts.push(cartProduct);
    console.log(Carts);
  }
  }else{
    cartProduct.count = 1;
    Carts.push(cartProduct);
    console.log(Carts);
  }
  
  return r.send({msg: "Added to cart"})
}

function CSS(username,r){
  let count = 0;
  for(var i in Carts){
    if(Carts[i].username == username){
      count += Carts[i].count;
   }
  }
  r.send({count: count})
}
