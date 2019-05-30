const express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var PORT=process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log("Server listen on port: "+PORT);
});

let users = ["admin","user1"];

app.use(express.static("public")); //auto access /public in client
app.set("view engine", "ejs");
app.set("views", "./views");

io.sockets.on('connection', (socket)=>{
    console.log('Some one connected, socketID: '+socket.id);

    console.log(users);
    //disconnect
    socket.on("disconnect",()=>{
        console.log("client "+socket.id+" disconnected.");
    });

    socket.on("user-login",(username)=>{
        if(users.indexOf(username)<0){
            return socket.emit("user-login-res",{content:"user-name is incorrect !", status:"false"});
            // return console.log("");
        }
        socket.username=username;
        return socket.emit("user-login-res",{content:"user-name is correct !", status:"true"});
    })
    socket.on("user-register",(username)=>{
        if(users.indexOf(username)>=0){
            return socket.emit("user-register-res",{content:"user-name is exist !", status:"false"});
            // return console.log("");
        }
        users.push(username);
        return socket.emit("user-register-res",{content:"Register successful !", status:"true"});
    })

    //send
    socket.on("Client-send-record",(sound)=>{
        console.log(sound);
        io.sockets.emit("Server-send-record", {content:sound});
    });
    socket.on("Client-send-message",(message)=>{
        // console.log(message);
        let msgWithUsr = `${socket.username}: ${message}`
        io.sockets.emit("Server-send-message", {content:msgWithUsr})
    })
})

app.get("/", (req,res)=>{
    // res.status(200).send("Welcome to chat application");
    return res.render('index');
})