

/*var app = express();
app.listen(8080);*/
const express = require('express');
const app = express();
app.use(express.static("public")); //auto access /public in client
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT||3000);

//connect to server - socket io
io.on("connection",(socket)=>{
    //server send socketID back to client who connected
    socket.emit("S-send-socketID",socket.id);

    console.log("client "+socket.id+" connected.");

    //disconnect
    socket.on("disconnect",()=>{
        console.log("client "+socket.id+" disconnected.");
    });

    //receive data
    socket.on("C-send-data",(data)=>{
        console.log("client "+socket.id+" sent: "+data);

        //server send data back to all clients
        //io.sockets.emit("S-send-data-all",data+" (server send to all)");
        
        //server send data back to current client (only you)
        //socket.emit("S-send-data-all",data+" (server send to you)");

        //server send data back to other clients except you
        //socket.broadcast.emit("S-send-data-all",data+" (server send all except client who sent)");

        //io.to("socketID").emit()
    });
});

// test connect mongoDBatlas
var mongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
let uri = "mongodb+srv://admin:admin@firstcluster-tsfhe.mongodb.net";
let uri1 = "mongodb+srv://admin:admin@firstcluster-tsfhe.mongodb.net/testDB";
let mongoURI = "mongodb://admin:admin@firstcluster-shard-00-00-q9efv.mongodb.net:27017,firstcluster-shard-00-01-q9efv.mongodb.net:27017,firstcluster-shard-00-02-q9efv.mongodb.net:27017/testDB?ssl=true&replicaSet=FIRSTCluster-shard-0&authSource=admin&retryWrites=true";
mongoose.Promise=global.Promise;
// mongoose.connect(uri,{
//     reconnectTries: 100,
//     reconnectInterval: 500,
//     autoReconnect: true,
//     // useNewUrlParser: true,
//     dbName: 'testDB',
//     retryWrites: true
// })
// mongoose.connect("mongodb+srv://hoangduy:hoangduy@cluster0-a0ada.mongodb.net/test?retryWrites=true")
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://hoangduy:hoangduy@cluster0-a0ada.mongodb.net/test?retryWrites=true")
// mongoose.connect("mongodb+srv://nhd:nhd@firstcluster-tsfhe.mongodb.net/test?retryWrites=true")
    .then(()=>{
        console.log('connect OK');
    })
    .catch(e=>{console.log('connect DB failed')})
// mongoClient.Promise=global.Promise;
// mongoClient.connect(uri, { useNewUrlParser:true})
// .then(()=>{
//     console.log('connected');
// })
// .catch(e=>{console.log('connect failed')})

app.get('/',function(req,res){
    res.render('testchat');
});
